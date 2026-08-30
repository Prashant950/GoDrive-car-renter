import asyncHandler from "../../utils/asyncHandler.js";
import Vehicle from "../../models/Vehicle.js";

// @desc    List vehicles (public / customer) with optional filters
// @route   GET /api/vehicles
// @access  Public
export const getVehicles = asyncHandler(async (req, res) => {
  const { search, category, fuelType, transmission, featured, available, sort } = req.query;
  const filter = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { brand: { $regex: search, $options: "i" } },
    ];
  }
  if (category && category !== "All") filter.category = category;
  if (fuelType && fuelType !== "All") filter.fuelType = fuelType;
  if (transmission && transmission !== "All") filter.transmission = transmission;
  if (featured === "true") filter.featured = true;
  if (available === "true") filter.available = true;

  let sortBy = { createdAt: -1 };
  if (sort === "price-asc") sortBy = { pricePerDay: 1 };
  if (sort === "price-desc") sortBy = { pricePerDay: -1 };
  if (sort === "rating") sortBy = { rating: -1 };

  const vehicles = await Vehicle.find(filter).sort(sortBy);
  res.json(vehicles);
});

// @desc    Get single vehicle details
// @route   GET /api/vehicles/:id
// @access  Public
export const getVehicleById = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) {
    res.status(404);
    throw new Error("Vehicle not found");
  }
  res.json(vehicle);
});
