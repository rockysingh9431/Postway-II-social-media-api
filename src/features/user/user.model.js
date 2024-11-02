import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  token: { type: String, required: true },
  deviceInfo: { type: String }, // e.g., "iPhone 12, Chrome"
  ip: { type: String },
  loginTime: { type: Date, default: Date.now },
  expiresAt: { type: Date }, // Expiration timestamp
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    maxLength: [25, "Name can't be greater than 25 characters"],
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    match: [/.+\@.+\../, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: true,
  },
  avatar: {
    type: String,
    default: "../../uploads/",
  },
  sessions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserSession",
      required: true,
    },
  ],
});

export const UserSession = mongoose.model("UserSession", sessionSchema);
export const UserModel = mongoose.model("User", userSchema);
