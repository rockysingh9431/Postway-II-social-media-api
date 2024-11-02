import LikeModel from "./like.model.js";
import ApplicationError from "../../errorHandler/applicationError.js";

export default class LikeRepository {
  static getLikesByPostId = async (postId) => {
    try {
      const likes = await LikeModel.find({ postId });
      if (likes) {
        return { success: true, likes };
      }
      return {
        success: false,
        message: "No likes found for this post",
      };
    } catch (error) {
      throw new ApplicationError(error.code || 500, error.message);
    }
  };

  // Method to toggle (like/unlike) a post by a user
  static toggleLike = async (postId, userId) => {
    // Check if the user has already liked the post
    try {
      const like = await LikeModel.findOneAndDelete({
        userId,
        postId,
      });
      if (like) {
        return {
          success: false,
          message: "Already liked, so unliked successfully",
        };
      } else {
        // If the like does not exist, create and add a new like
        const newLike = new LikeModel({ userId, postId });
        await newLike.save();
        return { success: true, message: "Liked successfully", like: newLike };
      }
    } catch (error) {
      throw new ApplicationError(error.code || 500, error.message);
    }
  };
}
