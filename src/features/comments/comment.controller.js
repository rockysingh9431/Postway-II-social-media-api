import CommentRepository from "./comment.repository.js";
// Create a new comment for a specific post
export const createComment = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.userId;
    const { content } = req.body;
    const comment = await CommentRepository.createComment(
      content,
      postId,
      userId
    );

    return res.status(201).json({ comment });
  } catch (error) {
    return res.status(error.code).json({ error: error.message });
  }
};

// Get all comments for a specific post
export const getCommentsByPostId = async (req, res) => {
  try {
    const postId = req.params.postId;
    const resp = await CommentRepository.getCommentsByPostId(postId);
    if (resp.success) {
      return res.status(200).json(resp.comments);
    } else {
      return res.status(404).json({ message: resp.message });
    }
  } catch (error) {
    return res.status(error.code).json({ error: error.message });
  }
};

// Delete a specific comment by its ID
export const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const resp = await CommentRepository.deleteComment(commentId);
    if (resp.success) {
      return res.status(200).json(resp);
    } else {
      return res.status(204).send(resp); // 204 No Content for successful delete
    }
  } catch (error) {
    return res.status(error.code).json({ error: error.message });
  }
};

// Update a specific comment by its ID
export const updateComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const { content } = req.body;
    const resp = await CommentRepository.updateComment(content, commentId);
    if (resp.success) {
      return res.status(200).json(resp.data);
    } else {
      return res.status(404).json({ message: resp.message });
    }
  } catch (error) {
    return res.status(error.code).json({ error: error.message });
  }
};
