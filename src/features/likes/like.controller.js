import LikeRepository from "./like.repository.js";
export const getLikes = async (req, res) => {
  try {
    let postId = req.params.postId;

    // Fetch likes for the given postId
    const resp = await LikeRepository.getLikesBypostId(postId); // assuming it's async

    if (resp.success) {
      return res.status(200).json(resp);
    } else {
      return res.status(404).json({ message: resp.message });
    }
  } catch (error) {
    return res.status(error.code).json({ message: error.message });
  }
};

export const toggleLikes = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.userId;

    const resp = await LikeRepository.toggleLike(postId, userId);

    if (resp.success) {
      return res.status(201).json(resp);
    } else {
      return res.status(200).json({ message: resp.message });
    }
  } catch (error) {
    return res.status(error.code).json({ message: error.message });
  }
};
