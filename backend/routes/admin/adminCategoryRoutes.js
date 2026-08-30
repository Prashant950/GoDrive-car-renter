import express from "express";
import {
  getCategories,
  createCategory,
  deleteCategory,
} from "../../controllers/admin/adminCategoryController.js";
import { protect } from "../../middleware/auth.js";
import { admin } from "../../middleware/admin.js";

const router = express.Router();

router.get("/", getCategories); // admin can view
router.post("/", protect, admin, createCategory);
router.delete("/:id", protect, admin, deleteCategory);

export default router;
