import FriendshipRepository from "./friendship.repository.js";

// Controller to toggle the friendship status (either send or remove a friend request)
export const toggleFriendShip = async (req, res) => {
  const userId = req.userId; // Extract the user ID from the request (set by JWT middleware)
  const friendId = req.params.friendId; // Extract the friend ID from the request parameters

  try {
    // Call the repository function to toggle the friendship status between user and friend
    const resp = await FriendshipRepository.toggleFriendShip(friendId, userId);

    // If the success value is 1, it means the friendship was successfully created (or requested)
    if (resp.success == 1) {
      return res.status(201).json(resp); // Send a 201 status code for successful creation
    }
    // If the success value is 0, it means the friendship was removed or the request was canceled
    else if (resp.success == 0) {
      return res.status(201).json({ resp }); // Send a 201 status for successful removal
    } else {
      // If no action was performed or an error occurred, send a 204 (No Content) response
      res.status(204).json({ message: resp.message });
    }
  } catch (error) {
    // In case of any error, return a 500 status with the error message
    return res.status(500).json({ error: error.message });
  }
};

// Controller to fetch the list of friends for a specific user
export const getFriendsById = async (req, res) => {
  const userId = req.params.userId; // Extract the userId from the request parameters

  try {
    // Call the repository function to get the list of friends for the specified user
    const resp = await FriendshipRepository.getFriendsByUserId(userId);

    // If friends are found, return them with a 200 OK status
    if (resp.success) {
      return res.status(200).json(resp);
    } else {
      // If no friends are found, return a 404 Not Found with a message
      return res.status(404).json({ message: resp.message });
    }
  } catch (error) {
    // In case of any error, return a 500 status with the error message
    return res.status(500).json({ error: error.message });
  }
};

// Controller to fetch the list of pending friend requests for a user
export const getPendingRequests = async (req, res) => {
  const userId = req.userId; // Extract the userId from the request (set by JWT middleware)

  try {
    // Call the repository function to get the list of pending friend requests for the user
    const resp = await FriendshipRepository.getPendingRequests(userId);

    // If there are pending requests, return them with a 200 OK status
    if (resp.success) {
      return res.status(200).json(resp);
    } else {
      // If no pending requests are found, return a 404 Not Found with a message
      return res.status(404).json({ message: resp.message });
    }
  } catch (error) {
    // In case of any error, return a 500 status with the error message
    return res.status(500).json({ error: error.message });
  }
};

// Controller to respond to a pending friend request (accept or reject)
export const responseToRequest = async (req, res) => {
  const userId = req.userId; // Extract the userId from the request (set by JWT middleware)
  const friendId = req.params.friendId; // Extract the friendId from the request parameters
  const status = req.body.status; // Extract the status (accept/reject) from the request body

  try {
    // Call the repository function to handle the response to the friend request
    const resp = await FriendshipRepository.responseToRequest(
      userId,
      friendId,
      status
    );

    // If the response is successful, return the updated data with a 200 OK status
    if (resp.success) {
      return res.status(200).json(resp);
    } else {
      // If there was an issue with the response, return a 404 Not Found with a message
      return res.status(404).json({ message: resp.message });
    }
  } catch (error) {
    // In case of any error, return a 500 status with the error message
    return res.status(500).json({ error: error.message });
  }
};
