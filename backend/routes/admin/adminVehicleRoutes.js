import express from "express";
import {
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from "../../controllers/admin/adminVehicleController.js";
import { protect } from "../../middleware/auth.js";
import { admin } from "../../middleware/admin.js";
import upload from "../../middleware/upload.js";

const router = express.Router();

router.use(protect, admin);

router.post("/", upload.single("image"), createVehicle);
router.put("/:id", upload.single("image"), updateVehicle);
router.delete("/:id", deleteVehicle);

export default router;
