import mongoose, { Schema, Document } from "mongoose";

interface IGuarantor {
    contact1: {
        c1_fullName: string;
        c1_relationship:
        | "Father"
        | "Mother"
        | "Brother"
        | "Sister"
        | "Cousin"
        | "Friend";
        c1_phoneNumber: string;
        c1_address: string;
    };
    contact2: {
        c2_fullName: string;
        c2_relationship:
        | "Father"
        | "Mother"
        | "Brother"
        | "Sister"
        | "Cousin"
        | "Friend";
        c2_phoneNumber: string;
        c2_address: string;
    };
}

interface ILocation {
    latitude: number;
    longitude: number;
}

export interface IRider extends Document {
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
    role: "rider";
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
                c1_fullName: {
                    type: String,
                    required: [true, "Please input full name"],
                },
                c1_relationship: {
                    type: String,
                    required: [true, "Please select relationship status"],
                },
                c1_phoneNumber: {
                    type: String,
                    required: [true, "Please input a valid phone number"],
                },
                c1_address: {
                    type: String,
                    required: [true, "Please input address"],
                },
            },
            contact2: {
                c2_fullName: {
                    type: String,
                    required: [true, "Please input full name"],
                },
                c2_relationship: {
                    type: String,
                    required: [true, "Please select relationship status"],
                },
                c2_phoneNumber: {
                    type: String,
                    required: [true, "Please input a valid phone number"],
                },
                c2_address: {
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
        role: {
            type: String,
            default: "rider",
        }
    },
    {
        timestamps: true,
    }
);

const riderModel = mongoose.model<IRider>("Rider", riderSchema);

export default riderModel;
