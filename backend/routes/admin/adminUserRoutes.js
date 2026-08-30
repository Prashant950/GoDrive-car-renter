import express from "express";
import {
  getUsers,
  toggleUser,
  deleteUser,
  getStats,
} from "../../controllers/admin/adminUserController.js";
import { protect } from "../../middleware/auth.js";
import { admin } from "../../middleware/admin.js";

const router = express.Router();

router.use(protect, admin);

router.get("/stats", getStats);
router.get("/", getUsers);
router.put("/:id/toggle", toggleUser);
router.delete("/:id", deleteUser);

export default router;
