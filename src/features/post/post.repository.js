import PostModel from "./post.model.js";
import ApplicationError from "../../errorHandler/applicationError.js";

export default class PostRepository {
  // Create a new post in the database
  static createPost = async (postData) => {
    try {
      // Create a new post document using the provided postData
      const newPost = new PostModel({
        userId: postData.userId,
        caption: postData.caption,
        imageURL: postData.imageURL,
      });

      // Save the new post to the database
      await newPost.save();
      return newPost; // Return the saved post
    } catch (error) {
      // Handle any errors and throw a custom application error
      throw new ApplicationError(error.code || 500, error.message);
    }
  };

  // Get all posts, with optional filtering, sorting, and pagination
  static getAllPosts = async () => {
    try {
      // Fetch all posts from the database
      const posts = await PostModel.find({});
      if (posts) {
        // Return the posts if found
        return { success: true, posts };
      } else {
        // Return a failure message if no posts are found
        return { success: false, message: "No posts found" };
      }
    } catch (error) {
      // Handle any errors and throw a custom application error
      throw new ApplicationError(error.code || 500, error.message);
    }
  };

  // Get a specific post by its ID
  static getPostById = async (id) => {
    try {
      // Find the post by its ID
      const post = await PostModel.findOne({ _id: id });
      if (post) {
        // Return the post if found
        return { success: true, post };
      }
      // Return an error message if the post is not found
      return { success: false, message: "Post not found" };
    } catch (error) {
      // Handle any errors and throw a custom application error
      throw new ApplicationError(error.code || 500, error.message);
    }
  };

  // Get all posts by a specific user
  static getPostsByUserId = async (userId) => {
    try {
      // Find all posts by the specified user
      const userPosts = await PostModel.find({ userId });
      if (userPosts) {
        // Return the user's posts if found
        return { success: true, posts: userPosts };
      }
      // Return an error message if no posts are found for the user
      return { success: false, message: "No posts found for this user" };
    } catch (error) {
      // Handle any errors and throw a custom application error
      throw new ApplicationError(error.code || 500, error.message);
    }
  };

  // Delete a specific post by its ID
  static deletePost = async (postId, userId) => {
    try {
      // Try to find and delete the post by its ID
      const post = await PostModel.findOneAndDelete({ _id: postId });
      if (post) {
        // Return success message if the post was successfully deleted
        return { success: true, message: "Post successfully deleted", post };
      }
      // Return error message if the post is not found
      return { success: false, message: "Post not found" };
    } catch (error) {
      // Handle any errors and throw a custom application error
      throw new ApplicationError(error.code || 500, error.message);
    }
  };

  // Update a specific post by its ID
  static updatePost = async (postId, updatedPostData) => {
    try {
      // Find the post by its ID
      const post = await PostModel.findOne({ _id: postId });
      if (post) {
        // Update the post details with the provided data
        post.caption = updatedPostData.caption || post.caption;
        post.imageURL = updatedPostData.imageURL || post.imageURL;

        // Save the updated post to the database
        await post.save();
        // Return the updated post
        return { success: true, post: post };
      }
      // Return an error message if the post is not found
      return { success: false, message: "Post not found" };
    } catch (error) {
      // Handle any errors and throw a custom application error
      throw new ApplicationError(error.code || 500, error.message);
    }
  };

  // Update the status of a specific post (e.g., to mark it as draft, archived, etc.)
  static updatePostStatus = async (postId, status) => {
    try {
      // Find the post by its ID
      const post = await PostModel.findOne({ _id: postId });
      if (post) {
        // Update the post status
        post.status = status;

        // Save the updated post to the database
        await post.save();
        // Return a success message indicating the post status has been updated
        return { success: true, message: `Post marked as ${status}` };
      }
      // Return an error message if the post is not found
      return { success: false, message: "Post not found" };
    } catch (error) {
      // Handle any errors and throw a custom application error
      throw new ApplicationError(error.code || 500, error.message);
    }
  };
}
