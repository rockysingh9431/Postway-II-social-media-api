import nodemailer from "nodemailer";
import { UserModel } from "../user.model.js";
import OtpModel from "../otp.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import ApplicationError from "../../../errorHandler/applicationError.js";

// Create a transporter object using the Gmail SMTP service
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "rocky94singh31@gmail.com",
    pass: "nmrnhouegpkyhkxa",
  },
});

export default class OtpRepository {
  /**
   * Sends an OTP to the user's email.
   *
   * @param {string} userId - The ID of the user who will receive the OTP.
   * @returns {Object} Response indicating success or failure and a message.
   */
  static sendOtpEmail = async (userId) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP

    // Email template containing the OTP and styling for HTML email
    const emailTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your OTP Code</title>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f4f4f7; margin: 0; padding: 0; }
    .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); }
    .email-header { background-color: #4a90e2; color: #ffffff; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; }
    .email-body { padding: 30px; color: #333333; }
    .email-body h2 { font-size: 20px; color: #4a90e2; }
    .otp-code { display: inline-block; font-size: 36px; font-weight: bold; color: #4a90e2; padding: 10px 20px; margin: 20px 0; background-color: #f1f8ff; border-radius: 8px; }
    .email-footer { background-color: #f4f4f7; color: #888888; text-align: center; padding: 20px; font-size: 12px; }
    .email-footer a { color: #4a90e2; text-decoration: none; }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">Your Verification Code</div>
    <div class="email-body">
      <h2>Hello,</h2>
      <p>We received a request to use your email for verification. Please use the OTP code below to proceed:</p>
      <div class="otp-code">${otp}</div>
      <p>If you didn't request this, please ignore this email.</p>
      <p>Thank you,<br>Postway</p>
    </div>
    <div class="email-footer">
      &copy; 2024 Postway. All rights reserved.
      <br>
      <a href="https://yourcompany.com">Privacy Policy</a> | <a href="https://yourcompany.com">Contact Support</a>
    </div>
  </div>
</body>
</html>
`;
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        return { success: false, status: 404, message: "User Not Found" };
      }

      const otpData = new OtpModel({
        email: user.email,
        otp,
      });
      await otpData.save(); // Save OTP in the database for verification later

      // Email options
      const mailOptions = {
        from: "rocky94singh31@gmail.com",
        to: user.email,
        subject: "Your OTP Code",
        html: emailTemplate,
      };

      await transporter.sendMail(mailOptions); // Send the OTP email
      return { success: true, message: "OTP email sent successfully" };
    } catch (error) {
      throw new ApplicationError(500, error.message);
    }
  };

  /**
   * Verifies the OTP provided by the user.
   *
   * @param {string} userId - The ID of the user whose OTP is being verified.
   * @param {string} otp - The OTP entered by the user.
   * @returns {Object} Response indicating success or failure of the OTP verification.
   */
  static verifyOtp = async (userId, otp) => {
    try {
      const user = await UserModel.findById(userId);
      const otpData = await OtpModel.findOne({ email: user.email });

      if (!otpData) {
        return { success: false, status: 404, message: "OTP data not found" };
      } else if (otpData.otp === otp && !otpData.isVerified) {
        otpData.isVerified = true;
        await otpData.save();
        return {
          success: true,
          message: "OTP verified successfully",
          otpData,
        };
      } else {
        return {
          success: false,
          status: 400,
          message: "Incorrect/Invalid OTP. Please try again!",
        };
      }
    } catch (error) {
      throw new ApplicationError(500, error.message);
    }
  };

  /**
   * Resets the user's password if the OTP has been verified.
   *
   * @param {string} userId - The ID of the user requesting the password reset.
   * @param {string} newPassword - The new password to be set.
   * @returns {Object} Response indicating success or failure of the password reset, with a new JWT token if successful.
   */
  static resetPassword = async (userId, newPassword) => {
    try {
      const user = await UserModel.findById(userId);
      const otpData = await OtpModel.findOne({ email: user.email });

      if (otpData.isVerified) {
        // Generate a new JWT token
        const newToken = jwt.sign(
          {
            userId: user._id,
            email: user.email,
            time: Date.now(),
          },
          "postwayProject2",
          { expiresIn: "1h" }
        );

        // Hash the new password and save it to the database
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        user.password = hashedPassword;
        await user.save();

        return {
          success: true,
          token: newToken,
          message: "Password reset successfully",
        };
      } else {
        return {
          success: false,
          status: 400,
          message: "OTP not verified, please verify OTP and try again",
        };
      }
    } catch (error) {
      throw new ApplicationError(500, error.message);
    }
  };
}
