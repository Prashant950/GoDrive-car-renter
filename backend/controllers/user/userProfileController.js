import asyncHandler from "../../utils/asyncHandler.js";
import User from "../../models/User.js";

const sanitize = (u) => ({
  _id: u._id,
  name: u.name,
  email: u.email,
  mobile: u.mobile,
  role: u.role,
  avatar: u.avatar,
  address: u.address,
  city: u.city,
  isActive: u.isActive,
  createdAt: u.createdAt,
});

// @desc    Update current user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("+password");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const { name, mobile, address, city, password } = req.body;
  if (name) user.name = name;
  if (mobile) user.mobile = mobile;
  if (address !== undefined) user.address = address;
  if (city !== undefined) user.city = city;
  if (password) user.password = password; // re-hashed by mongoose pre-save hook

  const updated = await user.save();
  res.json({ user: sanitize(updated) });
});
