import mongoose, { Schema } from "mongoose";
import { itemStatus } from "../utils/constants";

const orderSchema = new Schema<orderDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    weight: {
      type: Number,
    },
    quantity: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    deliveryAddress: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      coordinates: {
        lat: {
          type: Number,
        },
        lng: {
          type: Number,
        },
      },
    },
    pickupAddress: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      coordinates: {
        lat: {
          type: Number,
        },
        lng: {
          type: Number,
        },
      },
    },
    pickupDate: {
      type: Date,
    },
    deliveryDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: Object.values(itemStatus),
      default: itemStatus.pending,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rider: {
      type: Schema.Types.ObjectId,
      ref: "Rider",
    },
    recipient: {
      name: {
        type: String,
        required: true,
      },
      phoneNumber: {
        type: String,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

const orderModel = mongoose.model<orderDocument>("Order", orderSchema);
export default orderModel;
