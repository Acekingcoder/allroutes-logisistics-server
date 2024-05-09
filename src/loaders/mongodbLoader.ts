import config from "../config/index";
import mongoose from "mongoose";

interface LoaderOptions {}

const { mongoURI } = config;

export default async function databaseConnection({}: LoaderOptions) {
  try {
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}
