import UserRepository from "./user.repository.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import ApplicationError from "../../errorHandler/applicationError.js";

export const signUp = async (req, res) => {
  const { name, email, password, gender } = req.body;
  try {
    const hashPass = await bcrypt.hash(password, 12);
    const resp = await UserRepository.signUp(name, email, hashPass, gender);
    if (resp.success) {
      res.status(201).json({ response: resp });
    } else {
      res.status(409).json({ message: resp.message });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserRepository.signIn(email);
    if (!user) {
      return res
        .status(401)
        .json({ message: "User not found. Please register." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
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
    res.status(error.code).json({ error: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    await UserRepository.logout(req.userId);
    res.clearCookie("token", { httpOnly: true });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(error.code).json({ error: error.message });
  }
};

export const logoutOfAllDevices = async (req, res) => {
  const userId = req.userId;
  try {
    await UserRepository.logoutOfAllDevices(userId);
    res.clearCookie("token", { httpOnly: true });
    res.status(200).json({ message: "Logged out from all devices" });
  } catch (error) {
    return res.status(error.code).json({ error: error.message });
  }
};

export const getUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await UserRepository.getUserById(userId);
    if (user) {
      return res.status(200).json({ message: "User found successfully", user });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    return res.status(error.code).json({ error: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await UserRepository.getAllUsers();
    if (users) {
      return res.status(200).json({ users: users });
    } else {
      return res.status(404).json({ message: "No users found" });
    }
  } catch (error) {
    return res.status(error.code).json({ error: error.message });
  }
};

export const updateUserById = async (req, res) => {
  const userInfo = req.body;
  const { userId } = req.params;
  const avatar = "/uploads/" + "avatar-" + req.file?.filename; // Check if file exists

  try {
    const resp = await UserRepository.updateUserById(userInfo, userId, avatar);
    if (resp.success) {
      res.status(200).json({ message: "User successfully updated", resp });
    } else {
      return res.status(404).json({ message: resp.message });
    }
  } catch (error) {
    return res.status(error.code).json({ error: error.message });
  }
};
