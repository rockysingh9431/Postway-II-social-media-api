import CommentModel from "./comment.model.js";
import ApplicationError from "../../errorHandler/applicationError.js";

export default class CommentRepository {
  static createComment = async (content, postId, userId) => {
    try {
      const newComment = new CommentModel({ content, postId, userId });
      await newComment.save();
      return newComment;
    } catch (error) {
      throw new ApplicationError(error.code || 500, error.message);
    }
  };

  static getCommentsByPostId = async (postId) => {
    try {
      const comments = await CommentModel.find({ postId });
      if (comments) {
        return { success: true, comments };
      } else {
        return { success: false, message: "Comment Not Found" };
      }
    } catch (error) {
      throw new ApplicationError(error.code || 500, error.message);
    }
  };

  static deleteComment = async (commentId) => {
    try {
      const comment = await CommentModel.findByIdAndDelete({ _id: commentId });
      if (!comment)
        return { success: false, message: "No comment found for deletion" };
      return {
        success: true,
        message: "Successfully deleted Comment",
        comment,
      };
    } catch (error) {
      throw new ApplicationError(error.code || 500, error.message);
    }
  };

  static updateComment = async (content, commentId) => {
    try {
      const comment = await CommentModel.findByIdAndUpdate(
        commentId,
        { content },
        { new: true }
      );
      if (!comment)
        return { success: false, message: "Comment not found to Update" };
      return { success: true, data: comment };
    } catch (error) {
      throw new ApplicationError(error.code || 500, error.message);
    }
  };
}
