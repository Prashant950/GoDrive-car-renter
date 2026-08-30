import asyncHandler from "../../utils/asyncHandler.js";
import Contact from "../../models/Contact.js";
import { notify } from "../../utils/notify.js";

// @desc    Submit a contact / enquiry message
// @route   POST /api/contact
// @access  Public
export const submitContact = asyncHandler(async (req, res) => {
  const { name, email, phone = "", subject = "General Enquiry", message } = req.body;
  if (!name || !email || !message) {
    res.status(400);
    throw new Error("Name, email and message are required");
  }

  const doc = await Contact.create({ name, email, phone, subject, message });

  await notify({
    forAdmin: true,
    type: "contact",
    title: "New enquiry received",
    message: `${name} sent an enquiry: "${subject}".`,
    link: "/admin/enquiries",
  });

  res.status(201).json({ success: true, message: "Thanks! We'll get back to you soon.", id: doc._id });
});
