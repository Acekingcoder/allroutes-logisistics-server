import mongoose, { Document, Schema } from "mongoose";

export interface UserDocument extends Document {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  code?: string;
  role: string;
}

const userSchema = new Schema<UserDocument>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "customer" }
});

const User = mongoose.model<UserDocument>("User", userSchema);

export default User;
