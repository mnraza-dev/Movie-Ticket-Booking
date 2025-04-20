import mongoose from "mongoose";

const showtimeSchema = new mongoose.Schema(
  {
    movie: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
    startTime: Date,
    totalSeats: Number,
    availableSeats: Number,
    price: Number,
  },
  { timestamps: true }
);

export const Showtime = mongoose.model("Showtime", showtimeSchema);
