import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      trim: true,
      default: "SUV",
    },
    fuelType: {
      type: String,
      enum: ["Petrol", "Diesel", "CNG+Petrol", "Electric", "Hybrid"],
      default: "Petrol",
    },
    transmission: {
      type: String,
      enum: ["Manual", "Automatic"],
      default: "Manual",
    },
    seats: { type: Number, default: 5 },
    luggage: { type: Number, default: 2 },
    color: { type: String, default: "" },
    year: { type: Number, default: new Date().getFullYear() },
    mileage: { type: String, default: "" }, // e.g. "20 km/l"

    // Pricing & Duration choice
    pricePerDay: { type: Number, required: true }, // Rate entered
    priceDuration: {
      type: String,
      enum: ["24 Hours / Per Day", "1 Week", "1 Month"],
      default: "24 Hours / Per Day",
    },
    withDriverPrice: { type: Number, default: 800 }, // extra per day for driver

    image: { type: String, required: true }, // main image URL
    gallery: [{ type: String }], // extra image URLs

    description: { type: String, default: "" },
    features: [{ type: String }],

    rating: { type: Number, default: 4.6 },
    trips: { type: Number, default: 0 },

    available: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Vehicle = mongoose.model("Vehicle", vehicleSchema);
export default Vehicle;
