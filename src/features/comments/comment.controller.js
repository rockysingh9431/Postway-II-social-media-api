import CommentModel from "./comment.model.js";
import { ApplicationError } from "../../errorHandler/applicationError.js";

// Create a new comment for a specific post
export const createComment = (req, res) => {
  try {
    // Extract postId and userId from the request
    const postId = parseInt(req.params.postId);
    const userId = req.userID;
    // Extract content from the request body
    const { content } = req.body;
    // Create a new comment using the CommentModel
    const comment = CommentModel.createComment(content, postId, userId);
    // Respond with the created comment
    return res.status(201).json(comment);
  } catch (error) {
    // Handle errors by throwing an ApplicationError
    throw new ApplicationError(error.message, error.status);
  }
};

// Get all comments for a specific post
export const getCommentsByPostId = (req, res) => {
  try {
    // Extract postId from the request parameters
    const postId = parseInt(req.params.postId);
    console.log(postId);
    // Retrieve comments for the specified post using CommentModel
    const resp = CommentModel.getCommentsByPostId(postId);
    // Respond with the comments if found, otherwise respond with an error message
    if (resp.success) {
      return res.status(200).json(resp.comments);
    } else {
      return res.status(404).json({ message: resp.message });
    }
  } catch (error) {
    // Handle errors by throwing an ApplicationError
    throw new ApplicationError(error.message, error.status);
  }
};

// Delete a specific comment by its ID
export const deleteComment = (req, res) => {
  try {
    // Extract commentId from the request parameters
    const commentId = req.params.id;
    // Delete the comment using CommentModel
    const resp = CommentModel.deleteComment(commentId);
    // Respond with success message if deleted, otherwise respond with an error message
    if (resp.success) {
      return res.status(204).json(resp.message); // 204 No Content for successful delete
    } else {
      return res.status(404).send(resp.message);
    }
  } catch (error) {
    // Handle errors by throwing an ApplicationError
    throw new ApplicationError(error.message, error.status);
  }
};

// Update a specific comment by its ID
export const updateComment = (req, res) => {
  try {
    // Extract commentId from the request parameters
    const commentId = req.params.commentId;
    // Extract content from the request body
    const { content } = req.body;
    // Update the comment using CommentModel
    const resp = CommentModel.updateComment(content, commentId);
    // Respond with the updated comment if successful, otherwise respond with an error message
    if (resp.success) {
      return res.status(200).json(resp.data);
    } else {
      return res.status(404).json({ message: resp.message });
    }
  } catch (error) {
    // Handle errors by throwing an ApplicationError
    throw new ApplicationError(error.message, error.status);
  }
};
