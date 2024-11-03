import express from "express";
import {
  getFriendsById,
  getPendingRequests,
  responseToRequest,
  toggleFriendShip,
} from "./friendship.controller.js";
import jwtAuth from "../../middlewares/jwt.middleware.js";

const friendshipRouter = express.Router();

friendshipRouter.get("/get-friends/:userId", jwtAuth, getFriendsById);
friendshipRouter.get("/get-pending-requests", jwtAuth, getPendingRequests);
friendshipRouter.post(
  "/toggle-friendship/:friendId",
  jwtAuth,
  toggleFriendShip
);
friendshipRouter.post(
  "/response-to-request/:friendId",
  jwtAuth,
  responseToRequest
);

export default friendshipRouter;
