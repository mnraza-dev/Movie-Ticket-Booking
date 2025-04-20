import { Booking } from "../models/Booking.js";
import { Showtime } from "../models/Showtime.js";
import razorpay from "../utils/razorpay.js";
import crypto from "crypto";

const verifyPayment = async (paymentId, orderId, razorpaySignature) => {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  const generatedSignature = crypto
    .createHmac("sha256", secret)
    .update(orderId + "|" + paymentId)
    .digest("hex");

  if (generatedSignature === razorpaySignature) {
    return true;
  } else {
    return false;
  }
};

export const createBooking = async (req, res) => {
  const { showtimeId, numberOfTickets } = req.body;

  console.log("🎟️ Booking request received:", { showtimeId, numberOfTickets });
  console.log("🔐 Authenticated user:", req.user);

  if (!req.user || !req.user._id) {
    return res
      .status(401)
      .json({ message: "Unauthorized. User info missing." });
  }

  try {
    const showtime = await Showtime.findById(showtimeId).populate("movie");
    console.log("🎬 Showtime found:", showtime);
    if (!showtime || !showtime.movie) {
      return res
        .status(404)
        .json({ message: "Invalid or missing movie/showtime" });
    }
    if (numberOfTickets > showtime.availableSeats) {
      return res.status(400).json({ message: "Not enough seats available" });
    }
    const totalPrice = numberOfTickets * showtime.price;
    console.log("💰 Total Price:", totalPrice);

    if (isNaN(totalPrice) || totalPrice <= 0) {
      return res.status(400).json({ message: "Invalid ticket pricing" });
    }
    let razorpayOrder;
    try {
      razorpayOrder = await razorpay.orders.create({
        amount: totalPrice * 100,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      });
      console.log("✅ Razorpay order created:", razorpayOrder);
    } catch (razorErr) {
      console.error("❌ Razorpay error:", razorErr);
      return res.status(500).json({
        message: "Payment gateway error",
        error: razorErr?.message || "Unknown Razorpay error",
      });
    }

    const booking = new Booking({
      user: req.user._id,
      showtime: showtime._id,
      numberOfTickets,
      totalPrice,
      paymentStatus: "pending",
    });

    await booking.save();
    console.log("📦 Booking saved:", booking._id);

    showtime.availableSeats -= numberOfTickets;
    await showtime.save();
    console.log("🪑 Updated available seats:", showtime.availableSeats);

    res.status(201).json({
      message: "Booking initiated. Complete the payment to confirm.",
      bookingId: booking._id,
      razorpayOrder,
    });
  } catch (err) {
    console.error("🔥 Booking error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const verifyPaymentCallback = async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
    req.body;

  console.log("🧾 Payment verification received:", req.body);

  if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
    return res.status(400).json({ message: "Missing payment details" });
  }

  try {
    const isValid = await verifyPayment(
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature
    );

    if (isValid) {
      const booking = await Booking.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id, paymentStatus: "pending" },
        { paymentStatus: "confirmed" },
        { new: true }
      );

      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      res
        .status(200)
        .json({ message: "Payment verified and booking confirmed." });
    } else {
      res.status(400).json({ message: "Invalid payment signature" });
    }
  } catch (err) {
    console.error("🔥 Payment verification error:", err);
    res
      .status(500)
      .json({ message: "Payment verification failed", error: err.message });
  }
};

export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate(
      "movie"
    );
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve bookings",
      error: error.message,
    });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!booking) {
      return res
        .status(404)
        .json({ message: "Booking not found or unauthorized" });
    }

    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to cancel booking",
      error: error.message,
    });
  }
};

export const getBookingById = async (req, res) => {
  const { id } = req.params;

  if (!req.user || !req.user._id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const booking = await Booking.findById(id)
      .populate({
        path: "showtime",
        populate: {
          path: "movie",
          select: "title language poster genre",
        },
      })
      .populate("user", "name email");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Security check - only allow user to view their own bookings
    if (booking.user._id.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You don't have permission to view this booking" });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.error("Error retrieving booking:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
