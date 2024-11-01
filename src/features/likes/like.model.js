// Sample data for likes
import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Default creation date for new likes
  },
});
const LikeModel = mongoose.model("Like", likeSchema);
export default LikeModel;
