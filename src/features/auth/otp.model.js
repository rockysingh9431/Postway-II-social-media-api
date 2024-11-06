import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+\@.+\./, "Please enter a valid email"],
  },
  otp: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
    expires: 5 * 60 * 1000, // 5 mins expiration time
  },
});

const OtpModel = mongoose.model("Otp", otpSchema);
export default OtpModel;
