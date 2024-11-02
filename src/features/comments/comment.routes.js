import express from "express";
import {
  createComment,
  deleteComment,
  getCommentsByPostId,
  updateComment,
} from "./comment.controller.js";
import jwtAuth from "../../middlewares/jwt.middleware.js";
const commentRouter = express.Router();

commentRouter.get("/:postId", getCommentsByPostId);
commentRouter.post("/:postId", jwtAuth, createComment);
commentRouter.delete("/:commentId", jwtAuth, deleteComment);
commentRouter.put("/:commentId", jwtAuth, updateComment);

export default commentRouter;
