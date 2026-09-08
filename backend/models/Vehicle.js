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

    // Pricing & Duration choice (Tiered duration discounts from rate sheet)
    pricePerDay: { type: Number, required: true }, // 0-3 Days (Base Rate)
    price3to7Days: { type: Number, default: 0 }, // 3-7 Days (Per Day)
    price7to15Days: { type: Number, default: 0 }, // 7-15 Days (Per Day)
    price15to20Days: { type: Number, default: 0 }, // 15-20 Days (Per Day)
    price20to29Days: { type: Number, default: 0 }, // 20-29 Days (Per Day)
    price1to3Months: { type: Number, default: 0 }, // 1-3 Months (Per Month)
    price3to6Months: { type: Number, default: 0 }, // 3-6 Months (Per Month)
    priceMoreThan6Months: { type: Number, default: 0 }, // More Than 6 Months (Per Month)
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
