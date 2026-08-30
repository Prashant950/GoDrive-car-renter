import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },

    // snapshots so history survives even if vehicle/user changes later
    vehicleName: { type: String, required: true },
    vehicleImage: { type: String, default: "" },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerMobile: { type: String, required: true },

    serviceType: {
      type: String,
      enum: [
        "Outstation",
        "Corporate",
        "Wedding Ceremony",
        "City Transfer",
        "Airport Transfer",
        "Whole City Tour",
        "Self Drive",
      ],
      default: "Outstation",
    },

    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    days: { type: Number, default: 1 },

    withDriver: { type: Boolean, default: false },
    pickupLocation: { type: String, default: "" },
    dropLocation: { type: String, default: "" },
    notes: { type: String, default: "" },

    pricePerDay: { type: Number, required: true },
    estimatedTotal: { type: Number, required: true }, // full estimated rent

    registrationFee: { type: Number, default: 500 }, // amount paid now
    amountPaid: { type: Number, default: 0 },
    balanceDue: { type: Number, default: 0 },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Refunded"],
      default: "Pending",
    },
    paymentId: { type: String, default: "" }, // mock transaction id
    paidAt: { type: Date },

    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled", "Completed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
