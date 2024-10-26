const comments = [
  {
    id: 1,
    content: "First Comment",
    postId: 1,
    userId: 1,
  },
];

export default class CommentModel {
  constructor(id, content, postId, userId) {
    this.id = id; // Unique identifier for the comment
    this.content = content; // The text content of the comment
    this.postId = postId; // ID of the post to which the comment belongs
    this.userId = userId; // ID of the user who made the comment
  }

  // Get all comments for a specific post by its ID
  static getCommentsByPostId(postId) {
    const comment = comments.filter((comment) => comment.postId === postId);
    if (comment.length > 0) {
      return { success: true, comments: comment }; // Return comments if found
    } else {
      return { success: false, message: "No comments found for this post" }; // Return error message if no comments
    }
  }

  // Create a new comment
  static createComment(content, postId, userId) {
    // Generate a new comment ID
    const comment = new CommentModel(
      comments.length + 1,
      content,
      postId,
      userId
    );
    comments.push(comment); // Add the new comment to the comments array
    return { success: true, comment }; // Return the created comment
  }

  // Delete a comment by its ID
  static deleteComment(commentId) {
    // Find the index of the comment to delete
    const index = comments.findIndex(
      (comment) => comment.id === parseInt(commentId)
    );
    if (index !== -1) {
      comments.splice(index, 1); // Remove the comment from the array
      return { success: true, message: "Successfully deleted Comment" }; // Return success message
    }
    return { success: false, message: "Comment not found" }; // Return error message if comment not found
  }

  // Update the content of a comment by its ID
  static updateComment(content, commentId) {
    // Find the index of the comment to update
    const index = comments.findIndex(
      (comment) => comment.id === parseInt(commentId)
    );
    if (index !== -1) {
      comments[index].content = content; // Update the comment's content
      return { success: true, data: comments[index] }; // Return the updated comment
    } else {
      return { success: false, message: "Comment not found" }; // Return error message if comment not found
    }
  }
}
