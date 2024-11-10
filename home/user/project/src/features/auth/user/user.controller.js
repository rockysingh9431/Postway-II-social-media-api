// user.controller.js
// This file contains the controller functions for user authentication and management.
// It handles user registration, login, logout, and user data retrieval and updates.

import UserRepository from "./user.repository.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

/**
 * Registers a new user by hashing their password and storing user details.
 * @param {Object} req - The request object, containing user data (name, email, password, gender).
 * @param {Object} res - The response object.
 */
export const signUp = async (req, res) => {
  // Function implementation...
};

/**
 * Authenticates a user by verifying email and password, and generates a JWT token upon successful login.
 * @param {Object} req - The request object, containing email and password.
 * @param {Object} res - The response object.
 */
export const signIn = async (req, res) => {
  // Function implementation...
};

/**
 * Logs out a user by clearing their session and token cookie.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export const logout = async (req, res) => {
  // Function implementation...
};

/**
 * Logs out a user from all devices by clearing all sessions associated with the user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export const logoutOfAllDevices = async (req, res) => {
  // Function implementation...
};

/**
 * Retrieves user information by user ID.
 * @param {Object} req - The request object, containing user ID in the parameters.
 * @param {Object} res - The response object.
 */
export const getUserById = async (req, res) => {
  // Function implementation...
};

/**
 * Retrieves all users.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export const getUsers = async (req, res) => {
  // Function implementation...
};

/**
 * Updates user information by user ID, including avatar if provided.
 * @param {Object} req - The request object, containing user data and file.
 * @param {Object} res - The response object.
 */
export const updateUserById = async (req, res) => {
  // Function implementation...
};
