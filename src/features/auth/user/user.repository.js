import { UserModel, UserSession } from "../user.model.js";
import ApplicationError from "../../../errorHandler/applicationError.js";

export default class UserRepository {
  /**
   * Registers a new user if the email is not already in use.
   * @param {string} name - The user's name.
   * @param {string} email - The user's email address.
   * @param {string} password - The user's hashed password.
   * @param {string} gender - The user's gender.
   * @returns {Object} Success status and either the new user or an error message.
   */
  static signUp = async (name, email, password, gender) => {
    try {
      // Check if a user with the given email already exists
      const user = await UserModel.findOne({ email });
      if (user) {
        return {
          success: false,
          message: `User with the email: ${email} already exists`,
        };
      } else {
        // Create a new user if no existing user is found
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
      // Handle any errors that occur during user registration
      throw new ApplicationError(error.code || 500, error.message);
    }
  };

  /**
   * Finds a user by email for login purposes.
   * @param {string} email - The user's email.
   * @returns {Object|null} The user object or null if not found.
   */
  static signIn = async (email) => {
    try {
      return await UserModel.findOne({ email: email });
    } catch (error) {
      throw new ApplicationError(error.code || 500, error.message);
    }
  };

  /**
   * Creates a new session for the user and stores it in the database.
   * @param {Object} req - The request object containing client info.
   * @param {Object} user - The authenticated user object.
   * @param {string} token - JWT token for the user session.
   */
  static createSession = async (req, user, token) => {
    try {
      const session = new UserSession({
        userId: user.id,
        token: token,
        deviceInfo: req.headers["user-agent"],
        ip: req.ip,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Session expiry in 1 week
      });
      await session.save();

      // Update user record with new session ID
      await UserModel.findByIdAndUpdate(
        { _id: user.id },
        { $push: { sessions: session._id } },
        { new: true }
      );
    } catch (error) {
      throw new ApplicationError(error.code || 500, error.message);
    }
  };

  /**
   * Logs out the user by deleting the current session.
   * @param {string} userId - The user's ID.
   */
  static logout = async (userId) => {
    try {
      const session = await UserSession.findOneAndDelete({ userId });
      // Remove session ID from user's session list
      await UserModel.findByIdAndUpdate(userId, {
        $pull: { sessions: session._id },
      });
    } catch (error) {
      throw new ApplicationError(error.code || 500, error.message);
    }
  };

  /**
   * Logs out the user from all devices by deleting all sessions.
   * @param {string} userId - The user's ID.
   */
  static logoutOfAllDevices = async (userId) => {
    try {
      // Remove all sessions associated with the user
      await UserSession.deleteMany({ userId });
      // Clear user's session list
      await UserModel.findByIdAndUpdate(
        { _id: userId },
        { $set: { sessions: [] } }
      );
    } catch (error) {
      throw new ApplicationError(error.code || 500, error.message);
    }
  };

  /**
   * Retrieves a user by their unique ID.
   * @param {string} userId - The user's ID.
   * @returns {Object|null} The user object or null if not found.
   */
  static getUserById = async (userId) => {
    try {
      return await UserModel.findOne({ _id: userId });
    } catch (error) {
      throw new ApplicationError(error.code || 500, error.message);
    }
  };

  /**
   * Retrieves all users in the system.
   * @returns {Array} An array of user objects.
   */
  static getAllUsers = async () => {
    try {
      return await UserModel.find({});
    } catch (error) {
      throw new ApplicationError(error.code || 500, error.message);
    }
  };

  /**
   * Updates a user's profile by ID, allowing for name, email, gender, and avatar updates.
   * @param {Object} userInfo - User details to update.
   * @param {string} userId - The user's ID.
   * @param {string} avatar - The user's avatar file path.
   * @returns {Object} Success status and the updated user or an error message.
   */
  static updateUserById = async (userInfo, userId, avatar) => {
    const updateFields = {
      ...(userInfo.name && { name: userInfo.name }),
      ...(userInfo.email && { email: userInfo.email }),
      ...(userInfo.gender && { gender: userInfo.gender }),
      ...(avatar && { avatar: avatar }),
    };
    try {
      // Update user with provided fields
      const updatedUser = await UserModel.findByIdAndUpdate(
        { _id: userId },
        { $set: updateFields },
        { new: true }
      );

      if (!updatedUser) return { success: false, message: "User not found" };

      return { success: true, user: updatedUser };
    } catch (error) {
      throw new ApplicationError(error.code || 500, error.message);
    }
  };
}
