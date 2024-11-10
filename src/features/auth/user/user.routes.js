import express from "express";
import {
  signUp,
  signIn,
  logout,
  logoutOfAllDevices,
  getUsers,
  getUserById,
  updateUserById,
} from "./user.controller.js";
import jwtAuth from "../../../middlewares/jwt.middleware.js";
import { upload } from "../../../middlewares/fileupload.middleware.js";

const userRouter = express.Router(); // Initialize the router for user-related routes

// Route for user registration
// Endpoint: POST /signup
userRouter.post("/signup", signUp);

// Route for user login
// Endpoint: POST /signin
userRouter.post("/signin", signIn);

// Route for logging out the current session
// Endpoint: POST /logout
// Requires JWT authentication
userRouter.post("/logout", jwtAuth, logout);

// Route for logging out from all devices
// Endpoint: POST /logout-all-devices
// Requires JWT authentication
userRouter.post("/logout-all-devices", jwtAuth, logoutOfAllDevices);

// Route for fetching a specific user's details by user ID
// Endpoint: GET /get-details/:userId
// Requires JWT authentication
userRouter.get("/get-details/:userId", jwtAuth, getUserById);

// Route for fetching details of all users
// Endpoint: GET /get-all-details
// Requires JWT authentication
userRouter.get("/get-all-details", jwtAuth, getUsers);

// Route for updating a specific user's details by user ID
// Endpoint: PUT /update-details/:userId
// Requires JWT authentication and file upload (for updating avatar image)
// Middleware: `upload.single("image")` handles single image file upload
userRouter.put(
  "/update-details/:userId",
  jwtAuth,
  upload.single("image"),
  updateUserById
);

export default userRouter; // Export the user router for use in other parts of the application
