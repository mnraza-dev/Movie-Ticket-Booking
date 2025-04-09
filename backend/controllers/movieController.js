import { Movie } from "../models/Movie.js";
export const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find().populate({
      path: "showtimes",
      select: "startTime totalSeats availableSeats price", 
    });
    if (!movies.length) {
      return res.status(404).json({ message: "No movies found" });
    }
    res.status(200).json({
      message: "Movies retrieved successfully",
      data: movies,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const addMovie = async (req, res) => {
  try {
    const { title, description, showTimes, duration } = req.body;
    const movie = new Movie({
      title,
      description,
      showTimes,
      duration,
    });
    await movie.save();
    res.status(201).json({ message: "Movie added successfully", movie });
    res.json({ message: "Add Movie" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
