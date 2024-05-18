import mongoose, { Schema } from "mongoose";

interface IGuarantor {
  contact1: {
    fullName: string;
    relationship:
      | "Father"
      | "Mother"
      | "Brother"
      | "Sister"
      | "Cousin"
      | "Friend";
    phoneNumber: string;
    address: string;
  };
  contact2: {
    fullName: string;
    relationship:
      | "Father"
      | "Mother"
      | "Brother"
      | "Sister"
      | "Cousin"
      | "Friend";
    phoneNumber: string;
    address: string;
  };
}

interface ILocation {
  latitude: number;
  longitude: number;
}

export interface IRider {
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  licenseNumber: string;
  englishFluency: "beginner" | "intermediate" | "advanced" | "native";
  guarantor: IGuarantor;
  vehicleType: "motorcycle" | "bicycle" | "car";
  vehicleRegistrationNumber: string;
  availability: "available" | "unavailable";
  shift: "morning" | "afternoon" | "evening";
  status: "active" | "inactive";
  rating: number;
  assignedOrders: string[]; // Assuming order IDs are used for tracking
  location: ILocation;
}

const riderSchema = new Schema(
  {
    fullName: {
      type: String,
      require: [true, "Please input your full name"],
    },
    email: {
      type: String,
      require: [true, "Please input your email address"],
    },
    phoneNumber: {
      type: String,
      require: [true, "Please input your phone number"],
    },
    address: {
      type: String,
      require: [true, "Please input your address"],
    },
    licenseNumber: {
      type: String,
      require: [true, "Please input your license number"],
    },
    englishFluency: {
      type: String,
      require: [true, "Please select your English level"],
    },
    guarantor: {
      contact1: {
        fullName: {
          type: String,
          required: [true, "Please input full name"],
        },
        relationship: {
          type: String,
          required: [true, "Please select relationship status"],
        },
        phoneNumber: {
          type: String,
          required: [true, "Please input a valid phone number"],
        },
        address: {
          type: String,
          required: [true, "Please input address"],
        },
      },
      contact2: {
        fullName: {
          type: String,
          required: [true, "Please input full name"],
        },
        relationship: {
          type: String,
          required: [true, "Please select relationship status"],
        },
        phoneNumber: {
          type: String,
          required: [true, "Please input a valid phone number"],
        },
        address: {
          type: String,
          required: [true, "Please input address"],
        },
      },
    },
    vehicleType: {
      type: String,
      require: [false],
    },
    vehicleRegistrationNumber: {
      type: String,
      require: [false],
    },
    availability: {
      type: String,
      require: [false],
    },
    shift: {
      type: String,
      require: [false],
    },
    status: {
      type: String,
      require: [false],
    },
    rating: {
      type: String,
      require: [false],
    },
    assignedOrders: {
      type: Array,
      require: [false],
    },
    location: {
      latitude: {
        type: Number,
        required: [false],
      },
      longitude: {
        type: Number,
        required: [false],
      },
    },
  },
  {
    timestamps: true,
  }
);

const riderModel = mongoose.model<IRider>("Rider", riderSchema);

export default riderModel;
