import LikeModel from "./like.model.js";
import ApplicationError from "../../errorHandler/applicationError.js";

export default class LikeRepository {
  // Method to get all likes for a specific post
  static getLikesByPostId = async (postId) => {
    try {
      // Find all likes for the given postId
      const likes = await LikeModel.find({ postId });

      // If likes are found, return them
      if (likes) {
        return { success: true, likes };
      }

      // If no likes are found, return a failure response
      return {
        success: false,
        message: "No likes found for this post",
      };
    } catch (error) {
      // If an error occurs, throw an ApplicationError
      throw new ApplicationError(error.code || 500, error.message);
    }
  };

  // Method to toggle the like status on a post by a user (like/unlike)
  static toggleLike = async (postId, userId) => {
    try {
      // Check if the user has already liked the post by attempting to delete the like
      const like = await LikeModel.findOneAndDelete({
        userId,
        postId,
      });

      // If the like exists, it means the user is unliking the post
      if (like) {
        return {
          success: false,
          message: "Already liked, so unliked successfully",
        };
      } else {
        // If the like doesn't exist, create a new like
        const newLike = new LikeModel({ userId, postId });
        await newLike.save();

        // Return success with the new like information
        return { success: true, message: "Liked successfully", like: newLike };
      }
    } catch (error) {
      // If an error occurs, throw an ApplicationError
      throw new ApplicationError(error.code || 500, error.message);
    }
  };
}
