import { Router } from "express";
import { getMovies, addMovie } from "../controllers/movieController.js";

const movieRouter = Router();

movieRouter.get("/", getMovies);
movieRouter.post("/add", addMovie);

export default movieRouter;
