import mongoose from "mongoose";
import dotenv from "dotenv";
import { Movie } from "../models/Movie.js";

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

const sampleGenres = ["Action", "Drama", "Comedy", "Horror", "Sci-Fi", "Thriller"];
const sampleLocations = ["New York", "Los Angeles", "Mumbai", "Dubai", "London", "Tokyo"];
const sampleLanguages = ["English", "Hindi", "French", "Japanese", "Arabic", "Spanish"];
const samplePosters = [
  "https://m.media-amazon.com/images/I/81c+9BOQNWL._AC_SY679_.jpg",
  "https://m.media-amazon.com/images/I/71niXI3lxlL._AC_SY679_.jpg",
  "https://m.media-amazon.com/images/I/71xBLRBYOiL._AC_SY679_.jpg",
  "https://m.media-amazon.com/images/I/71c05lTE03L._AC_SY679_.jpg",
  "https://m.media-amazon.com/images/I/91OINeHnJGL._AC_SY679_.jpg",
  "https://m.media-amazon.com/images/I/71UwSHSZRnS._AC_SY679_.jpg"
];

const generateMovie = () => {
  const genre = sampleGenres[Math.floor(Math.random() * sampleGenres.length)];
  const location = sampleLocations[Math.floor(Math.random() * sampleLocations.length)];
  const language = sampleLanguages[Math.floor(Math.random() * sampleLanguages.length)];
  const poster = samplePosters[Math.floor(Math.random() * samplePosters.length)];

  return {
    title: `Random Movie ${Math.floor(Math.random() * 1000)}`,
    description: `A thrilling tale of ${genre.toLowerCase()} in ${language}.`,
    duration: Math.floor(Math.random() * 60) + 90, // 90–150 mins
    genre,
    location,
    language,
    poster
  };
};

const seedMovies = async () => {
  try {
    await connectDB();

    await Movie.deleteMany();
    console.log("🧹 Cleared existing movies");

    const movies = Array.from({ length: 25 }, generateMovie);

    await Movie.insertMany(movies);
    console.log("✅ Seeded 25 movies successfully");

    process.exit();
  } catch (err) {
    console.error("❌ Error seeding movies:", err);
    process.exit(1);
  }
};

seedMovies();
