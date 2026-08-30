import asyncHandler from "../../utils/asyncHandler.js";
import User from "../../models/User.js";
import Booking from "../../models/Booking.js";
import Vehicle from "../../models/Vehicle.js";
import Contact from "../../models/Contact.js";

const sanitize = (u) => ({
  _id: u._id,
  name: u.name,
  email: u.email,
  mobile: u.mobile,
  role: u.role,
  avatar: u.avatar,
  address: u.address,
  city: u.city,
  isActive: u.isActive,
  createdAt: u.createdAt,
});

// @desc    List all users
// @route   GET /api/admin/users or GET /api/users
// @access  Admin
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json(users.map(sanitize));
});

// @desc    Enable / disable a user account
// @route   PUT /api/admin/users/:id/toggle or PUT /api/users/:id/toggle
// @access  Admin
export const toggleUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  if (user.role === "admin") {
    res.status(400);
    throw new Error("Cannot disable an admin account");
  }
  user.isActive = !user.isActive;
  await user.save();
  res.json(sanitize(user));
});

// @desc    Delete a user account
// @route   DELETE /api/admin/users/:id or DELETE /api/users/:id
// @access  Admin
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  if (user.role === "admin") {
    res.status(400);
    throw new Error("Cannot delete an admin account");
  }
  await user.deleteOne();
  res.json({ message: "User removed successfully", id: req.params.id });
});

// @desc    Get Admin Dashboard Statistics
// @route   GET /api/admin/users/stats or GET /api/users/stats
// @access  Admin
export const getStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalVehicles, totalBookings, totalEnquiries, pendingEnquiries, paidAgg, statusAgg, recentBookings] =
    await Promise.all([
      User.countDocuments({ role: "user" }),
      Vehicle.countDocuments(),
      Booking.countDocuments(),
      Contact.countDocuments(),
      Contact.countDocuments({ status: "New" }),
      Booking.aggregate([
        { $match: { paymentStatus: "Paid" } },
        { $group: { _id: null, total: { $sum: "$amountPaid" } } },
      ]),
      Booking.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      Booking.find().sort({ createdAt: -1 }).limit(30),
    ]);

  // Bookings for the last 7 days
  const since = new Date();
  since.setDate(since.getDate() - 6);
  since.setHours(0, 0, 0, 0);
  const daily = await Booking.aggregate([
    { $match: { createdAt: { $gte: since } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 },
        revenue: { $sum: "$amountPaid" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const statusCounts = statusAgg.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), {});

  res.json({
    totalUsers,
    totalVehicles,
    totalBookings,
    totalEnquiries,
    pendingEnquiries,
    totalRevenue: paidAgg[0]?.total || 0,
    pendingBookings: statusCounts.Pending || 0,
    confirmedBookings: statusCounts.Confirmed || 0,
    completedBookings: statusCounts.Completed || 0,
    cancelledBookings: statusCounts.Cancelled || 0,
    daily,
    recentBookings,
  });
});
