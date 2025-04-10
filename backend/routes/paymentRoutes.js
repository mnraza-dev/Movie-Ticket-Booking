import Router from "express";
import express from "express";
import {
  createRazorpayOrder,
  handleWebhook,
} from "../controllers/paymentController.js";
import auth from "../middlewares/authMiddleware.js";

const paymentRoutes = Router();
paymentRoutes.post("/verify-payment", auth, handleWebhook);
paymentRoutes.post("/create-order", auth, createRazorpayOrder);
paymentRoutes.post("/webhook", express.raw({ type: "*/*" }), handleWebhook); // RAW body required for Razorpay

export default paymentRoutes;
