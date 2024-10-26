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
import jwtAuth from "../../middlewares/jwt.middleware.js";
import { upload } from "../../middlewares/fileupload.middleware.js";
const userRouter = express.Router();

userRouter.post("/signup", signUp);
userRouter.post("/signin", signIn);
userRouter.post("/logout", jwtAuth, logout);
userRouter.post("/logout-all-devices", jwtAuth, logoutOfAllDevices);
userRouter.get("/get-details/:userId", jwtAuth, getUserById);
userRouter.get("/get-all-details", jwtAuth, getUsers);
userRouter.put(
  "/update-details/:userId",
  jwtAuth,
  upload.single("image"),
  updateUserById
);
export default userRouter;
