import config from "../config/index";
import mongoose from "mongoose";

interface LoaderOptions {}

export default async function ({}: LoaderOptions) {
  try {
    await mongoose.connect(config.mongoURI);
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}
