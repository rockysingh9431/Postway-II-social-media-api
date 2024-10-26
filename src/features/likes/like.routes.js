import express from "express";
import { getLikes, toggleLikes } from "./like.controller.js";

const likeRouter = express.Router();

likeRouter.get("/:postId", getLikes);
likeRouter.get("/toggle/:postId", toggleLikes);

export default likeRouter;
