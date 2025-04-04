import { Router } from "express";
import { signup, login, logout } from "../controllers/userController.js";
const userRoutes = Router();

userRoutes.post("/signup", signup);
userRoutes.post("/login", login);
userRoutes.post("/logout", logout);

export default userRoutes;
