import asyncHandler from "../../utils/asyncHandler.js";
import Category from "../../models/Category.js";

const DEFAULT_CATEGORIES = [
  { name: "SUV", description: "Sports Utility Vehicles" },
  { name: "MUV", description: "Multi-Utility & 7-Seater Vehicles" },
  { name: "Sedan", description: "Comfortable City & Highway Sedans" },
  { name: "Hatchback", description: "Compact & Fuel Efficient Cars" },
  { name: "Luxury", description: "Premium Executive & Wedding Cars" },
];

// @desc    Get all categories (public & admin)
// @route   GET /api/categories or GET /api/admin/categories
// @access  Public
export const getCategories = asyncHandler(async (req, res) => {
  let categories = await Category.find().sort({ createdAt: 1 });

  // Auto-seed defaults if table is empty
  if (categories.length === 0) {
    try {
      await Category.insertMany(DEFAULT_CATEGORIES);
      categories = await Category.find().sort({ createdAt: 1 });
    } catch {
      // Ignore unique constraint races
    }
  }

  res.json(categories);
});

// @desc    Create a new vehicle category
// @route   POST /api/admin/categories
// @access  Admin
export const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name || !name.trim()) {
    res.status(400);
    throw new Error("Category name is required");
  }

  const trimmedName = name.trim();
  const exists = await Category.findOne({
    name: { $regex: new RegExp(`^${trimmedName}$`, "i") },
  });

  if (exists) {
    res.status(400);
    throw new Error(`Category "${trimmedName}" already exists`);
  }

  const category = await Category.create({
    name: trimmedName,
    description: description?.trim() || "",
  });

  res.status(201).json(category);
});

// @desc    Delete a category
// @route   DELETE /api/admin/categories/:id
// @access  Admin
export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  await category.deleteOne();
  res.json({ message: "Category deleted successfully", id: req.params.id });
});
