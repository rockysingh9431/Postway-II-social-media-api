import express from "express";
import {
  createComment,
  deleteComment,
  getCommentsByPostId,
  updateComment,
} from "./comment.controller.js";

const commentRouter = express.Router();

commentRouter.get("/:postId", getCommentsByPostId);
commentRouter.post("/:postId", createComment);
commentRouter.delete("/:commentId", deleteComment);
commentRouter.put("/:commentId", updateComment);

export default commentRouter;
