import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import generateToken from "../utils/generateToken.js";

export const registerUser = async (req, res) => {
  const { fullname, email, password } = req.body;
  if (!fullname || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const passwordHashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullname,
      email,
      password: passwordHashed,
    });

    const token = generateToken(user);
    res.status(201).json({
      user,
      token,
      message: "User registered successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = generateToken(user);

    if (!token) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.cookie("token", token, {
      httpOnly: false,
      secure: false,
      sameSite: "Lax",
    });
    res.status(200).json({
      message: "Login successful",
      user: {
        fullname: user.fullname,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
export const updateUser = async (req, res) => {
  const userId = req.user.id;
  const { fullname, password } = req.body;

  const update = { fullname };
  if (password) {
    const hashed = await bcrypt.hash(password, 10);
    update.password = hashed;
  }
  const user = await User.findByIdAndUpdate(userId, update, {
    new: true,
  }).select("-password");
  const updatedUser = await User.findById(userId);
  const token = generateToken(updatedUser);

  res.cookie("token", token, {
    httpOnly: false,
    secure: false,
    sameSite: "Lax",
    maxAge: 1000 * 60 * 60 * 24,
  });

  res.json({ success: true, user });
};
