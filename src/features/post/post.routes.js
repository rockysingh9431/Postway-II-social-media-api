import express from "express";
import { upload } from "../../middlewares/fileupload.middleware.js";
import {
  createPost,
  deletePost,
  getALLPost,
  getPostById,
  getPostByUser,
  updatePost,
} from "./post.controller.js";

const postRouter = express.Router();

postRouter.get("/all", getALLPost);
postRouter.get("/:postId", getPostById);
postRouter.get("/", getPostByUser);
postRouter.post("/", upload.single("image"), createPost);
postRouter.delete("/:postId", deletePost);
postRouter.put("/:postId", upload.single("image"), updatePost);

export default postRouter;
