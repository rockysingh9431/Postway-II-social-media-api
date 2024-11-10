import PostRepository from "./post.repository.js";

// Create a new post
export const createPost = async (req, res) => {
  try {
    // Extract caption from the request body and construct the image URL using the uploaded file name
    const { caption } = req.body;
    const imageUrl = "/uploads/" + "post-" + req.file?.filename;

    // Call the PostRepository to create a new post in the database
    const newPost = await PostRepository.createPost({
      userId: req.userId,
      caption,
      imageURL: imageUrl,
    });

    // Return a success response with the created post
    return res.status(201).json({ post: newPost });
  } catch (error) {
    // Catch and return any errors that occur
    return res.status(error.code).json({ error: error.message });
  }
};

// Get all posts with optional filtering, sorting, and pagination
export const getALLPost = async (req, res) => {
  try {
    // Fetch all posts from the repository
    const resp = await PostRepository.getAllPosts();

    // If posts are found, return them in the response
    if (resp.success) {
      return res.status(200).json({ posts: resp.posts });
    } else {
      // If no posts are found, return a failure message
      return res.status(404).json({ message: response.message });
    }
  } catch (error) {
    // Handle any errors that occur during the process
    return res.status(error.code).json({ error: error.message });
  }
};

// Get a specific post by its ID
export const getPostById = async (req, res) => {
  try {
    // Get the postId from the request parameters
    const postId = req.params.postId;

    // Fetch the specific post by its ID from the repository
    const resp = await PostRepository.getPostById(postId);

    // If the post exists, return it in the response
    if (resp.success) {
      return res.status(200).json(resp.post);
    } else {
      // If no post is found, return a failure message
      return res.status(404).json({ message: resp.message });
    }
  } catch (error) {
    // Catch any errors and return an error message
    return res.status(error.code).json({ error: error.message });
  }
};

// Get all posts by a specific user
export const getPostByUser = async (req, res) => {
  try {
    // Get the userId from the authenticated user
    const userId = req.userId;

    // Fetch all posts by the specific user from the repository
    const resp = await PostRepository.getPostsByUserId(userId);

    // If posts are found, return them in the response
    if (resp.success) {
      return res.status(200).json(resp.posts);
    } else {
      // If no posts are found, return a failure message
      return res.status(404).json({ message: resp.message });
    }
  } catch (error) {
    // Catch any errors that occur during the process
    return res.status(error.code).json({ error: error.message });
  }
};

// Delete a specific post by its ID
export const deletePost = async (req, res) => {
  try {
    // Get the postId from the request parameters and the userId from the authenticated user
    const postId = req.params.postId;
    const userId = req.userId;

    // Call the PostRepository to delete the specific post
    const resp = await PostRepository.deletePost(postId, userId);

    // If the post is deleted, return a success message
    if (resp.success) {
      return res.status(200).json({ message: resp });
    } else {
      // If the post is not found, return a failure message
      return res.status(404).json({ message: resp.message });
    }
  } catch (error) {
    // Catch any errors and return an error message
    return res.status(error.code).json({ error: error.message });
  }
};

// Update a specific post by its ID
export const updatePost = async (req, res) => {
  try {
    // Get the postId from the request parameters, and the caption and image from the request body
    const postId = req.params.postId;
    const { caption } = req.body;
    const imageUrl = req.file?.filename;

    // Call the PostRepository to update the post
    const resp = await PostRepository.updatePost(postId, {
      caption,
      imageURL: imageUrl,
    });

    // If the post is updated successfully, return the updated post
    if (resp.success) {
      return res.status(200).json(resp.post);
    } else {
      // If no post is found, return a failure message
      return res.status(404).json({ message: resp.message });
    }
  } catch (error) {
    // Catch and return any errors that occur
    return res.status(error.code).json({ error: error.message });
  }
};

// Update the status of a specific post (e.g., activate or deactivate)
export const updatePostStatus = (req, res) => {
  try {
    // Get the postId from the request parameters and the new status from the request body
    const postId = req.params.postId;
    const status = req.body.status;

    // Call the PostRepository to update the post status
    const resp = PostRepository.updatePostStatus(postId, status);

    // If the status is updated successfully, return a success message
    if (resp.success) {
      return res.status(200).json({ message: resp.message });
    } else {
      // If the post is not found, return a failure message
      return res.status(404).json({ message: resp.message });
    }
  } catch (error) {
    // Catch any errors and return an error message
    return res.status(error.code).json({ error: error.message });
  }
};
