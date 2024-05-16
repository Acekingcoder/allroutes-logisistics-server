import mongoose, { Document, Schema } from "mongoose";

export interface TrackingDocument extends Document {
  trackingId: string;
  status: string;
  currentLocation: {
    latitude: number;
    longitude: number;
    address: string;
  };

  estimatedDelivery: Date;
  timeStamps: {
    createdAt: Date;
    updatedAt: Date;
  };

  history: {
    status: string;
    location: {
      latitude: number;
      longitude: number;
      address: string;
    };
    timeStamps: Date;
  }[];
}

const trackingSchema = new Schema<TrackingDocument>({
  trackingId: { type: String, required: true, unique: true },
  status: { type: String, required: true },
  currentLocation: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String, required: true },
  },

  estimatedDelivery: { type: Date, required: true },
  timeStamps: {
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },

  history: [
    {
      status: { type: String, required: true },
      location: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
        address: { type: String, required: true },
      },
      timeStamps: { type: Date, default: Date.now },
    },
  ],
});

trackingSchema.pre("save", function (next) {
  this.timeStamps.updatedAt = new Date();
  next();
});

const trackingModel = mongoose.model<TrackingDocument>(
  "Tracking",
  trackingSchema
);

export default trackingModel;
