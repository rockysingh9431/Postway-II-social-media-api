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
import jwtAuth from "../../middlewares/jwt.middleware.js";

const postRouter = express.Router();

postRouter.get("/all", getALLPost);
postRouter.get("/:id", jwtAuth, getPostById);
postRouter.get("/", jwtAuth, getPostByUser);
postRouter.post("/", jwtAuth, upload.single("image"), createPost);
postRouter.delete("/:id", jwtAuth, deletePost);
postRouter.put("/:id", jwtAuth, upload.single("image"), updatePost);

export default postRouter;
