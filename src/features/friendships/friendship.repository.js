import { UserModel } from "../user/user.model.js";
import ApplicationError from "../../errorHandler/applicationError.js";
export default class FriendshipRepository {
  static toggleFriendShip = async (userid, friendId) => {
    try {
    } catch (error) {
      throw new ApplicationError(500, error.message);
    }
  };

  static getFriendsByUserId = async (userId) => {
    const friends = await FriendshipModel.find({ userId, status: "accepted" });
    if (friends) {
      return { success: true, friends };
    }
    return {
      success: false,
      message: "No friends found for this user",
    };
  };
}
