import express from "express";
import {
  getContacts,
  updateContact,
  deleteContact,
} from "../../controllers/admin/adminContactController.js";
import { protect } from "../../middleware/auth.js";
import { admin } from "../../middleware/admin.js";

const router = express.Router();

router.use(protect, admin);

router.get("/", getContacts);
router.put("/:id", updateContact);
router.delete("/:id", deleteContact);

export default router;
