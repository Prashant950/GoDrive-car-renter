import asyncHandler from "../../utils/asyncHandler.js";
import Vehicle from "../../models/Vehicle.js";
import { uploadToCloudinary } from "../../middleware/upload.js";

// @desc    Create a new vehicle (with Cloudinary image upload)
// @route   POST /api/admin/vehicles or POST /api/vehicles
// @access  Admin
export const createVehicle = asyncHandler(async (req, res) => {
  const data = { ...req.body };

  // Parse array/boolean fields from multipart/form-data
  if (typeof data.features === "string") {
    data.features = data.features.split(",").map((f) => f.trim()).filter(Boolean);
  }
  ["available", "featured"].forEach((k) => {
    if (typeof data[k] === "string") data[k] = data[k] === "true";
  });
  ["seats", "luggage", "year", "pricePerDay", "withDriverPrice", "rating", "trips"].forEach((k) => {
    if (data[k] !== undefined && data[k] !== "") data[k] = Number(data[k]);
  });

  // Upload image to Cloudinary if file provided
  if (req.file) {
    const cloudinaryUrl = await uploadToCloudinary(req.file.buffer, "godrive/vehicles");
    if (cloudinaryUrl) {
      data.image = cloudinaryUrl;
    }
  }

  if (!data.image) {
    res.status(400);
    throw new Error("A vehicle image is required. Please upload an image file or provide a valid image URL.");
  }

  const vehicle = await Vehicle.create(data);
  res.status(201).json(vehicle);
});

// @desc    Update a vehicle (with optional Cloudinary image upload)
// @route   PUT /api/admin/vehicles/:id or PUT /api/vehicles/:id
// @access  Admin
export const updateVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) {
    res.status(404);
    throw new Error("Vehicle not found");
  }

  const data = { ...req.body };
  if (typeof data.features === "string") {
    data.features = data.features.split(",").map((f) => f.trim()).filter(Boolean);
  }
  ["available", "featured"].forEach((k) => {
    if (typeof data[k] === "string") data[k] = data[k] === "true";
  });
  ["seats", "luggage", "year", "pricePerDay", "withDriverPrice", "rating", "trips"].forEach((k) => {
    if (data[k] !== undefined && data[k] !== "") data[k] = Number(data[k]);
  });

  if (req.file) {
    const cloudinaryUrl = await uploadToCloudinary(req.file.buffer, "godrive/vehicles");
    if (cloudinaryUrl) {
      data.image = cloudinaryUrl;
    }
  }

  Object.assign(vehicle, data);
  const updated = await vehicle.save();
  res.json(updated);
});

// @desc    Delete a vehicle
// @route   DELETE /api/admin/vehicles/:id or DELETE /api/vehicles/:id
// @access  Admin
export const deleteVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) {
    res.status(404);
    throw new Error("Vehicle not found");
  }
  await vehicle.deleteOne();
  res.json({ message: "Vehicle removed successfully", id: req.params.id });
});
