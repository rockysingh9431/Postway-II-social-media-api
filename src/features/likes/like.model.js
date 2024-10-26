// Sample data for likes
const likes = [
  {
    id: 1,
    userId: 3,
    postId: 1,
  },
];

export default class LikeModel {
  // Constructor to initialize a new like
  constructor(id, userId, postId) {
    this.id = id;
    this.userId = userId;
    this.postId = postId;
  }

  // Method to get all likes for a specific post
  static getLikesByPostId(postId) {
    // Filter likes based on postId
    const filteredLikes = likes.filter((like) => like.postId === postId);
    if (filteredLikes.length > 0) {
      return { success: true, likes: filteredLikes };
    } else {
      return {
        success: false,
        message: "No likes found for this post",
      };
    }
  }

  // Method to toggle (like/unlike) a post by a user
  static toggleLike(postId, userId) {
    // Check if the user has already liked the post
    const like = likes.find(
      (like) => like.userId === userId && like.postId === postId
    );
    if (like) {
      // If the like exists, remove it (unlike)
      likes.splice(likes.indexOf(like), 1);
      return {
        success: false,
        message: "Already liked, so unliked successfully",
      };
    } else {
      // If the like does not exist, create and add a new like
      const id = likes.length + 1;
      const newLike = new LikeModel(id, userId, postId);
      likes.push(newLike);
      return { success: true, message: "Liked successfully", like: newLike };
    }
  }
}
