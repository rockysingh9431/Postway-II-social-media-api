import FriendshipRepository from "./friendship.repository.js";

export const toggleFriendShip = async (req, res) => {
  const userId = req.userId;
  const friendId = req.params.friendId;
  try {
    const resp = await FriendshipRepository.toggleFriendShip(friendId, userId);
    if (resp.success == 1) {
      return res.status(201).json(resp);
    } else if (resp.success == 0) {
      return res.status(200).json({ message: resp.message });
    } else {
      res.status(404).json({ message: resp.message });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const getFriendsById = async (req, res) => {
  const userId = req.params.userId;
  try {
    const resp = await FriendshipRepository.getFriendsByUserId(userId);
    if (resp.success) {
      return res.status(200).json(resp);
    } else {
      return res.status(404).json({ message: resp.message });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const getPendingRequests = async (req, res) => {
  const userId = req.userId;
  try {
    const resp = await FriendshipRepository.getPendingRequests(userId);
    if (resp.success) {
      return res.status(200).json(resp);
    } else {
      return res.status(404).json({ message: resp.message });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const responseToRequest = async (req, res) => {
  const userId = req.userId;
  const friendId = req.params.friendId;
  try {
    const resp = await FriendshipRepository.responseToRequest(userId, friendId);
    if (resp.success) {
      return res.status(200).json(resp);
    } else {
      return res.status(404).json({ message: resp.message });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
