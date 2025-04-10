import Router from "express";
import {
  createBooking,
  cancelBooking,
  getBookingById,
  verifyPaymentCallback,
} from "../controllers/bookingController.js";
import auth from "../middlewares/authMiddleware.js";

const bookRouter = Router();

bookRouter.post("/", auth, createBooking);
bookRouter.post("/verify-payment", auth, verifyPaymentCallback);
bookRouter.delete("/:id", auth, cancelBooking);
bookRouter.get("/:id", auth, getBookingById);
export default bookRouter;
