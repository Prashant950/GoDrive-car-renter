import crypto from "crypto";
import Razorpay from "razorpay";
import asyncHandler from "../../utils/asyncHandler.js";
import Booking from "../../models/Booking.js";
import { notify } from "../../utils/notify.js";
import { sendEmail, getBookingConfirmationEmailTemplate } from "../../utils/sendEmail.js";

// Helper currency format
const money = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

// Initialize Razorpay instance
const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_API_KEY;
  const key_secret = process.env.RAZORPAY_SECRET_KEY;

  if (!key_id || !key_secret) {
    throw new Error("Razorpay API credentials not configured in environment");
  }

  return new Razorpay({ key_id, key_secret });
};

// @desc    Get Razorpay Public Key
// @route   GET /api/payments/key
// @access  Public / Private
export const getRazorpayKey = asyncHandler(async (req, res) => {
  res.json({ key: process.env.RAZORPAY_API_KEY || "" });
});

// @desc    Create Razorpay Order for Booking Token
// @route   POST /api/payments/create-order
// @access  Private
export const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { bookingId } = req.body;

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }
  if (booking.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized for this booking");
  }
  if (booking.paymentStatus === "Paid") {
    res.status(400);
    throw new Error("Booking registration token is already paid");
  }

  const razorpay = getRazorpayInstance();
  const tokenAmount = booking.registrationFee || 2;
  const amountInPaise = Math.round(tokenAmount * 100);

  const options = {
    amount: amountInPaise,
    currency: "INR",
    receipt: `rcpt_${booking._id.toString().slice(-10)}`,
    notes: {
      bookingId: booking._id.toString(),
      vehicleName: booking.vehicleName,
      customerEmail: req.user.email,
      customerMobile: req.user.mobile,
    },
  };

  const order = await razorpay.orders.create(options);

  res.json({
    success: true,
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    key: process.env.RAZORPAY_API_KEY,
    booking,
  });
});

// @desc    Verify Razorpay Payment Signature & Send Email Receipt + Admin Real-time Alerts
// @route   POST /api/payments/verify
// @access  Private
export const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const { bookingId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }
  if (booking.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized for this booking");
  }

  // Verify HMAC SHA256 Signature
  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (!isAuthentic) {
    res.status(400);
    throw new Error("Payment signature verification failed. Untrusted payment.");
  }

  // Update Booking Status to Paid & Confirmed
  booking.paymentStatus = "Paid";
  booking.amountPaid = booking.registrationFee || 2;
  booking.balanceDue = Math.max(0, booking.estimatedTotal - (booking.registrationFee || 2));
  booking.paymentId = razorpay_payment_id;
  booking.orderId = razorpay_order_id;
  booking.paidAt = new Date();
  booking.status = "Confirmed";
  await booking.save();

  // 1. Send Rich HTML Confirmation Email to Customer
  const recipientEmail = booking.customerEmail || req.user.email;
  if (recipientEmail) {
    try {
      const emailHtml = getBookingConfirmationEmailTemplate(booking);
      await sendEmail({
        to: recipientEmail,
        subject: `Booking Confirmed: ${booking.vehicleName} (ID: ${booking._id.toString().slice(-8).toUpperCase()}) - GoDrive`,
        html: emailHtml,
        text: `Hello ${booking.customerName}, your booking for ${booking.vehicleName} is Confirmed! Advance token of ${money(booking.amountPaid)} received. Remaining balance of ${money(booking.balanceDue)} is payable at car handover.`,
      });
      console.log(`Booking confirmation email dispatched to ${recipientEmail}`);
    } catch (emailErr) {
      console.error("Failed to send booking confirmation email:", emailErr.message);
    }
  }

  // 2. Send in-app notification to Customer
  await notify({
    user: booking.user,
    type: "payment",
    title: "Advance Token Received 🎉",
    message: `Payment of ${money(booking.amountPaid)} received via Razorpay for ${booking.vehicleName}. Booking ID: ${booking._id.toString().slice(-8).toUpperCase()}. Check your email for receipt!`,
    link: "/dashboard/bookings",
  });

  // 3. Send real-time notification to Admin
  await notify({
    forAdmin: true,
    type: "booking",
    title: "New Booking Confirmed + Paid 💰",
    message: `${booking.customerName} (${booking.customerMobile}) paid ${money(booking.amountPaid)} token via Razorpay for ${booking.vehicleName}. Total: ${money(booking.estimatedTotal)}, Due: ${money(booking.balanceDue)}.`,
    link: "/admin/bookings",
  });

  res.json({
    success: true,
    message: "Payment verified, confirmation email sent, and booking confirmed successfully!",
    booking,
  });
});

// @desc    Legacy / Demo fallback
// @route   POST /api/payments/registration
// @access  Private
export const payRegistration = asyncHandler(async (req, res) => {
  const { bookingId } = req.body;

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }
  if (booking.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to pay for this booking");
  }
  if (booking.paymentStatus === "Paid") {
    res.status(400);
    throw new Error("Registration fee already paid for this booking");
  }

  const paymentId = "PAY_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8).toUpperCase();
  booking.paymentStatus = "Paid";
  booking.amountPaid = booking.registrationFee || 2;
  booking.balanceDue = Math.max(0, booking.estimatedTotal - (booking.registrationFee || 2));
  booking.paymentId = paymentId;
  booking.paidAt = new Date();
  booking.status = "Confirmed";
  await booking.save();

  // Send Confirmation Email
  const recipientEmail = booking.customerEmail || req.user.email;
  if (recipientEmail) {
    try {
      const emailHtml = getBookingConfirmationEmailTemplate(booking);
      await sendEmail({
        to: recipientEmail,
        subject: `Booking Confirmed: ${booking.vehicleName} - GoDrive`,
        html: emailHtml,
      });
    } catch (emailErr) {
      console.error("Failed to send booking confirmation email:", emailErr.message);
    }
  }

  await notify({
    user: booking.user,
    type: "payment",
    title: "Registration fee received",
    message: `We received your ${money(booking.amountPaid)} payment for ${booking.vehicleName}.`,
    link: "/dashboard/bookings",
  });

  await notify({
    forAdmin: true,
    type: "booking",
    title: "New Booking Confirmed + Paid 💰",
    message: `${booking.customerName} paid ${money(booking.amountPaid)} for ${booking.vehicleName}.`,
    link: "/admin/bookings",
  });

  res.json({
    success: true,
    paymentId,
    message: "Payment successful",
    booking,
  });
});
