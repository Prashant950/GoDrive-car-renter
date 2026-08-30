import asyncHandler from "../../utils/asyncHandler.js";
import Booking from "../../models/Booking.js";
import { notify } from "../../utils/notify.js";

// @desc    Get all bookings with optional filters
// @route   GET /api/admin/bookings or GET /api/bookings
// @access  Admin
export const getAllBookings = asyncHandler(async (req, res) => {
  const { status, paymentStatus, search } = req.query;
  const filter = {};
  if (status && status !== "All") filter.status = status;
  if (paymentStatus && paymentStatus !== "All") filter.paymentStatus = paymentStatus;
  if (search) {
    filter.$or = [
      { customerName: { $regex: search, $options: "i" } },
      { customerEmail: { $regex: search, $options: "i" } },
      { customerMobile: { $regex: search, $options: "i" } },
      { vehicleName: { $regex: search, $options: "i" } },
    ];
  }

  const bookings = await Booking.find(filter)
    .populate("user", "name email mobile")
    .sort({ createdAt: -1 });
  res.json(bookings);
});

// @desc    Update booking status (Pending, Confirmed, Cancelled, Completed)
// @route   PUT /api/admin/bookings/:id/status or PUT /api/bookings/:id/status
// @access  Admin
export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const allowed = ["Pending", "Confirmed", "Cancelled", "Completed"];
  if (!allowed.includes(status)) {
    res.status(400);
    throw new Error("Invalid booking status");
  }

  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  booking.status = status;
  await booking.save();

  await notify({
    user: booking.user,
    type: "status",
    title: `Booking ${status}`,
    message: `Your booking for ${booking.vehicleName} is now ${status}.`,
    link: "/dashboard/bookings",
  });

  res.json(booking);
});
