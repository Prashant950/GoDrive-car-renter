import express from "express";
import {
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from "../../controllers/user/userNotificationController.js";
import { protect } from "../../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/", getMyNotifications);
router.put("/read-all", markAllNotificationsRead);
router.put("/:id/read", markNotificationRead);
router.delete("/:id", deleteNotification);

export default router;
