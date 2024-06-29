import mongoose, { Schema, Document, Types } from "mongoose";

interface IContact {
    fullName: string;
    relationship: "Father" | "Mother" | "Brother" | "Sister" | "Cousin" | "Friend";
    phoneNumber: string;
    address: string;
}

interface IGuarantor {
    contact1: IContact;
    contact2: IContact;
}

interface ILocation {
    latitude: number;
    longitude: number;
}

export interface IRider extends Document {
    firstName: string;
    lastName: string;
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
    assignedOrders: Types.ObjectId[]; // Assuming order IDs are used for tracking
    location: ILocation;
    role: "rider";
    password: string;
}

const riderSchema = new Schema<IRider>({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    phoneNumber: { type: String, required: true, unique: true, trim: true },
    address: { type: String, trim: true },
    licenseNumber: { type: String, trim: true },
    englishFluency: { type: String, enum: ["beginner", "intermediate", "advanced", "native"] },
    guarantor: {
        contact1: {
            fullName: { type: String, trim: true },
            relationship: { type: String, enum: ["Father", "Mother", "Brother", "Sister", "Cousin", "Friend"] },
            phoneNumber: { type: String, trim: true },
            address: { type: String, trim: true },
        },
        contact2: {
            fullName: { type: String, trim: true },
            relationship: { type: String, enum: ["Father", "Mother", "Brother", "Sister", "Cousin", "Friend"] },
            phoneNumber: { type: String, trim: true },
            address: { type: String, trim: true },
        },
    },
    vehicleType: { type: String, enum: ["motorcycle", "bicycle", "car"] },
    vehicleRegistrationNumber: { type: String, trim: true },
    availability: { type: String, enum: ["available", "unavailable"] },
    shift: { type: String, enum: ["morning", "afternoon", "evening"] },
    status: { type: String, enum: ["active", "inactive"] },
    rating: { type: Number, default: 0, enum: [0, 1, 2, 3, 4, 5]},
    assignedOrders: { type: [Schema.Types.ObjectId], default: [], ref: "Order" },
    location: { latitude: { type: Number }, longitude: { type: Number } },
    role: { type: String, default: "rider"},
    password: {type: String, required: true}
}, { timestamps: true });
export default mongoose.model<IRider>("Rider", riderSchema);


// const riderSchema = new Schema(
//     {
//         fullName: {
//             type: String,
//             require: [true, "Please input your full name"],
//         },
//         email: {
//             type: String,
//             require: [true, "Please input your email address"],
//         },
//         phoneNumber: {
//             type: String,
//             require: [true, "Please input your phone number"],
//         },
//         address: {
//             type: String,
//             require: [true, "Please input your address"],
//         },
//         licenseNumber: {
//             type: String,
//             require: [true, "Please input your license number"],
//         },
//         englishFluency: {
//             type: String,
//             require: [true, "Please select your English level"],
//         },
//         guarantor: {
//             contact1: {
//                 c1_fullName: {
//                     type: String,
//                     required: [true, "Please input full name"],
//                 },
//                 c1_relationship: {
//                     type: String,
//                     required: [true, "Please select relationship status"],
//                 },
//                 c1_phoneNumber: {
//                     type: String,
//                     required: [true, "Please input a valid phone number"],
//                 },
//                 c1_address: {
//                     type: String,
//                     required: [true, "Please input address"],
//                 },
//             },
//             contact2: {
//                 c2_fullName: {
//                     type: String,
//                     required: [true, "Please input full name"],
//                 },
//                 c2_relationship: {
//                     type: String,
//                     required: [true, "Please select relationship status"],
//                 },
//                 c2_phoneNumber: {
//                     type: String,
//                     required: [true, "Please input a valid phone number"],
//                 },
//                 c2_address: {
//                     type: String,
//                     required: [true, "Please input address"],
//                 },
//             },
//         },
//         vehicleType: {
//             type: String,
//             require: [false],
//         },
//         vehicleRegistrationNumber: {
//             type: String,
//             require: [false],
//         },
//         availability: {
//             type: String,
//             require: [false],
//         },
//         shift: {
//             type: String,
//             require: [false],
//         },
//         status: {
//             type: String,
//             require: [false],
//         },
//         rating: {
//             type: String,
//             require: [false],
//         },
//         assignedOrders: {
//             type: Array,
//             require: [false],
//         },
//         location: {
//             latitude: {
//                 type: Number,
//                 required: [false],
//             },
//             longitude: {
//                 type: Number,
//                 required: [false],
//             },
//         },
//         role: {
//             type: String,
//             default: "rider",
//         }
//     },
//     {
//         timestamps: true,
//     }
// );
