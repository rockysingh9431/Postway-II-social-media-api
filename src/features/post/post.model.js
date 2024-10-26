export default class PostModel {
  // Dummy sample data for posts
  static posts = [
    {
      userId: 1,
      caption: "A beautiful sunrise over the mountains",
      imageURL: "https://example.com/images/sunrise.jpg",
      id: 1,
      status: "published", // Status can be "published", "draft", or "archived"
      createdAt: new Date(), // Date when the post was created
    },
    {
      userId: 2,
      caption: "Delicious homemade pizza",
      imageURL: "https://example.com/images/pizza.jpg",
      id: 2,
      status: "published",
      createdAt: new Date(),
    },
    {
      userId: 3,
      caption: "Exploring the city streets",
      imageURL: "https://example.com/images/city.jpg",
      id: 3,
      status: "published",
      createdAt: new Date(),
    },
    {
      userId: 4,
      caption: "Relaxing at the beach",
      imageURL: "https://example.com/images/beach.jpg",
      id: 4,
      status: "published",
      createdAt: new Date(),
    },
  ];

  // Array to keep track of bookmarks
  static bookmarks = [];

  constructor(userId, caption, imageURL, id) {
    this.userId = userId; // User ID who created the post
    this.caption = caption; // Text caption of the post
    this.imageURL = imageURL; // URL of the image in the post
    this.id = id; // Unique ID for the post
    this.status = "published"; // Default status for new posts
    this.createdAt = new Date(); // Date when the post was created
  }

  // Create a new post
  static createPost(postData) {
    const id = this.posts.length + 1; // Generate a new ID
    const newPost = new PostModel(
      postData.userId,
      postData.caption,
      postData.imageURL,
      id
    );
    this.posts.push(newPost); // Add new post to the list
    return { success: true, post: newPost }; // Return success message with the new post
  }

  // Get posts with optional filtering, sorting, and pagination
  static getFilteredPosts(caption, status, sort, page, limit) {
    let filteredPosts = this.posts;

    // Filter posts by caption if provided
    if (caption) {
      filteredPosts = filteredPosts.filter((post) =>
        post.caption.toLowerCase().includes(caption.toLowerCase())
      );
    }

    // Filter posts by status if provided
    if (status) {
      filteredPosts = filteredPosts.filter((post) => post.status === status);
    }

    // Sort posts based on the specified criteria
    if (sort === "engagement") {
      filteredPosts = filteredPosts.sort(
        (a, b) => b.likes + b.comments.length - (a.likes + a.comments.length)
      );
    } else if (sort === "date") {
      filteredPosts = filteredPosts.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }

    // Implement pagination
    const start = (page - 1) * limit;
    const end = start + limit;
    return filteredPosts.slice(start, end); // Return the subset of posts for the current page
  }

  // Get a specific post by its ID
  static getPostById(id) {
    const post = this.posts.find((post) => post.id === parseInt(id));
    if (post) {
      return { success: true, post }; // Return post if found
    }
    return { success: false, message: "Post not found" }; // Return error message if not found
  }

  // Get all posts by a specific user
  static getPostsByUserId(userId) {
    const userPosts = this.posts.filter((post) => post.userId == userId);
    if (userPosts.length > 0) {
      return { success: true, posts: userPosts }; // Return posts if found
    }
    return { success: false, message: "No posts found for this user" }; // Return error message if no posts
  }

  // Delete a specific post by its ID
  static deletePost(postId) {
    const index = this.posts.findIndex((post) => post.id == postId);
    if (index !== -1) {
      this.posts.splice(index, 1); // Remove post from the list
      return { success: true, message: "Post successfully deleted" }; // Return success message
    }
    return { success: false, message: "Post not found" }; // Return error message if not found
  }

  // Update a specific post by its ID
  static updatePost(postId, updatedPostData) {
    const index = this.posts.findIndex((post) => post.id == postId);
    if (index !== -1) {
      // Update post details
      this.posts[index].caption =
        updatedPostData.caption || this.posts[index].caption;
      this.posts[index].imageURL =
        updatedPostData.imageURL || this.posts[index].imageURL;
      return { success: true, post: this.posts[index] }; // Return updated post
    }
    return { success: false, message: "Post not found" }; // Return error message if not found
  }

  // Update the status of a specific post (e.g., draft, archived)
  static updatePostStatus(postId, status) {
    const index = this.posts.findIndex((post) => post.id == postId);
    if (index !== -1) {
      this.posts[index].status = status; // Update post status
      return { success: true, message: `Post marked as ${status}` }; // Return success message
    }
    return { success: false, message: "Post not found" }; // Return error message if not found
  }

  // Toggle bookmark status for a specific post
  static toggleBookmark(postId, userId) {
    const index = this.bookmarks.findIndex(
      (bookmark) => bookmark.postId === postId && bookmark.userId === userId
    );
    if (index !== -1) {
      this.bookmarks.splice(index, 1); // Remove bookmark if it exists
      return {
        success: true,
        message: `Post ${postId} removed from bookmarked by user ${userId}`,
      };
    } else {
      this.bookmarks.push({ postId, userId }); // Add bookmark if it doesn't exist
      return {
        success: true,
        message: `Post ${postId} bookmarked by user ${userId}`,
      };
    }
  }
}
