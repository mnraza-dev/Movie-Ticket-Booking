import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB  from "./backend/config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cookieParser());

app.listen(PORT, () => {
    connectDB();
  console.log(`Server is running at http://localhost:${PORT}`);
});
