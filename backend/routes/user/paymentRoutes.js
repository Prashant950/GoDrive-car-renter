import express from "express";
import {
  getRazorpayKey,
  createRazorpayOrder,
  verifyRazorpayPayment,
  payRegistration,
} from "../../controllers/user/userPaymentController.js";
import { protect } from "../../middleware/auth.js";

const router = express.Router();

router.get("/key", getRazorpayKey);
router.post("/create-order", protect, createRazorpayOrder);
router.post("/verify", protect, verifyRazorpayPayment);
router.post("/registration", protect, payRegistration);

export default router;
