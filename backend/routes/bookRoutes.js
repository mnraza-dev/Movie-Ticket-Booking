import Router from "express";
import {
  createBooking,
  cancelBooking,
} from "../controllers/bookingController.js";
import auth from "../middlewares/authMiddleware.js";

const bookRouter = Router();

bookRouter.post("/", auth, createBooking);
bookRouter.delete("/:id", auth, cancelBooking);
export default bookRouter;
