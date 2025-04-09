import mongoose from "mongoose";
import dotenv from "dotenv";
import { Movie } from "../models/Movie.js";
import { Showtime } from "../models/Showtime.js";
import { faker } from "@faker-js/faker";

dotenv.config();
await mongoose.connect(process.env.MONGODB_URI);

await Movie.deleteMany();
await Showtime.deleteMany();

// ✅ Generate 20 fake movies
const movies = await Movie.insertMany(
  Array.from({ length: 20 }, () => ({
    title: faker.commerce.productName(), // use a safe fallback
    description: faker.lorem.sentence(),
    duration: faker.number.int({ min: 90, max: 180 }),
  }))
);

console.log("🎬 Movies added:", movies.length);

// ✅ Add 3 showtimes for each movie
for (const movie of movies) {
  for (let i = 0; i < 3; i++) {
    const hours = faker.number.int({ min: 9, max: 21 });
    const minutes = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
    const startTime = new Date();
    startTime.setHours(hours, minutes, 0, 0);

    const totalSeats = faker.number.int({ min: 50, max: 200 });
    const price = faker.number.int({ min: 150, max: 500 });

    const showtime = new Showtime({
      movie: movie._id,
      startTime,
      totalSeats,
      availableSeats: totalSeats,
      price,
    });

    await showtime.save();
  }
}

console.log("🍿 Showtimes seeded successfully!");
process.exit();
