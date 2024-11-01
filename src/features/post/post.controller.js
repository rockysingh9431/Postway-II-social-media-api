import { ApplicationError } from "../../errorHandler/applicationError.js";
import PostRepository from "./post.repository.js";
// Create a new post
export const createPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const imageUrl = "/uploads/" + "post-" + req.file?.filename;

    const newPost = await PostRepository.createPost({
      userId: req.userId,
      caption,
      imageURL: imageUrl,
    });
    return res.status(201).json({ post: newPost });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get all posts with optional filtering, sorting, and pagination
export const getALLPost = async (req, res) => {
  try {
    const response = await PostRepository.getAllPosts();

    if (response.success) {
      return res.status(200).json(response);
    } else {
      return res.status(404).json({ message: response.message });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get a specific post by its ID
export const getPostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const resp = await PostRepository.getPostById(postId);

    if (resp.success) {
      return res.status(200).json(resp.post);
    } else {
      return res.status(404).json({ message: resp.message });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get all posts by a specific user
export const getPostByUser = async (req, res) => {
  try {
    const userId = req.userId;
    const resp = await PostRepository.getPostsByUserId(userId);

    if (resp.success) {
      return res.status(200).json(resp.posts);
    } else {
      return res.status(404).json({ message: resp.message });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Delete a specific post by its ID
export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.userId;
    const resp = await PostRepository.deletePost(postId, userId);

    if (resp.success) {
      return res.status(200).json({ message: resp });
    } else {
      return res.status(404).json({ message: resp.message });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Update a specific post by its ID
export const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { caption } = req.body;
    const imageUrl = req.file?.filename;

    const resp = await PostRepository.updatePost(postId, {
      caption,
      imageURL: imageUrl,
    });

    if (resp.success) {
      return res.status(200).json(resp.post);
    } else {
      return res.status(404).json({ message: resp.message });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Update the status of a specific post
export const updatePostStatus = (req, res) => {
  try {
    const postId = req.params.id;
    const status = req.body.status;

    const resp = PostRepository.updatePostStatus(postId, status);

    if (resp.success) {
      return res.status(200).json({ message: resp.message });
    } else {
      return res.status(404).json({ message: resp.message });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
