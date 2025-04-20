import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    showtime: { type: mongoose.Schema.Types.ObjectId, ref: "Showtime" },
    numberOfTickets: Number,
    totalPrice: Number,
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    razorpayOrderId: String,
  },
  { timestamps: true }
);

export const Booking = mongoose.model("Booking", bookingSchema);
