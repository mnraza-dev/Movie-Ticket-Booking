import {User} from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    const { username, firstname, lastname, email, password } = req.body;
    const passwordHashed = await bcrypt.hash(password, 10);
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.create({
      username,
      firstname,
      lastname,
      email,
      password: passwordHashed,
    });
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
   const token = generateToken(user._id);
  
    if (!token) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.cookie("token", token, { httpOnly: true, secure: true });
    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
