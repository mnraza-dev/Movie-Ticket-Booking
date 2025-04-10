import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    description: String,
    duration: {
      type: Number,
      required: true,
      min: 1,
    },
    poster: {
      type: String,
      required: true,
      validate: {
        validator: function (url) {
          return /^https?:\/\/.*\.(jpg|jpeg|png|webp)$/.test(url);
        },
        message: "Invalid poster URL format",
      },
    },
    genre: {
      type: [String],
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    releaseDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

movieSchema.virtual("showtimes", {
  ref: "Showtime",
  localField: "_id",
  foreignField: "movie",
});

export const Movie = mongoose.model("Movie", movieSchema);
