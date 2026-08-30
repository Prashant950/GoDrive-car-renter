import express from "express";
import {
  getAdminNotifications,
  markAdminNotificationRead,
  markAllAdminNotificationsRead,
  deleteAdminNotification,
} from "../../controllers/admin/adminNotificationController.js";
import { protect } from "../../middleware/auth.js";
import { admin } from "../../middleware/admin.js";

const router = express.Router();

router.use(protect, admin);

router.get("/", getAdminNotifications);
router.put("/read-all", markAllAdminNotificationsRead);
router.put("/:id/read", markAdminNotificationRead);
router.delete("/:id", deleteAdminNotification);

export default router;
