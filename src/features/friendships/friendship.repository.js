import ApplicationError from "../../errorHandler/applicationError.js";
import FriendShipModel from "./friendship.model.js";

export default class FriendshipRepository {
  // Method to toggle a friendship request between two users
  static toggleFriendShip = async (friendId, userId) => {
    console.log(friendId, userId); // Log the friend and user IDs for debugging

    // Determine the requester and recipient based on the user and friend IDs
    const [requester, recipient] =
      userId < friendId ? [userId, friendId] : [friendId, userId];

    console.log(requester, recipient); // Log the final requester and recipient IDs for debugging

    try {
      // Check if a friendship already exists between the two users
      const existingFriendship = await FriendShipModel.findOne({
        requester,
        recipient,
      });

      // If a friendship exists or is pending approval, return a message
      if (existingFriendship) {
        return {
          success: false,
          message:
            "Friendship already exists or pending approval from recipient",
        };
      } else {
        // If no existing friendship, create a new friend request
        const friendShip = new FriendShipModel({
          requester,
          recipient,
        });
        await friendShip.save(); // Save the new friendship request to the database

        return {
          success: true,
          message: "Friendship requested",
          friendship: friendShip,
        };
      }
    } catch (error) {
      // In case of any error, throw an application error
      throw new ApplicationError(error.code || 500, error.message);
    }
  };

  // Method to get the list of accepted friends for a given user
  static getFriendsByUserId = async (userId) => {
    try {
      // Find all friendships where the user is either the requester or recipient and status is 'accepted'
      const friends = await FriendShipModel.find({
        $or: [{ recipient: userId }, { requester: userId }],
        status: "accepted",
      });

      // If friends are found, return them
      if (friends) {
        return { success: true, friends };
      }

      // If no friends are found, return a message
      return {
        success: false,
        message: "No friends found for this user",
      };
    } catch (error) {
      // In case of any error, throw an application error
      throw new ApplicationError(error.code || 500, error.message);
    }
  };

  // Method to get the list of pending friend requests for a given user
  static getPendingRequests = async (userId) => {
    try {
      // Find all pending requests for the user where the status is 'pending'
      const pendingRequests = await FriendShipModel.find({
        $or: [{ recipient: userId }, { requester: userId }],
        status: "pending",
      });

      // If there are pending requests, return them
      if (pendingRequests) {
        return { success: true, pendingRequests };
      }

      // If no pending requests are found, return a message
      return {
        success: false,
        message: "No pending requests found for this user",
      };
    } catch (error) {
      // In case of any error, throw an application error
      throw new ApplicationError(error.code || 500, error.message);
    }
  };

  // Method to respond to a pending friend request (either accept or reject)
  static responseToRequest = async (userId, friendId, status) => {
    try {
      // Determine who is the requester and who is the recipient
      const [requester, recipient] = [friendId, userId];

      // Find and update the existing friendship request with the new status
      const existingFriendship = await FriendShipModel.findOneAndUpdate(
        {
          requester,
          recipient,
        },
        { $set: { status: status }, updatedAt: Date.now() }, // Update the status and timestamp
        { new: true } // Return the updated document
      );

      // If the status is 'rejected', delete the friendship request
      if (status == "rejected") {
        await FriendShipModel.findOneAndDelete({
          requester: friendId,
          recipient: userId,
        });
      }

      // If no existing friendship request is found, return a failure message
      if (!existingFriendship)
        return {
          success: false,
          message: "No request between the two persons",
        };

      // Return the updated friendship after responding to the request
      return { success: true, friendShip: existingFriendship };
    } catch (error) {
      // In case of any error, throw an application error
      throw new ApplicationError(error.code || 500, error.message);
    }
  };
}
