import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    duration: Number,
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

movieSchema.virtual("showtimes", {
  ref: "Showtime",
  localField: "_id",
  foreignField: "movie",
});

export const Movie = mongoose.model("Movie", movieSchema);
