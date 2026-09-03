import asyncHandler from "../../utils/asyncHandler.js";
import User from "../../models/User.js";
import generateToken from "../../utils/generateToken.js";
import { sendEmail, getOtpEmailTemplate, getWelcomeEmailTemplate } from "../../utils/sendEmail.js";

const sanitize = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  mobile: user.mobile,
  role: user.role,
  avatar: user.avatar,
  address: user.address,
  city: user.city,
  createdAt: user.createdAt,
});

// @desc    Register a new user (default role: user, or admin if explicitly passed)
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, mobile, role, address, city } = req.body;

  if (!name || !email || !password || !mobile) {
    res.status(400);
    throw new Error("Please fill all required fields (name, email, password, mobile)");
  }

  const emailLower = email.trim().toLowerCase();
  const exists = await User.findOne({ email: emailLower });
  if (exists) {
    res.status(400);
    throw new Error("An account with that email already exists");
  }

  const cleanMobile = mobile.toString().replace(/\D/g, "").trim();
  if (cleanMobile.length !== 10) {
    res.status(400);
    throw new Error("Mobile number exactly 10 digits ka hona chahiye");
  }

  const mobileExists = await User.findOne({ mobile: cleanMobile });
  if (mobileExists) {
    res.status(400);
    throw new Error("An account with that mobile number already exists");
  }

  // Assigned role: default is 'user', but allow 'admin' if explicitly specified (e.g. from Postman or admin creation)
  const assignedRole = role === "admin" ? "admin" : "user";

  const user = await User.create({
    name: name.trim(),
    email: emailLower,
    password,
    mobile: cleanMobile,
    role: assignedRole,
    address: address || "",
    city: city || "",
  });

  // Send branded Welcome Email to the newly registered user
  try {
    await sendEmail({
      to: user.email,
      subject: `🎉 Welcome to GoDrive Self Drive, ${user.name}! Account Created Successfully`,
      text: `Welcome to GoDrive Self Drive! Your account has been created successfully.\nName: ${user.name}\nEmail: ${user.email}\nMobile: ${user.mobile}\nStart booking with only ₹500 advance token.`,
      html: getWelcomeEmailTemplate(user),
    });
    console.log(`[Registration] Welcome email sent successfully to ${user.email}`);
  } catch (emailErr) {
    console.error(`[Registration] Failed to send welcome email to ${user.email}:`, emailErr.message);
  }

  const token = generateToken(user._id);
  res.status(201).json({ token, user: sanitize(user) });
});

// @desc    Login via Email OR Mobile + Password
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const { email, mobile, identifier, password } = req.body;

  const iden = (identifier || email || mobile || "").trim();
  if (!iden || !password) {
    res.status(400);
    throw new Error("Please provide your email/mobile and password");
  }

  // Search by email OR mobile number
  const user = await User.findOne({
    $or: [{ email: iden.toLowerCase() }, { mobile: iden }],
  }).select("+password");

  if (!user) {
    res.status(404);
    throw new Error("This account is not registered. Please register first!");
  }

  if (!(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Incorrect password. Please check your password or reset it.");
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error("Account is disabled. Please contact support.");
  }

  const token = generateToken(user._id);
  res.json({ token, user: sanitize(user) });
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  res.json({ user: sanitize(req.user) });
});

// @desc    Send 6-digit OTP for Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email, identifier } = req.body;
  const iden = (email || identifier || "").trim().toLowerCase();

  if (!iden) {
    res.status(400);
    throw new Error("Please enter your registered email address");
  }

  const user = await User.findOne({
    $or: [{ email: iden }, { mobile: iden }],
  });

  if (!user) {
    res.status(404);
    throw new Error("No account found with that email or mobile number");
  }

  // Generate 6 digit numeric OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.resetPasswordOtp = otp;
  user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes expiry
  await user.save();

  try {
    await sendEmail({
      to: user.email,
      subject: `🔐 GoDrive Password Reset OTP: ${otp}`,
      text: `Your password reset OTP is ${otp}. It is valid for 10 minutes.`,
      html: getOtpEmailTemplate(user.name, otp),
    });

    res.json({
      success: true,
      message: `OTP sent successfully to ${user.email}. Please check your inbox and spam folder.`,
      email: user.email,
    });
  } catch (error) {
    user.resetPasswordOtp = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.status(500);
    throw new Error(`Failed to send OTP email. ${error.message}`);
  }
});

// @desc    Verify OTP and Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    res.status(400);
    throw new Error("Email, OTP and new password are required");
  }

  if (newPassword.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters long");
  }

  const emailLower = email.trim().toLowerCase();
  const user = await User.findOne({ email: emailLower }).select(
    "+password +resetPasswordOtp +resetPasswordExpires"
  );

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (
    !user.resetPasswordOtp ||
    user.resetPasswordOtp !== otp.trim() ||
    !user.resetPasswordExpires ||
    user.resetPasswordExpires < Date.now()
  ) {
    res.status(400);
    throw new Error("Invalid or expired OTP. Please request a new one.");
  }

  // Update password and clear OTP
  user.password = newPassword;
  user.resetPasswordOtp = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({
    success: true,
    message: "Password reset successfully! You can now log in with your new password.",
  });
});
