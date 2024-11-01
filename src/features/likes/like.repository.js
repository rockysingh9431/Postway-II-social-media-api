import LikeModel from "./like.model.js";
import PostModel from "../post/post.model.js";
export default class LikeRepository {
  static getLikesByPostId = async (postId) => {
    const likes = await LikeModel.find({ postId });
    if (likes) {
      return { success: true, likes };
    }
    return {
      success: false,
      message: "No likes found for this post",
    };
  };

  // Method to toggle (like/unlike) a post by a user
  static toggleLike = async (postId, userId) => {
    // Check if the user has already liked the post
    const like = await LikeModel.findOneAndDelete({
      userId: userId.toString(),
      postId: postId.toString(),
    });
    if (like) {
      await PostModel.findByIdAndUpdate(
        { _id: postId },
        {
          $pull: { likes: like._id },
        }
      );
      return {
        success: false,
        message: "Already liked, so unliked successfully",
      };
    } else {
      // If the like does not exist, create and add a new like
      const newLike = new LikeModel({ userId, postId });
      await newLike.save();
      await PostModel.findByIdAndUpdate(
        postId,
        { $push: { likes: newLike._id } },
        { new: true }
      );
      return { success: true, message: "Liked successfully", like: newLike };
    }
  };
}
