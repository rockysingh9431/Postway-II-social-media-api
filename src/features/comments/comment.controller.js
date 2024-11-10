import CommentRepository from "./comment.repository.js";

// Controller to create a new comment for a specific post
export const createComment = async (req, res) => {
  try {
    // Extracting postId, userId, and content from the request
    const postId = req.params.postId;
    const userId = req.userId; // Assuming userId is obtained from the authentication middleware
    const { content } = req.body;

    // Calling repository function to create the comment
    const comment = await CommentRepository.createComment(
      content,
      postId,
      userId
    );

    // Returning the created comment with a 201 status code (created)
    return res.status(201).json({ comment });
  } catch (error) {
    // Handling error and sending the appropriate response code
    return res.status(error.code).json({ error: error.message });
  }
};

// Controller to get all comments for a specific post
export const getCommentsByPostId = async (req, res) => {
  try {
    // Extracting postId from the request parameters
    const postId = req.params.postId;

    // Calling repository function to get comments for the post
    const resp = await CommentRepository.getCommentsByPostId(postId);

    // Sending a 200 response with the comments if found
    if (resp.success) {
      return res.status(200).json(resp.comments);
    } else {
      // Sending a 404 response if no comments are found
      return res.status(404).json({ message: resp.message });
    }
  } catch (error) {
    // Handling error and sending the appropriate response code
    return res.status(error.code).json({ error: error.message });
  }
};

// Controller to delete a specific comment by its ID
export const deleteComment = async (req, res) => {
  try {
    // Extracting commentId from the request parameters
    const commentId = req.params.commentId;

    // Calling repository function to delete the comment
    const resp = await CommentRepository.deleteComment(commentId);

    // If deletion is successful, send a 200 response with the result
    if (resp.success) {
      return res.status(200).json(resp);
    } else {
      // If no content is found to delete, send a 204 (No Content) response
      return res.status(204).send(resp);
    }
  } catch (error) {
    // Handling error and sending the appropriate response code
    return res.status(error.code).json({ error: error.message });
  }
};

// Controller to update a specific comment by its ID
export const updateComment = async (req, res) => {
  try {
    // Extracting commentId from the request parameters and content from the body
    const commentId = req.params.commentId;
    const { content } = req.body;

    // Calling repository function to update the comment
    const resp = await CommentRepository.updateComment(content, commentId);

    // If update is successful, return the updated comment data
    if (resp.success) {
      return res.status(200).json(resp.data);
    } else {
      // If comment not found, send a 404 (Not Found) response
      return res.status(404).json({ message: resp.message });
    }
  } catch (error) {
    // Handling error and sending the appropriate response code
    return res.status(error.code).json({ error: error.message });
  }
};
