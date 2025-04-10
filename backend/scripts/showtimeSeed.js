import mongoose from "mongoose";
import dotenv from "dotenv";
import { Movie } from "../models/Movie.js";
import { Showtime } from "../models/Showtime.js"; // Make sure this path is correct

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected!");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }
};

const getRandomDate = () => {
  const now = new Date();
  const future = new Date(now);
  future.setDate(future.getDate() + Math.floor(Math.random() * 7)); // within a week
  future.setHours(Math.floor(Math.random() * 12) + 10); // 10 AM – 10 PM
  future.setMinutes(0);
  return future;
};

const generateShowtimesForMovie = (movieId) => {
  const numShowtimes = Math.floor(Math.random() * 3) + 1; // 1 to 3 showtimes
  return Array.from({ length: numShowtimes }).map(() => ({
    movie: movieId,
    startTime: getRandomDate(),
    totalSeats: 100,
    availableSeats: 100,
    price: Math.floor(Math.random() * 100) + 100, // ₹100–₹200
  }));
};

const seedShowtimes = async () => {
  try {
    await connectDB();

    await Showtime.deleteMany();
    console.log("🧹 Cleared existing showtimes");

    const movies = await Movie.find();
    if (!movies.length) throw new Error("No movies found. Seed movies first!");

    const allShowtimes = [];

    for (const movie of movies) {
      const showtimes = generateShowtimesForMovie(movie._id);
      allShowtimes.push(...showtimes);
    }

    const inserted = await Showtime.insertMany(allShowtimes);
    console.log(`✅ Seeded ${inserted.length} showtimes successfully`);

    process.exit();
  } catch (err) {
    console.error("❌ Error seeding showtimes:", err);
    process.exit(1);
  }
};

seedShowtimes();
