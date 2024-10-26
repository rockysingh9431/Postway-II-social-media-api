import LikeModel from "./like.model.js";
import { ApplicationError } from "../../errorHandler/applicationError.js";

export const getLikes = (req, res) => {
  try {
    let postId = req.params.postId;
    postId = parseInt(postId);

    // Fetch likes for the given postId
    const resp = LikeModel.getLikesBypostId(postId); // assuming it's async

    if (resp.success) {
      return res.status(200).json(resp.likes);
    } else {
      return res.status(404).json({ message: resp.message });
    }
  } catch (error) {
    // Pass the error to the error-handling middleware
    throw new ApplicationError(
      error.message || "An error occurred while fetching likes",
      error.status || 500
    );
  }
};

export const toggleLikes = (req, res) => {
  try {
    const postId = parseInt(req.params.postId);
    const userId = req.userID;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Toggle like status (assuming it's async)
    const resp = LikeModel.toggleLike(postId, userId);

    if (resp.success) {
      return res.status(200).json({ message: resp.message, like: resp.like });
    } else {
      return res.status(404).json({ message: resp.message });
    }
  } catch (error) {
    throw new ApplicationError(error.message, error.status);
  }
};
