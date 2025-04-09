import { Movie } from "../models/Movie.js";
import { Booking } from "../models/Booking.js";
import { Showtime } from "../models/Showtime.js";
import razorpay from "../utils/razorpay.js";

export const createBooking = async (req, res) => {
  const { showtimeId, numberOfTickets } = req.body;

  console.log("🎟️ Booking request received:", { showtimeId, numberOfTickets });
  console.log("🔐 Authenticated user:", req.user);

  if (!req.user || !req.user._id) {
    return res.status(401).json({ message: "Unauthorized. User info missing." });
  }

  try {
    const showtime = await Showtime.findById(showtimeId).populate("movie");
    console.log("🎬 Showtime found:", showtime);

    if (!showtime || !showtime.movie) {
      return res.status(404).json({ message: "Invalid or missing movie/showtime" });
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
        amount: totalPrice * 100, // Razorpay expects amount in paise
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

export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate("movie");
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
      return res.status(404).json({ message: "Booking not found or unauthorized" });
    }

    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to cancel booking",
      error: error.message,
    });
  }
};
