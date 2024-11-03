import ApplicationError from "../../errorHandler/applicationError.js";
import FriendShipModel from "./friendship.model.js";
export default class FriendshipRepository {
  static toggleFriendShip = async (friendId, userId) => {
    console.log(friendId, userId);
    const [requester, recipient] =
      userId < friendId ? [userId, friendId] : [friendId, userId];
    console.log(requester, recipient);
    try {
      const existingFriendship = await FriendShipModel.findOne({
        requester,
        recipient,
      });

      if (existingFriendship) {
        return {
          success: false,
          message:
            "friendship already exists or pending approval from recipient",
        };
      } else {
        const friendShip = new FriendShipModel({
          requester,
          recipient,
        });
        await friendShip.save();
        return {
          success: true,
          message: "Friendship requested",
          friendship: friendShip,
        };
      }
    } catch (error) {
      throw new ApplicationError(error.code || 500, error.message);
    }
  };

  static getFriendsByUserId = async (userId) => {
    try {
      const friends = await FriendShipModel.find({
        $or: [{ recipient: userId }, { requester: userId }],
        status: "accepted",
      });
      if (friends) {
        return { success: true, friends };
      }
      return {
        success: false,
        message: "No friends found for this user",
      };
    } catch (error) {
      throw new ApplicationError(error.code || 500, error.message);
    }
  };
  static getPendingRequests = async (userId) => {
    try {
      const pendingRequests = await FriendShipModel.find({
        $or: [{ recipient: userId }, { requester: userId }],
        status: "pending",
      });
      if (pendingRequests) {
        return { success: true, pendingRequests };
      }
      return {
        success: false,
        message: "No pending requests found for this user",
      };
    } catch (error) {
      throw new ApplicationError(error.code || 500, error.message);
    }
  };
  static responseToRequest = async (userId, friendId, status) => {
    try {
      const [requester, recipient] = [friendId, userId];
      const existingFriendship = await FriendShipModel.findOneAndUpdate(
        {
          requester,
          recipient,
        },
        { $set: { status: status }, updatedAt: Date.now() },
        { new: true }
      );
      if (status == "rejected") {
        await FriendShipModel.findOneAndDelete({
          requester: friendId,
          recipient: userId,
        });
      }
      if (!existingFriendship)
        return { success: false, message: "No request between the two person" };
      return { success: true, friendShip: existingFriendship };
    } catch (error) {
      throw new ApplicationError(error.code || 500, error.message);
    }
  };
}
