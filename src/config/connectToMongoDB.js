import mongoose from "mongoose";

export const connectToMongoDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/goChat");
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.log("Error connecting to MongoDB");
    console.log("error: " + error);
  }
};
