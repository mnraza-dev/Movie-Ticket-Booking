import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  updateUser,
} from "../controllers/authController.js";
import { getBookings } from "../controllers/bookingController.js";
import auth from "../middlewares/authMiddleware.js";
const authRoutes = Router();

authRoutes.post("/register", registerUser);
authRoutes.post("/login", loginUser);
authRoutes.post("/logout", logoutUser);
authRoutes.put("/update", auth, updateUser);
authRoutes.get("/", auth, getBookings);

export default authRoutes;
