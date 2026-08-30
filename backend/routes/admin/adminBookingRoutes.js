import express from "express";
import {
  getAllBookings,
  updateBookingStatus,
} from "../../controllers/admin/adminBookingController.js";
import { protect } from "../../middleware/auth.js";
import { admin } from "../../middleware/admin.js";

const router = express.Router();

router.use(protect, admin);

router.get("/", getAllBookings);
router.put("/:id/status", updateBookingStatus);

export default router;
