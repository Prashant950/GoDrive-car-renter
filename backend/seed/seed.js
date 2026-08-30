import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Vehicle from "../models/Vehicle.js";
import Booking from "../models/Booking.js";
import Notification from "../models/Notification.js";
import Contact from "../models/Contact.js";

dotenv.config();

const BASE = process.env.SERVER_URL || "http://localhost:5000";
const img = (file) => `${BASE}/uploads/${file}`;

const vehicles = [
  {
    name: "Toyota Hyryder Black (Petrol)",
    brand: "Toyota",
    category: "SUV",
    fuelType: "Petrol",
    transmission: "Manual",
    seats: 5,
    luggage: 3,
    color: "Black",
    year: 2024,
    mileage: "21 km/l",
    pricePerDay: 2800,
    withDriverPrice: 900,
    image: img("hyryder-black-petrol.webp"),
    rating: 4.7,
    trips: 128,
    featured: true,
    description:
      "The Toyota Urban Cruiser Hyryder in bold black blends SUV presence with efficient petrol performance — ideal for city commutes and weekend getaways alike.",
    features: ["Sunroof", "Ventilated Seats", "Wireless CarPlay", "6 Airbags", "Rear Camera", "Cruise Control"],
  },
  {
    name: "Toyota Hyryder Black (CNG+Petrol)",
    brand: "Toyota",
    category: "SUV",
    fuelType: "CNG+Petrol",
    transmission: "Manual",
    seats: 5,
    luggage: 3,
    color: "Black",
    year: 2024,
    mileage: "26 km/kg",
    pricePerDay: 2900,
    withDriverPrice: 900,
    image: img("hyryder-black-cng.avif"),
    rating: 4.6,
    trips: 96,
    featured: false,
    description:
      "A dual-fuel Hyryder that keeps running costs low without compromising on comfort. Great for long outstation trips where economy matters.",
    features: ["CNG + Petrol", "Touchscreen Infotainment", "6 Airbags", "Rear Camera", "Alloy Wheels", "Push Start"],
  },
  {
    name: "Maruti Suzuki Grand Vitara White (CNG+Petrol)",
    brand: "Maruti Suzuki",
    category: "SUV",
    fuelType: "CNG+Petrol",
    transmission: "Manual",
    seats: 5,
    luggage: 3,
    color: "White",
    year: 2024,
    mileage: "27 km/kg",
    pricePerDay: 2700,
    withDriverPrice: 900,
    image: img("grand-vitara-white.png"),
    rating: 4.6,
    trips: 141,
    featured: true,
    description:
      "The Grand Vitara pairs a premium cabin with frugal dual-fuel running. A crowd favourite for family road trips and corporate travel.",
    features: ["Panoramic Sunroof", "360 Camera", "Head-Up Display", "Ventilated Seats", "6 Airbags", "CNG + Petrol"],
  },
  {
    name: "Maruti Suzuki Victoris White & Silver (CNG+Petrol)",
    brand: "Maruti Suzuki",
    category: "SUV",
    fuelType: "CNG+Petrol",
    transmission: "Automatic",
    seats: 5,
    luggage: 3,
    color: "White / Silver",
    year: 2025,
    mileage: "25 km/kg",
    pricePerDay: 3000,
    withDriverPrice: 1000,
    image: img("victoris-white.avif"),
    gallery: [img("victoris-silver.webp")],
    rating: 4.8,
    trips: 54,
    featured: true,
    description:
      "The all-new Victoris is a bold, tech-loaded SUV with a spacious cabin and smooth automatic drive — a standout choice for premium journeys.",
    features: ["ADAS", "Panoramic Sunroof", "Automatic", "Ventilated Seats", "9 Airbags", "Wireless Charging"],
  },
  {
    name: "Toyota Hyryder Automatic Blue (CNG+Petrol)",
    brand: "Toyota",
    category: "SUV",
    fuelType: "CNG+Petrol",
    transmission: "Automatic",
    seats: 5,
    luggage: 3,
    color: "Blue",
    year: 2024,
    mileage: "24 km/kg",
    pricePerDay: 3200,
    withDriverPrice: 1000,
    image: img("hyryder-blue.avif"),
    rating: 4.7,
    trips: 73,
    featured: true,
    description:
      "An automatic Hyryder in a striking blue finish — effortless in traffic, economical on the highway, and comfortable for everyone on board.",
    features: ["Automatic", "Sunroof", "Ventilated Seats", "CNG + Petrol", "6 Airbags", "Wireless CarPlay"],
  },
  {
    name: "Hyundai Creta White (Petrol)",
    brand: "Hyundai",
    category: "SUV",
    fuelType: "Petrol",
    transmission: "Automatic",
    seats: 5,
    luggage: 3,
    color: "White",
    year: 2024,
    mileage: "18 km/l",
    pricePerDay: 3000,
    withDriverPrice: 1000,
    image: img("creta-white.webp"),
    rating: 4.8,
    trips: 210,
    featured: true,
    description:
      "India's best-loved SUV. The Creta delivers a plush ride, loaded features and a commanding stance — perfect for city and outstation trips.",
    features: ["Panoramic Sunroof", "Automatic", "Ventilated Seats", "Bose Audio", "6 Airbags", "ADAS"],
  },
  {
    name: "Tata Safari White (Diesel)",
    brand: "Tata",
    category: "SUV",
    fuelType: "Diesel",
    transmission: "Automatic",
    seats: 7,
    luggage: 4,
    color: "White",
    year: 2024,
    mileage: "16 km/l",
    pricePerDay: 3800,
    withDriverPrice: 1100,
    image: img("tata-safari-white.avif"),
    rating: 4.7,
    trips: 88,
    featured: false,
    description:
      "A 7-seater diesel powerhouse with imposing road presence. The Safari is built for big families and long, comfortable highway drives.",
    features: ["7 Seater", "Diesel Automatic", "Panoramic Sunroof", "ADAS", "JBL Audio", "Ventilated Seats"],
  },
  {
    name: "Maruti Suzuki Ertiga White (CNG+Petrol)",
    brand: "Maruti Suzuki",
    category: "MUV",
    fuelType: "CNG+Petrol",
    transmission: "Manual",
    seats: 7,
    luggage: 3,
    color: "White",
    year: 2024,
    mileage: "26 km/kg",
    pricePerDay: 2600,
    withDriverPrice: 900,
    image: img("ertiga-white.webp"),
    rating: 4.6,
    trips: 176,
    featured: true,
    description:
      "The most popular 7-seater MPV in India. Roomy, reliable and extremely economical on CNG — the go-to for group travel and airport runs.",
    features: ["7 Seater", "CNG + Petrol", "Touchscreen", "Cruise Control", "Rear AC Vents", "4 Airbags"],
  },
  {
    name: "Maruti Suzuki Fronx White (CNG+Petrol)",
    brand: "Maruti Suzuki",
    category: "SUV",
    fuelType: "CNG+Petrol",
    transmission: "Manual",
    seats: 5,
    luggage: 2,
    color: "White",
    year: 2024,
    mileage: "28 km/kg",
    pricePerDay: 2200,
    withDriverPrice: 800,
    image: img("fronx-white.avif"),
    rating: 4.5,
    trips: 132,
    featured: false,
    description:
      "A stylish compact SUV coupe that's nippy in the city and light on the wallet. The Fronx is perfect for solo drivers and small families.",
    features: ["CNG + Petrol", "Head-Up Display", "360 Camera", "Wireless CarPlay", "6 Airbags", "Push Start"],
  },
  {
    name: "Maruti Suzuki Baleno White (Petrol)",
    brand: "Maruti Suzuki",
    category: "Hatchback",
    fuelType: "Petrol",
    transmission: "Manual",
    seats: 5,
    luggage: 2,
    color: "White",
    year: 2023,
    mileage: "22 km/l",
    pricePerDay: 1800,
    withDriverPrice: 800,
    image: img("baleno-white.jpg"),
    rating: 4.5,
    trips: 240,
    featured: false,
    description:
      "A premium hatchback that's fuel-efficient, easy to drive and comfortable. An economical pick for city transfers and daily rentals.",
    features: ["Petrol", "Touchscreen", "Rear Camera", "Cruise Control", "Alloy Wheels", "Dual Airbags"],
  },
  {
    name: "Maruti Suzuki Baleno Automatic White (Petrol)",
    brand: "Maruti Suzuki",
    category: "Hatchback",
    fuelType: "Petrol",
    transmission: "Automatic",
    seats: 5,
    luggage: 2,
    color: "White",
    year: 2024,
    mileage: "22 km/l",
    pricePerDay: 2000,
    withDriverPrice: 800,
    image: img("baleno-auto-white.avif"),
    rating: 4.6,
    trips: 158,
    featured: false,
    description:
      "The automatic Baleno takes the stress out of city driving. Smooth, frugal and feature-rich — a favourite for airport and city transfers.",
    features: ["Automatic", "Petrol", "Touchscreen", "Rear Camera", "Cruise Control", "Head-Up Display"],
  },
  {
    name: "Toyota Innova Crysta White (Diesel)",
    brand: "Toyota",
    category: "MUV",
    fuelType: "Diesel",
    transmission: "Manual",
    seats: 7,
    luggage: 4,
    color: "White",
    year: 2024,
    mileage: "15 km/l",
    pricePerDay: 4500,
    withDriverPrice: 1200,
    image: img("innova-crysta-white.avif"),
    rating: 4.9,
    trips: 305,
    featured: true,
    description:
      "The undisputed king of comfortable long-distance travel. The Innova Crysta is the top choice for weddings, corporate fleets and outstation tours.",
    features: ["7 Seater", "Diesel", "Captain Seats", "Rear AC", "Spacious Boot", "Premium Interior"],
  },
  {
    name: "Toyota Fortuner Black Automatic (Diesel)",
    brand: "Toyota",
    category: "Luxury",
    fuelType: "Diesel",
    transmission: "Automatic",
    seats: 7,
    luggage: 4,
    color: "Black",
    year: 2024,
    mileage: "14 km/l",
    pricePerDay: 7000,
    withDriverPrice: 1500,
    image: img("fortuner-black.png"),
    rating: 4.9,
    trips: 187,
    featured: true,
    description:
      "The ultimate statement SUV. A black Fortuner 4x4 automatic commands respect on every road — reserved for weddings, VIPs and premium tours.",
    features: ["7 Seater", "4x4", "Diesel Automatic", "Leather Seats", "JBL Audio", "Premium Luxury"],
  },
];

