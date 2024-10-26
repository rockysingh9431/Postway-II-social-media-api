import PostModel from "./post.model.js";
import { ApplicationError } from "../../errorHandler/applicationError.js";

// Create a new post
export const createPost = (req, res) => {
  try {
    const { caption } = req.body;
    const imageUrl = req.file?.filename;

    const newPost = PostModel.createPost({
      userId: req.userID,
      caption,
      imageURL: imageUrl,
    });

    return res.status(201).json(newPost);
  } catch (error) {
    throw new ApplicationError(error.message, error.status);
  }
};

// Get all posts with optional filtering, sorting, and pagination
export const getALLPost = (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { caption, status, sort } = req.body;

    const posts = PostModel.getFilteredPosts(
      caption,
      status,
      sort,
      parseInt(page),
      parseInt(limit)
    );

    if (posts.length > 0) {
      return res.status(200).json(posts);
    } else {
      return res.status(404).json({ message: "No posts found" });
    }
  } catch (error) {
    throw new ApplicationError(error.message, error.status);
  }
};

// Get a specific post by its ID
export const getPostById = (req, res) => {
  try {
    const postId = req.params.id;
    const resp = PostModel.getPostById(postId);

    if (resp.success) {
      return res.status(200).json(resp.post);
    } else {
      return res.status(404).json({ message: resp.message });
    }
  } catch (error) {
    throw new ApplicationError(error.message, error.status);
  }
};

// Get all posts by a specific user
export const getPostUser = (req, res) => {
  try {
    const userId = req.userID;
    const resp = PostModel.getPostsByUserId(userId);

    if (resp.success) {
      return res.status(200).json(resp.posts);
    } else {
      return res.status(404).json({ message: resp.message });
    }
  } catch (error) {
    throw new ApplicationError(error.message, error.status);
  }
};

// Delete a specific post by its ID
export const deletePost = (req, res) => {
  try {
    const postId = req.params.id;
    const resp = PostModel.deletePost(postId);

    if (resp.success) {
      return res.status(200).json({ message: resp.message });
    } else {
      return res.status(404).json({ message: resp.message });
    }
  } catch (error) {
    throw new ApplicationError(error.message, error.status);
  }
};

// Update a specific post by its ID
export const updatePost = (req, res) => {
  try {
    const postId = req.params.id;
    const { caption } = req.body;
    const imageUrl = req.file?.filename;

    const resp = PostModel.updatePost(postId, { caption, imageURL: imageUrl });

    if (resp.success) {
      return res.status(200).json(resp.post);
    } else {
      return res.status(404).json({ message: resp.message });
    }
  } catch (error) {
    throw new ApplicationError(error.message, error.status);
  }
};

// Update the status of a specific post
export const updatePostStatus = (req, res) => {
  try {
    const postId = req.params.id;
    const status = req.body.status;

    const resp = PostModel.updatePostStatus(postId, status);

    if (resp.success) {
      return res.status(200).json({ message: resp.message });
    } else {
      return res.status(404).json({ message: resp.message });
    }
  } catch (error) {
    throw new ApplicationError(error.message, error.status);
  }
};

// Bookmark a specific post
export const bookmarkPost = (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.userID;

    const resp = PostModel.toggleBookmark(postId, userId);

    if (resp.success) {
      return res.status(200).json({ message: resp.message });
    } else {
      return res.status(404).json({ message: resp.message });
    }
  } catch (error) {
    throw new ApplicationError(error.message, error.status);
  }
};
