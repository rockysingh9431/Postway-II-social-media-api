import PostModel from "./post.model.js";
import { UserModel } from "../user/user.model.js";
export default class PostRepository {
  static createPost = async (postData) => {
    const newPost = new PostModel({
      userId: postData.userId,
      caption: postData.caption,
      imageURL: postData.imageURL,
      status: postData.status || "draft",
      likes: [],
      comments: [],
      createdAt: new Date(),
    });
    await newPost.save();
    const user = await UserModel.findOne({ _id: postData.userId });
    user.posts.push(newPost._id);
    await user.save();
    return newPost; // Save the new post to the database
  };

  // Get posts with optional filtering, sorting, and pagination
  static getAllPosts = async () => {
    let posts = await PostModel.find({});
    if (posts) {
      return { success: true, posts }; // Return all posts if found
    } else {
      return { success: false, message: "No posts found" }; // Return error message if no posts
    }
  };

  // Get a specific post by its ID
  static getPostById = async (id) => {
    const post = await PostModel.find({
      _id: id,
    });
    if (post) {
      return { success: true, post }; // Return post if found
    }
    return { success: false, message: "Post not found" }; // Return error message if not found
  };

  // Get all posts by a specific user
  static getPostsByUserId = async (userId) => {
    const userPosts = await PostModel.find({ userId: userId });

    if (userPosts) {
      return { success: true, posts: userPosts }; // Return posts if found
    }
    return { success: false, message: "No posts found for this user" }; // Return error message if no posts
  };

  // Delete a specific post by its ID
  static deletePost = async (postId, userId) => {
    const post = await PostModel.findOneAndDelete({ _id: postId });
    const user = await UserModel.findOne({ _id: userId });
    user.posts = user.posts.filter(
      (postID) => postID.toString() !== postId.toString()
    );
    await user.save();
    if (post) {
      return { success: true, message: "Post successfully deleted", post }; // Return success message
    }
    return { success: false, message: "Post not found" }; // Return error message if not found
  };

  // Update a specific post by its ID
  static updatePost = async (postId, updatedPostData) => {
    const post = await PostModel.findOne({ _id: postId });
    if (post) {
      // Update post details
      post.caption = updatedPostData.caption || post.caption;
      post.imageURL = updatedPostData.imageURL || post.imageURL;
      await post.save();
      return { success: true, post: post }; // Return updated post
    }
    return { success: false, message: "Post not found" }; // Return error message if not found
  };

  // Update the status of a specific post (e.g., draft, archived)
  static updatePostStatus = async (postId, status) => {
    const post = await PostModel.findOne({ _id: postId });
    if (post) {
      post.status = status; // Update post status
      await post.save();
      return { success: true, message: `Post marked as ${status}` }; // Return success message
    }
    return { success: false, message: "Post not found" }; // Return error message if not found
  };
}
