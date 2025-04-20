import Razorpay from "razorpay";
import crypto from "crypto";
import { Booking } from "../models/Booking.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

export const createRazorpayOrder = async (req, res) => {
  const { bookingId } = req.body;

  const booking = await Booking.findById(bookingId);
  if (!booking) return res.status(404).json({ message: "Booking not found" });

  const options = {
    amount: booking.totalPrice * 100, 
    currency: "INR",
    receipt: `booking_${booking._id}`,
  };

  const order = await razorpay.orders.create(options);
  booking.razorpayOrderId = order.id;
  await booking.save();

  res.status(200).json({
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
  });
};

export const handleWebhook = async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  const signature = req.headers["x-razorpay-signature"];
  const body = JSON.stringify(req.body);

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  if (signature !== expectedSignature) {
    return res.status(400).json({ message: "Invalid signature" });
  }

  const { event, payload } = req.body;

  if (event === "payment.captured") {
    const razorpayOrderId = payload.payment.entity.order_id;

    const booking = await Booking.findOne({ razorpayOrderId });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.paymentStatus = "paid";
    await booking.save();

    return res.status(200).json({ message: "Payment verified and booking updated" });
  }

  res.status(200).json({ message: "Event received" });
};
