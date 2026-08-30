import express from "express";
import { submitContact } from "../../controllers/user/userContactController.js";

const router = express.Router();

router.post("/", submitContact);

export default router;
