import OtpRepository from "./otp.repository.js";

export const sendOtp = async (req, res) => {
  try {
    const userId = req.userId;
    const resp = await OtpRepository.sendOtpEmail(userId);
    if (resp.success) {
      return res.status(200).json({ message: resp.message });
    } else {
      return res.status(resp.status).json({ message: resp.message });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const verifyOtp = async (req, res) => {
  try {
    const userId = req.userId;
    const { otp } = req.body;
    const resp = await OtpRepository.verifyOtp(userId, otp);
    if (!resp.success) {
      return res.status(resp.status).json({ message: resp.message });
    } else {
      return res.status(200).json({ resp });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const resetPassword = async (req, res) => {
  try {
    const userId = req.userId;
    const { newPassword } = req.body;
    const resp = await OtpRepository.resetPassword(userId, newPassword);
    if (resp.success) {
      res.cookie("token", resp.token, {
        httpOnly: true, // Helps prevent XSS attacks
        maxAge: 3600000, // Cookie expiry in milliseconds (1 hour)
      });
      return res.status(200).json({ message: resp.message });
    } else {
      return res.status(resp.status).json({ message: resp.message });
    }
  } catch (error) {
    return res.statusCode(500).json({ error: error.message });
  }
};
