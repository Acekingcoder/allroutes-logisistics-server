import { Schema, model, Document, Types } from "mongoose";
import { ORDER_STATUS } from "../utils/constants";

export interface IOrder extends Document {
    description?: string;
    pickupLocation: string;
    destination: string;
    deliveryCode: string;
    progressTracker: number;
    status: string;
    customer: Types.ObjectId;
    rider?: Types.ObjectId | string;
    amount: number;
    dispatchNo: string;
}

const orderSchema = new Schema<IOrder>(
    {
        description: {
            type: String,
        },

        pickupLocation: {
            type: String,
            required: true
        },
        destination: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: Object.values(ORDER_STATUS),
            default: ORDER_STATUS.onGoing,
        },
        progressTracker: {
            type: Number,
            default: 0,
            enum: [0, 1, 2, 3],
        },
        deliveryCode: {
            type: String,
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
        amount: {
            type: Number,
            required: true
        },
        dispatchNo: {
            type: String,
            required: true,
            unique: true,
        }
    },
    {
        timestamps: true,
    }
);

const Order = model<IOrder>("Order", orderSchema);
export default Order;
