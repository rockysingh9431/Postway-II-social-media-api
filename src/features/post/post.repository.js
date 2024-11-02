import PostModel from "./post.model.js";
import ApplicationError from "../../errorHandler/applicationError.js";

export default class PostRepository {
  static createPost = async (postData) => {
    try {
      const newPost = new PostModel({
        userId: postData.userId,
        caption: postData.caption,
        imageURL: postData.imageURL,
      });
      await newPost.save();
      return newPost; // Save the new post to the database
    } catch (error) {
      throw new ApplicationError(error.code || 500, error.message);
    }
  };

  // Get posts with optional filtering, sorting, and pagination
  static getAllPosts = async () => {
    try {
      const posts = await PostModel.find({});
      if (posts) {
        return { success: true, posts }; // Return all posts if found
      } else {
        return { success: false, message: "No posts found" }; // Return error message if no posts
      }
    } catch (error) {
      throw new ApplicationError(error.code || 500, error.message);
    }
  };

  // Get a specific post by its ID
  static getPostById = async (id) => {
    try {
      const post = await PostModel.findOne({ _id: id });
      if (post) {
        return { success: true, post }; // Return post if found
      }
      return { success: false, message: "Post not found" }; // Return error message if not found
    } catch (error) {
      throw new ApplicationError(error.code || 500, error.message);
    }
  };

  // Get all posts by a specific user
  static getPostsByUserId = async (userId) => {
    try {
      const userPosts = await PostModel.find({ userId });
      if (userPosts) {
        return { success: true, posts: userPosts }; // Return posts if found
      }
      return { success: false, message: "No posts found for this user" }; // Return error message if no posts
    } catch (error) {
      throw new ApplicationError(error.code || 500, error.message);
    }
  };

  // Delete a specific post by its ID
  static deletePost = async (postId, userId) => {
    try {
      const post = await PostModel.findOneAndDelete({ _id: postId });
      if (post) {
        return { success: true, message: "Post successfully deleted", post }; // Return success message
      }
      return { success: false, message: "Post not found" }; // Return error message if not found
    } catch (error) {
      throw new ApplicationError(error.code || 500, error.message);
    }
  };

  // Update a specific post by its ID
  static updatePost = async (postId, updatedPostData) => {
    try {
      const post = await PostModel.findOne({ _id: postId });
      if (post) {
        // Update post details
        post.caption = updatedPostData.caption || post.caption;
        post.imageURL = updatedPostData.imageURL || post.imageURL;
        await post.save();
        return { success: true, post: post }; // Return updated post
      }
      return { success: false, message: "Post not found" }; // Return error message if not found
    } catch (error) {
      throw new ApplicationError(error.code || 500, error.message);
    }
  };

  // Update the status of a specific post (e.g., draft, archived)
  static updatePostStatus = async (postId, status) => {
    try {
      const post = await PostModel.findOne({ _id: postId });
      if (post) {
        post.status = status; // Update post status
        await post.save();
        return { success: true, message: `Post marked as ${status}` }; // Return success message
      }
      return { success: false, message: "Post not found" }; // Return error message if not found
    } catch (error) {
      throw new ApplicationError(error.code || 500, error.message);
    }
  };
}
