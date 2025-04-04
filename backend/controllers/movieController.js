import Movie from "../models/Movie.js";
export const getMovies = async (req, res) => {
  try {
    res.json({ message: "Get Movies" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
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
    res.status(500).json({ message: "Internal server error" });
  }
};
