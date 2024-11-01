import { ApplicationError } from "../../errorHandler/applicationError.js";
import { UserModel, UserSession } from "./user.model.js";
import mongoose from "mongoose";
export default class UserRepository {
  static signUp = async (name, email, password, gender) => {
    const user = await UserModel.findOne({ email });
    if (user) {
      throw new ApplicationError("Email Already exists", 400);
    } else {
      const newUser = new UserModel({ name, email, password, gender });
      await newUser.save();
      return newUser;
    }
  };

  static signIn = async (email) => {
    const user = await UserModel.findOne({ email: email });
    return user;
  };

  static logout = async (userId) => {
    const user = await UserModel.findOne({ _id: userId });
    const session = await UserSession.findOneAndDelete({ userId });
    user.sessions = user.sessions.filter(
      (sessionId) => !sessionId.equals(session._id)
    );
    await user.save();
  };

  static createSession = async (req, user, token) => {
    const session = new UserSession({
      userId: user.id,
      token: token,
      deviceInfo: req.headers["user-agent"],
      ip: req.ip,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    await session.save();
    const updatedUser = await UserModel.findOne({ email: user.email });
    updatedUser.sessions.push(session.id);
    await updatedUser.save();
  };

  static logoutOfAllDevices = async (userId) => {
    const isDeleted = await UserSession.deleteMany({
      userId: userId,
    });
    const user = await UserModel.findOne({
      _id: userId,
    });
    user.sessions = [];
    await user.save();
    return isDeleted;
  };

  static getUserById = async (userId) => {
    const user = await UserModel.find({
      _id: userId,
    });
    return user;
  };

  static getAllUsers = async () => {
    const users = await UserModel.find({});
    return users;
  };

  static updateUserById = async (userInfo, userId, avatar) => {
    const user = await UserModel.findOne({
      _id: userId,
    });
    if (!user) return null;
    user.name = userInfo.name || user.name;
    user.email = userInfo.email || user.email;
    user.gender = userInfo.gender || user.gender;
    user.avatar = avatar || user.avatar;
    await user.save();
    return user;
  };
}
