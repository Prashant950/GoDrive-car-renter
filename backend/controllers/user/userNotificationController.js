import asyncHandler from "../../utils/asyncHandler.js";
import Notification from "../../models/Notification.js";

// @desc    Get user's notifications
// @route   GET /api/notifications
// @access  Private
export const getMyNotifications = asyncHandler(async (req, res) => {
  const items = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(100);
  const unread = await Notification.countDocuments({ user: req.user._id, read: false });
  res.json({ items, unread });
});

// @desc    Mark one notification read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markNotificationRead = asyncHandler(async (req, res) => {
  const n = await Notification.findById(req.params.id);
  if (!n) {
    res.status(404);
    throw new Error("Notification not found");
  }
  if (n.user && n.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized");
  }
  n.read = true;
  await n.save();
  res.json(n);
});

// @desc    Mark all user notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
export const markAllNotificationsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ user: req.user._id }, { read: true });
  res.json({ message: "All marked as read" });
});

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
export const deleteNotification = asyncHandler(async (req, res) => {
  const n = await Notification.findById(req.params.id);
  if (!n) {
    res.status(404);
    throw new Error("Notification not found");
  }
  if (n.user && n.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized");
  }
  await n.deleteOne();
  res.json({ message: "Notification removed" });
});
