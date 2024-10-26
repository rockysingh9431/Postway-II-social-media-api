import express from "express";
import {
  getFriendsById,
  getPendingRequests,
  responseToRequest,
  toggleFriendShip,
} from "./friendship.controller.js";

const friendshipRouter = express.Router();

friendshipRouter.get("/get-friends/:userId", getFriendsById);
friendshipRouter.get("/get-pending-requests", getPendingRequests);
friendshipRouter.put("/toggle-friendship/:friendId", toggleFriendShip);
friendshipRouter.post("/response-to-request", responseToRequest);

export default friendshipRouter;
