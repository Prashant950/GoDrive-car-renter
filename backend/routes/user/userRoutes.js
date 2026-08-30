import express from "express";
import { updateProfile } from "../../controllers/user/userProfileController.js";
import { protect } from "../../middleware/auth.js";

const router = express.Router();

router.put("/profile", protect, updateProfile);

export default router;
