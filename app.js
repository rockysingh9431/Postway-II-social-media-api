import express from "express";
import userRouter from "./src/features/user/user.routes.js";
import friendshipRouter from "./src/features/friendships/friendship.routes.js";
import postRouter from "./src/features/post/post.routes.js";
import likeRouter from "./src/features/likes/like.routes.js";
import commentRouter from "./src/features/comments/comment.routes.js";
import loggerMiddleware from "./src/middlewares/logger.middleware.js";
import jwtAuth from "./src/middlewares/jwt.middleware.js";
import cookieParser from "cookie-parser";
import { connectToMongoDB } from "./src/config/connectToMongoDB.js";

const app = express();
connectToMongoDB();
app.use(express.json());
app.use(loggerMiddleware);
app.use(cookieParser());

app.use("/api/users", userRouter);
app.use("/api/friends", jwtAuth, friendshipRouter);
app.use("/api/post", jwtAuth, postRouter);
app.use("/api/like", jwtAuth, likeRouter);
app.use("/api/comment", jwtAuth, commentRouter);

// 4. Middleware to handle 404 requests.
app.use((req, res) => {
  res
    .status(404)
    .send(
      "API not found. Please check our documentation for more information at localhost:3200/api-docs"
    );
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
