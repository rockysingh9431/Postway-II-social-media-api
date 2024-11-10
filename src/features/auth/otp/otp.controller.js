import OtpRepository from "./otp.repository.js";

/**
 * Sends an OTP to the user's email.
 *
 * @param {Object} req - The request object from the client, containing user information.
 * @param {Object} res - The response object to send back the result.
 * @returns {Object} JSON response with the message and status.
 */
export const sendOtp = async (req, res) => {
  try {
    const userId = req.userId; // Retrieve the user ID from the request
    const resp = await OtpRepository.sendOtpEmail(userId); // Send OTP to user's email
    if (resp.success) {
      return res.status(200).json({ message: resp.message }); // OTP sent successfully
    } else {
      return res.status(resp.status).json({ message: resp.message }); // Error in sending OTP
    }
  } catch (error) {
    return res.status(500).json({ message: error.message }); // Server error
  }
};

/**
 * Verifies the OTP provided by the user.
 *
 * @param {Object} req - The request object from the client, containing user information and OTP.
 * @param {Object} res - The response object to send back the result.
 * @returns {Object} JSON response with the verification result.
 */
export const verifyOtp = async (req, res) => {
  try {
    const userId = req.userId; // Retrieve the user ID from the request
    const { otp } = req.body; // Extract OTP from request body
    const resp = await OtpRepository.verifyOtp(userId, otp); // Verify the OTP
    if (!resp.success) {
      return res.status(resp.status).json({ message: resp.message }); // OTP verification failed
    } else {
      return res.status(200).json({ resp }); // OTP verification successful
    }
  } catch (error) {
    return res.status(500).json({ error: error.message }); // Server error
  }
};

/**
 * Resets the user's password after OTP verification.
 *
 * @param {Object} req - The request object from the client, containing user information and new password.
 * @param {Object} res - The response object to send back the result.
 * @returns {Object} JSON response with the reset result, including setting a new token in a cookie.
 */
export const resetPassword = async (req, res) => {
  try {
    const userId = req.userId; // Retrieve the user ID from the request
    const { newPassword } = req.body; // Extract new password from request body
    const resp = await OtpRepository.resetPassword(userId, newPassword); // Reset the user's password
    if (resp.success) {
      res.cookie("token", resp.token, {
        httpOnly: true, // Cookie is only accessible by the server
        maxAge: 3600000, // 1-hour expiry
      });
      return res.status(200).json({ message: resp.message }); // Password reset successful
    } else {
      return res.status(resp.status).json({ message: resp.message }); // Password reset failed
    }
  } catch (error) {
    return res.status(500).json({ error: error.message }); // Server error
  }
};
