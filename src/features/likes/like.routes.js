import express from "express";
import { getLikes, toggleLikes } from "./like.controller.js";
import jwtAuth from "../../middlewares/jwt.middleware.js";
const likeRouter = express.Router();

likeRouter.get("/:postId", jwtAuth, getLikes);
likeRouter.post("/toggle/:postId", jwtAuth, toggleLikes);

export default likeRouter;