const run = async () => {
  await connectDB();
  const destroy = process.argv.includes("--destroy");

  try {
    await Promise.all([
      Vehicle.deleteMany(),
      Booking.deleteMany(),
      Notification.deleteMany(),
      Contact.deleteMany(),
      User.deleteMany(),
    ]);
    console.log("🧹 Cleared existing data");

    if (destroy) {
      console.log("✅ Database emptied.");
      await mongoose.connection.close();
      process.exit(0);
    }

    // Admin
    await User.create({
      name: process.env.ADMIN_NAME || "Super Admin",
      email: (process.env.ADMIN_EMAIL || "admin@godriveselfdrive.com").toLowerCase(),
      password: process.env.ADMIN_PASSWORD || "Admin@123",
      mobile: process.env.ADMIN_MOBILE || "9999999999",
      role: "admin",
      city: "Mumbai",
    });

    // Demo customer
    await User.create({
      name: "Rahul Verma",
      email: "user@godriveselfdrive.com",
      password: "User@123",
      mobile: "9876543210",
      role: "user",
      city: "Pune",
    });

    await Vehicle.insertMany(vehicles);

    console.log(`✅ Seeded ${vehicles.length} vehicles`);
    console.log("   Admin login  →  admin@godriveselfdrive.com / Admin@123");
    console.log("   User login   →  user@godriveselfdrive.com  / User@123");
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    await mongoose.connection.close();
    process.exit(1);
  }
};

run();
