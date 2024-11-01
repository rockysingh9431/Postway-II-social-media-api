import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  caption: {
    type: String,
    required: true,
  },
  imageURL: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["published", "draft", "archived"],
    default: "published", // Default status for new posts
  },
  createdAt: {
    type: Date,
    default: Date.now, // Default creation date for new posts
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Like",
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

const PostModel = mongoose.model("Post", postSchema);
export default PostModel;
