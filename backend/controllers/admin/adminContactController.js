import asyncHandler from "../../utils/asyncHandler.js";
import Contact from "../../models/Contact.js";

// @desc    List enquiries
// @route   GET /api/admin/contact or GET /api/contact
// @access  Admin
export const getContacts = asyncHandler(async (req, res) => {
  const items = await Contact.find().sort({ createdAt: -1 });
  res.json(items);
});

// @desc    Update enquiry status
// @route   PUT /api/admin/contact/:id or PUT /api/contact/:id
// @access  Admin
export const updateContact = asyncHandler(async (req, res) => {
  const item = await Contact.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error("Enquiry not found");
  }
  if (req.body.status) item.status = req.body.status;
  await item.save();
  res.json(item);
});

// @desc    Delete enquiry
// @route   DELETE /api/admin/contact/:id or DELETE /api/contact/:id
// @access  Admin
export const deleteContact = asyncHandler(async (req, res) => {
  const item = await Contact.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error("Enquiry not found");
  }
  await item.deleteOne();
  res.json({ message: "Enquiry removed successfully", id: req.params.id });
});
