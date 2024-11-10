import LikeRepository from "./like.repository.js";

// Controller method to get the likes for a specific post
export const getLikes = async (req, res) => {
  try {
    // Extract the postId from the request parameters
    let postId = req.params.postId;

    // Call the repository method to fetch likes for the given postId
    const resp = await LikeRepository.getLikesBypostId(postId); // assuming it's async

    // If likes are found, return them with a 200 status
    if (resp.success) {
      return res.status(200).json(resp);
    } else {
      // If no likes are found, return a 404 with a message
      return res.status(404).json({ message: resp.message });
    }
  } catch (error) {
    // In case of any error, return the error code and message
    return res.status(error.code).json({ message: error.message });
  }
};

// Controller method to toggle like (like or unlike) on a post
export const toggleLikes = async (req, res) => {
  try {
    // Extract postId and userId from the request
    const postId = req.params.postId;
    const userId = req.userId;

    // Call the repository method to toggle like for the given post and user
    const resp = await LikeRepository.toggleLike(postId, userId);

    // If the operation is successful, return the response with a 201 status
    if (resp.success) {
      return res.status(201).json(resp);
    } else {
      // If not successful, return a 200 status with a message
      return res.status(200).json({ message: resp.message });
    }
  } catch (error) {
    // In case of any error, return the error code and message
    return res.status(error.code).json({ message: error.message });
  }
};
