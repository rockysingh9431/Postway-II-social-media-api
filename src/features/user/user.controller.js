import jwt from "jsonwebtoken";
import UserRepository from "./user.repository.js";
import bcrypt from "bcrypt";
import { ApplicationError } from "../../errorHandler/applicationError.js";

export const signUp = async (req, res) => {
  const { name, email, password, gender } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await UserRepository.signIn(email);
    if (existingUser) {
      throw new ApplicationError(400, "Email already in use");
    }

    // Hash the password
    const hashPass = await bcrypt.hash(password, 12);
    const user = await UserRepository.signUp(name, email, hashPass, gender);

    // Send a success response with the created user details
    res.status(201).json({ user });
  } catch (error) {
    if (error instanceof ApplicationError) {
      res.status(error.code).json({ error: error.message });
    } else {
      console.error("Sign up error:", error); // Log the unexpected error for debugging
      res.status(500).json({
        error: " An unexpected error occurred. Please try again later.",
      });
    }
  }
};

export const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserRepository.signIn(email);
    if (!user) {
      throw new ApplicationError(401, "User not found. Please register.");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ApplicationError(401, "Incorrect password.");
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      "postwayProject2", // Replace with your actual secret
      { expiresIn: "1h" }
    );

    await UserRepository.createSession(req, user, token);
    res.cookie("token", token, {
      httpOnly: true, // Helps prevent XSS attacks
      maxAge: 3600000, // Cookie expiry in milliseconds (1 hour)
    });

    return res.status(200).json({ token });
  } catch (error) {
    if (error instanceof ApplicationError) {
      res.status(error.code).json({ error: error.message });
    } else {
      console.error("Sign in error:", error); // Log the unexpected error for debugging
      res.status(500).json({
        error: "An unexpected error occurred. Please try again later.",
      });
    }
  }
};

export const logout = async (req, res) => {
  try {
    await UserRepository.logout(req.userId);
    res.clearCookie("token", { httpOnly: true });
    res.status(200).json({ msg: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error); // Log the unexpected error for debugging
    return res
      .status(500)
      .json({ error: "An unexpected error occurred. Please try again later." });
  }
};

export const logoutOfAllDevices = async (req, res) => {
  const userId = req.userId;

  try {
    await UserRepository.logoutOfAllDevices(userId);
    res.clearCookie("token", { httpOnly: true });
    res.status(200).json({ msg: "Logged out from all devices" });
  } catch (error) {
    console.error("Logout from all devices error:", error); // Log the unexpected error for debugging
    return res
      .status(500)
      .json({ error: "An unexpected error occurred. Please try again later." });
  }
};

export const getUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await UserRepository.getUserById(userId);
    if (user) {
      return res.status(200).json({ msg: "User found successfully", user });
    } else {
      return res.status(404).json({ msg: "User not found" });
    }
  } catch (error) {
    console.error("Get user by ID error:", error); // Log the unexpected error for debugging
    return res
      .status(500)
      .json({ error: "An unexpected error occurred. Please try again later." });
  }
};

export const getUsers = async (req, res) => {
  try {
    const allUsers = await UserRepository.getAllUsers();
    if (allUsers.length > 0) {
      return res.status(200).json({ users: allUsers });
    } else {
      return res.status(404).json({ msg: "No users found" });
    }
  } catch (error) {
    console.error("Get all users error:", error); // Log the unexpected error for debugging
    return res
      .status(500)
      .json({ error: "An unexpected error occurred. Please try again later." });
  }
};

export const updateUserById = async (req, res) => {
  const userInfo = req.body;
  const { userId } = req.params;
  const avatar = req.file ? "/uploads/" + req.file.filename : null; // Check if file exists

  try {
    const response = await UserRepository.updateUserById(
      userInfo,
      userId,
      avatar
    );
    if (response) {
      res
        .status(200)
        .json({ msg: "User successfully updated", user: response });
    } else {
      return res.status(404).json({ msg: "User not found" });
    }
  } catch (error) {
    console.error("Update user by ID error:", error); // Log the unexpected error for debugging
    return res
      .status(500)
      .json({ error: "An unexpected error occurred. Please try again later." });
  }
};
