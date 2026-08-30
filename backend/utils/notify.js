import Notification from "../models/Notification.js";

/**
 * Create a notification. Pass { user } for a customer notification,
 * or { forAdmin: true } for an admin-facing one.
 */
export const notify = async ({ user = null, forAdmin = false, title, message, type = "system", link = "" }) => {
  try {
    await Notification.create({ user, forAdmin, title, message, type, link });
  } catch (err) {
    // Never let a notification failure break the main request
    console.error("Notification error:", err.message);
  }
};
