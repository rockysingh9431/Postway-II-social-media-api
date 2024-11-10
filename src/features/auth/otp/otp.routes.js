import express from "express";
import { sendOtp, verifyOtp, resetPassword } from "./otp.controller.js";

const otpRouter = express.Router();

// Route to send an OTP email to the user
otpRouter.post("/send", sendOtp);

// Route to verify the OTP entered by the user
otpRouter.post("/verify", verifyOtp);

// Route to reset the user's password if the OTP is verified
otpRouter.post("/reset-password", resetPassword);

export default otpRouter;
