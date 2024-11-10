import CommentModel from "./comment.model.js";
import ApplicationError from "../../errorHandler/applicationError.js";

// CommentRepository class handles all database interactions related to comments
export default class CommentRepository {
  // Method to create a new comment
  // Takes content, postId, and userId as arguments
  static createComment = async (content, postId, userId) => {
    try {
      const newComment = new CommentModel({ content, postId, userId });
      await newComment.save(); // Saves the new comment in the database
      return newComment; // Returns the saved comment
    } catch (error) {
      throw new ApplicationError(error.code || 500, error.message); // Throws a custom application error on failure
    }
  };

  // Method to fetch all comments for a specific post
  // Takes postId as an argument
  static getCommentsByPostId = async (postId) => {
    try {
      const comments = await CommentModel.find({ postId }); // Finds comments with the given postId
      if (comments) {
        return { success: true, comments }; // Returns the comments if found
      } else {
        return { success: false, message: "Comment Not Found" }; // Returns a message if no comments are found
      }
    } catch (error) {
      throw new ApplicationError(error.code || 500, error.message); // Throws a custom application error on failure
    }
  };

  // Method to delete a comment by its ID
  // Takes commentId as an argument
  static deleteComment = async (commentId) => {
    try {
      const comment = await CommentModel.findByIdAndDelete({ _id: commentId }); // Finds and deletes the comment by its ID
      if (!comment)
        return { success: false, message: "No comment found for deletion" }; // Returns message if no comment is found
      return {
        success: true,
        message: "Successfully deleted Comment",
        comment, // Returns the deleted comment
      };
    } catch (error) {
      throw new ApplicationError(error.code || 500, error.message); // Throws a custom application error on failure
    }
  };

  // Method to update the content of a comment
  // Takes new content and commentId as arguments
  static updateComment = async (content, commentId) => {
    try {
      const comment = await CommentModel.findByIdAndUpdate(
        commentId,
        { content }, // Updates the content of the comment
        { new: true } // Returns the updated comment document
      );
      if (!comment)
        return { success: false, message: "Comment not found to Update" }; // Returns a message if no comment is found
      return { success: true, data: comment }; // Returns the updated comment data
    } catch (error) {
      throw new ApplicationError(error.code || 500, error.message); // Throws a custom application error on failure
    }
  };
}
