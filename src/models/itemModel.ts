import mongoose, { Schema, Document, Types } from "mongoose";

export interface ItemDocument extends Document {
  name: string;
  description: string;
  weight: number;
  quantity: number;
  category: string;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  pickupAddress: {
    street: string;
    city: string;
    state: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  pickupDate: Date;
  deliveryDate: Date;
  createdAt: Date;
  updatedAt: Date;
  status: "pending" | "in-transit" | "delivered" | "cancelled";
  customer: Types.ObjectId;
  rider?: Types.ObjectId;
  recipient: {
    name: string;
    phoneNumber: string;
  };
}

const itemSchema = new Schema<ItemDocument>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    weight: { type: Number, required: true },
    quantity: { type: Number, required: true },
    category: { type: String, required: true },
    deliveryAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
      },
    },
    pickupAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
      },
    },
    pickupDate: { type: Date, required: true },
    deliveryDate: { type: Date, required: true },
    status: { type: String, enum: ["pending", "in-transit", "delivered", "cancelled"], default: "pending" },
    customer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rider: { type: Schema.Types.ObjectId, ref: "Rider" },
    recipient: {
      name: { type: String, required: true },
      phoneNumber: { type: String, required: true },
    },
  },
  {
    timestamps: true,
  }
);

const itemModel = mongoose.model<ItemDocument>("Item", itemSchema);
