import express from "express";
import { getVehicles, getVehicleById } from "../../controllers/user/userVehicleController.js";

const router = express.Router();

router.get("/", getVehicles);
router.get("/:id", getVehicleById);

export default router;
