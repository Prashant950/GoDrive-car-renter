import asyncHandler from "../../utils/asyncHandler.js";
import Booking from "../../models/Booking.js";
import Vehicle from "../../models/Vehicle.js";
import { notify } from "../../utils/notify.js";

// @desc    Create a new booking (for logged-in user)
// @route   POST /api/bookings
// @access  Private
export const createBooking = asyncHandler(async (req, res) => {
  const {
    vehicleId,
    startDate,
    endDate,
    withDriver = false,
    serviceType = "Outstation",
    pickupLocation = "",
    dropLocation = "",
    notes = "",
  } = req.body;

  if (!vehicleId || !startDate || !endDate) {
    res.status(400);
    throw new Error("Vehicle and both dates are required");
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start) || isNaN(end) || end <= start) {
    res.status(400);
    throw new Error("End date/time must be after the start date/time");
  }

  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle) {
    res.status(404);
    throw new Error("Vehicle not found");
  }
  if (!vehicle.available) {
    res.status(400);
    throw new Error("This vehicle is currently unavailable");
  }

  const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
  const driverAdd = withDriver ? vehicle.withDriverPrice : 0;
  const pricePerDay = vehicle.pricePerDay + driverAdd;
  const estimatedTotal = pricePerDay * days;
  const registrationFee = req.body.registrationFee !== undefined ? Number(req.body.registrationFee) : Number(process.env.REGISTRATION_FEE || 500);

  const booking = await Booking.create({
    user: req.user._id,
    vehicle: vehicle._id,
    vehicleName: vehicle.name,
    vehicleImage: vehicle.image,
    customerName: req.user.name,
    customerEmail: req.user.email,
    customerMobile: req.user.mobile,
    serviceType,
    startDate: start,
    endDate: end,
    days,
    withDriver: !!withDriver,
    pickupLocation,
    dropLocation,
    notes,
    pricePerDay,
    estimatedTotal,
    registrationFee,
    amountPaid: 0,
    balanceDue: estimatedTotal,
    paymentStatus: "Pending",
    status: "Pending",
  });

  res.status(201).json(booking);
});

// @desc    Get current user's bookings
// @route   GET /api/bookings/my
// @access  Private
export const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(bookings);
});

// @desc    Get single booking (owner or admin)
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }
  if (req.user.role !== "admin" && booking.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to view this booking");
  }
  res.json(booking);
});

// @desc    Cancel my booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private (owner)
export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }
  if (booking.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to cancel this booking");
  }
  if (["Cancelled", "Completed"].includes(booking.status)) {
    res.status(400);
    throw new Error(`Booking is already ${booking.status}`);
  }

  booking.status = "Cancelled";
  await booking.save();

  await notify({
    forAdmin: true,
    type: "status",
    title: "Booking cancelled",
    message: `${booking.customerName} cancelled the booking for ${booking.vehicleName}.`,
    link: "/admin/bookings",
  });

  res.json(booking);
});
