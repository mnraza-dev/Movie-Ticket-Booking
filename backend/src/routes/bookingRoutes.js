import { Router } from "express";
import { getBookings } from "../controllers/bookingController.js";
import auth from "../middlewares/authMiddleware.js";
const bookingRoutes = Router();

bookingRoutes.get("/", auth, getBookings);

export default bookingRoutes;
