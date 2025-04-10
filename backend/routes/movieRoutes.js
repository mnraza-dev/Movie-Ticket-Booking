import { Router } from "express";
import { getMovies, getMoviesById } from "../controllers/movieController.js";
const movieRouter = Router();

movieRouter.get("/", getMovies);
movieRouter.get("/:id", getMoviesById);

export default movieRouter;
