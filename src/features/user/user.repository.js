import { UserModel, UserSession } from "./user.model.js";
import ApplicationError from "../../errorHandler/applicationError.js";

export default class UserRepository {
  static signUp = async (name, email, password, gender) => {
    try {
      const user = await UserModel.findOne({ email });
      if (user) {
        return {
          success: false,
          message: `User with the email: ${email} already exists`,
        };
      } else {
        const newUser = new UserModel({
          name,
          email,
          password,
          gender,
        });
        await newUser.save();
        return { success: true, user: newUser };
      }
    } catch (error) {
      throw new ApplicationError(error.code || 500, error.message);
    }
  };

  static signIn = async (email) => {
    try {
      const user = await UserModel.findOne({ email: email });
      return user;
    } catch (error) {
      throw new ApplicationError(error.code || 500, error.message);
    }
  };

  static createSession = async (req, user, token) => {
    try {
      const session = new UserSession({
        userId: user.id,
        token: token,
        deviceInfo: req.headers["user-agent"],
        ip: req.ip,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
      await session.save();
      await UserModel.findByIdAndUpdate(
        { _id: user.id },
        { $push: { sessions: session._id } },
        { new: true }
      );
    } catch (error) {
      throw new ApplicationError(error.code || 500, error.message);
    }
  };
  static logout = async (userId) => {
    try {
      const session = await UserSession.findOneAndDelete({ userId });
      console.log(session._id);
      await UserModel.findByIdAndUpdate(userId, {
        $pull: { sessions: session._id },
      });
    } catch (error) {
      throw new ApplicationError(error.code || 500, error.message);
    }
  };

  static logoutOfAllDevices = async (userId) => {
    try {
      await UserSession.deleteMany({ userId });
      await UserModel.findByIdAndUpdate(
        { _id: userId },
        { $set: { sessions: [] } }
      );
    } catch (error) {
      throw new ApplicationError(error.code || 500, error.message);
    }
  };

  static getUserById = async (userId) => {
    try {
      const user = await UserModel.findOne({ _id: userId });
      return user;
    } catch (error) {
      throw new ApplicationError(error.code || 500, error.message);
    }
  };

  static getAllUsers = async () => {
    try {
      const users = await UserModel.find({});
      return users;
    } catch (error) {
      throw new ApplicationError(error.code || 500, error.message);
    }
  };

  static updateUserById = async (userInfo, userId, avatar) => {
    const updateFields = {
      ...(userInfo.name && { name: userInfo.name }),
      ...(userInfo.email && { email: userInfo.email }),
      ...(userInfo.gender && { gender: userInfo.gender }),
      ...(avatar && { avatar: avatar }),
    };
    try {
      const updatedUser = await UserModel.findByIdAndUpdate(
        { _id: userId },
        { $set: updateFields },
        { new: true }
      );
      if (!updatedUser) return { success: false, message: "user not found" };

      return { success: true, user: updatedUser };
    } catch (error) {
      throw new ApplicationError(error.code || 500, error.message);
    }
  };
}
