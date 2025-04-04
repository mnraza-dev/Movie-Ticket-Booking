import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (!value) {
          throw new Error("Title is required");
        }
      },
    },
    description: {
      type: String,
      trim: true,
    },
    showTimes: {
      type: [String],
      required: true,
      validate(value) {
        if (value.length === 0) {
          throw new Error("Show times are required");
        }
      },
    },
    duration: {
      type: Number,
      required: true,
      validate(value) {
        if (value <= 0) {
          throw new Error("Duration must be a positive number");
        }
      },
    },
  },
  { timestamps: true }
);

export const Movie = mongoose.model("Movie", movieSchema);
