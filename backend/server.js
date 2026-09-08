import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/error.js";

// ---- User & Public Routes ----
import userAuthRoutes from "./routes/user/authRoutes.js";
import userVehicleRoutes from "./routes/user/vehicleRoutes.js";
import userBookingRoutes from "./routes/user/bookingRoutes.js";
import userProfileRoutes from "./routes/user/userRoutes.js";
import userContactRoutes from "./routes/user/contactRoutes.js";
import userNotificationRoutes from "./routes/user/notificationRoutes.js";
import userPaymentRoutes from "./routes/user/paymentRoutes.js";
import categoryRoutes from "./routes/user/categoryRoutes.js";

// ---- Admin Routes ----
import adminVehicleRoutes from "./routes/admin/adminVehicleRoutes.js";
import adminBookingRoutes from "./routes/admin/adminBookingRoutes.js";
import adminUserRoutes from "./routes/admin/adminUserRoutes.js";
import adminContactRoutes from "./routes/admin/adminContactRoutes.js";
import adminNotificationRoutes from "./routes/admin/adminNotificationRoutes.js";
import adminCategoryRoutes from "./routes/admin/adminCategoryRoutes.js";

dotenv.config();
connectDB();

const app = express();

// ---- Core middleware ----
app.use(
  cors({
    origin: process.env.CLIENT_URL?.split(",") || "*",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));

// ---- Health check ----
app.get("/", (req, res) =>
  res.json({
    status: "ok",
    service: "GoDrive Self Drive Car Rental API",
    version: "2.0.0",
  })
);

// ---- User / Customer API Routes ----
app.use("/api/auth", userAuthRoutes);
app.use("/api/vehicles", userVehicleRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/bookings", userBookingRoutes);
app.use("/api/users", userProfileRoutes);
app.use("/api/contact", userContactRoutes);
app.use("/api/notifications", userNotificationRoutes);
app.use("/api/payments", userPaymentRoutes);

// ---- Admin API Routes ----
app.use("/api/admin/vehicles", adminVehicleRoutes);
app.use("/api/admin/categories", adminCategoryRoutes);
app.use("/api/admin/bookings", adminBookingRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin/contact", adminContactRoutes);
app.use("/api/admin/notifications", adminNotificationRoutes);

// ---- Error handling ----
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚗 Server running on http://localhost:${PORT}`));
