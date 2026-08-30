import asyncHandler from "../../utils/asyncHandler.js";
import Notification from "../../models/Notification.js";

// @desc    Get admin notifications
// @route   GET /api/admin/notifications or GET /api/notifications/admin
// @access  Admin
export const getAdminNotifications = asyncHandler(async (req, res) => {
  const items = await Notification.find({ forAdmin: true }).sort({ createdAt: -1 }).limit(100);
  const unread = await Notification.countDocuments({ forAdmin: true, read: false });
  res.json({ items, unread });
});

// @desc    Mark admin notification as read
// @route   PUT /api/admin/notifications/:id/read or PUT /api/notifications/:id/read
// @access  Admin
export const markAdminNotificationRead = asyncHandler(async (req, res) => {
  const n = await Notification.findById(req.params.id);
  if (!n) {
    res.status(404);
    throw new Error("Notification not found");
  }
  n.read = true;
  await n.save();
  res.json(n);
});

// @desc    Mark all admin notifications as read
// @route   PUT /api/admin/notifications/read-all
// @access  Admin
export const markAllAdminNotificationsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ forAdmin: true }, { read: true });
  res.json({ message: "All admin notifications marked as read" });
});

// @desc    Delete an admin notification
// @route   DELETE /api/admin/notifications/:id or DELETE /api/notifications/:id
// @access  Admin
export const deleteAdminNotification = asyncHandler(async (req, res) => {
  const n = await Notification.findById(req.params.id);
  if (!n) {
    res.status(404);
    throw new Error("Notification not found");
  }
  await n.deleteOne();
  res.json({ message: "Admin notification removed", id: req.params.id });
});
