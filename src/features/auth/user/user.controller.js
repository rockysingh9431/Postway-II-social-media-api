import UserRepository from "./user.repository.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

/**
 * Registers a new user by hashing their password and storing user details.
 * @param {Object} req - The request object, containing user data (name, email, password, gender).
 * @param {Object} res - The response object.
 */
export const signUp = async (req, res) => {
  const { name, email, password, gender } = req.body;
  try {
    // Hash the password with a salt factor of 12
    const hashPass = await bcrypt.hash(password, 12);

    // Attempt to save user in the repository
    const resp = await UserRepository.signUp(name, email, hashPass, gender);

    if (resp.success) {
      // User successfully created
      res.status(201).json({ response: resp });
    } else {
      // Conflict error if email already exists
      res.status(409).json({ message: resp.message });
    }
  } catch (error) {
    // Server error
    res.status(500).json({ error: error.message });
  }
};

/**
 * Authenticates a user by verifying email and password, and generates a JWT token upon successful login.
 * @param {Object} req - The request object, containing email and password.
 * @param {Object} res - The response object.
 */
export const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Retrieve user by email
    const user = await UserRepository.signIn(email);
    if (!user) {
      // If user not found, send 401 Unauthorized
      return res
        .status(401)
        .json({ message: "User not found. Please register." });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // If password is incorrect, send 401 Unauthorized
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Generate JWT token valid for 1 hour
    const token = jwt.sign(
      { userId: user.id, email: user.email, time: Date.now() },
      "postwayProject2",
      { expiresIn: "1h" }
    );

    // Create session and set token in an HTTP-only cookie
    await UserRepository.createSession(req, user, token);
    res.cookie("token", token, {
      httpOnly: true, // Helps prevent XSS attacks
      maxAge: 3600000, // Cookie expiry in milliseconds (1 hour)
    });

    // Return the generated token in the response
    return res.status(200).json({ token });
  } catch (error) {
    // Return error with its code and message
    res.status(error.code).json({ error: error.message });
  }
};

/**
 * Logs out a user by clearing their session and token cookie.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export const logout = async (req, res) => {
  try {
    // Logout user by user ID and clear token cookie
    await UserRepository.logout(req.userId);
    res.clearCookie("token", { httpOnly: true });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    // Return error with its code and message
    return res.status(error.code).json({ error: error.message });
  }
};

/**
 * Logs out a user from all devices by clearing all sessions associated with the user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export const logoutOfAllDevices = async (req, res) => {
  const userId = req.userId;
  try {
    // Clear all sessions for user and clear token cookie
    await UserRepository.logoutOfAllDevices(userId);
    res.clearCookie("token", { httpOnly: true });
    res.status(200).json({ message: "Logged out from all devices" });
  } catch (error) {
    // Return error with its code and message
    return res.status(error.code).json({ error: error.message });
  }
};

/**
 * Retrieves user information by user ID.
 * @param {Object} req - The request object, containing user ID in the parameters.
 * @param {Object} res - The response object.
 */
export const getUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch user data by ID
    const user = await UserRepository.getUserById(userId);
    if (user) {
      // Return user data if found
      return res.status(200).json({ message: "User found successfully", user });
    } else {
      // If user not found, send 404 Not Found
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    // Return error with its code and message
    return res.status(error.code).json({ error: error.message });
  }
};

/**
 * Retrieves all users.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export const getUsers = async (req, res) => {
  try {
    // Fetch all users
    const users = await UserRepository.getAllUsers();
    if (users) {
      // Return list of users if found
      return res.status(200).json({ users: users });
    } else {
      // If no users found, send 404 Not Found
      return res.status(404).json({ message: "No users found" });
    }
  } catch (error) {
    // Return error with its code and message
    return res.status(error.code).json({ error: error.message });
  }
};

/**
 * Updates user information by user ID, including avatar if provided.
 * @param {Object} req - The request object, containing user data and file.
 * @param {Object} res - The response object.
 */
export const updateUserById = async (req, res) => {
  const userInfo = req.body;
  const { userId } = req.params;
  const avatar = "/uploads/" + "avatar-" + req.file?.filename; // Sets avatar path if file exists

  try {
    // Update user data by ID
    const resp = await UserRepository.updateUserById(userInfo, userId, avatar);
    if (resp.success) {
      // If user update successful, send success response
      res.status(200).json({ message: "User successfully updated", resp });
    } else {
      // If user not found, send 404 Not Found
      return res.status(404).json({ message: resp.message });
    }
  } catch (error) {
    // Return error with its code and message
    return res.status(error.code).json({ error: error.message });
  }
};
