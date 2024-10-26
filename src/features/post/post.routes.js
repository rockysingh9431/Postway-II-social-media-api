import express from "express";
import { upload } from "../../middlewares/fileupload.middleware.js";
import {
  createPost,
  deletePost,
  getALLPost,
  getPostById,
  getPostUser,
  updatePost,
} from "./post.controller.js";

const postRouter = express.Router();
postRouter.get("/all", getALLPost);
postRouter.get("/:id", getPostById);
postRouter.get("/", getPostUser);
postRouter.post("/", upload.single("imageUrl"), createPost);
postRouter.delete("/:id", deletePost);
postRouter.put("/:id", upload.single("imageUrl"), updatePost);
// postRouter.post("/:id/bookmark", bookmarkPost);
// postRouter.put("/:id/:status", updatePostStatus);

export default postRouter;
