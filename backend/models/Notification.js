import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    // recipient user; null when it is an admin-facing notification
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    forAdmin: { type: Boolean, default: false },

    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["booking", "payment", "system", "contact", "status"],
      default: "system",
    },
    link: { type: String, default: "" },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
