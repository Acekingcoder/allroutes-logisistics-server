import { Schema, model, Types, Document } from "mongoose";
import { TRX_SERVICE, TRX_TYPE, PAYMENT_STATUS } from "../utils/constants";

export interface ITransaction extends Document {
    user: Types.ObjectId;
    amount: number;
    type: string;
    service: string;
    ref: string;
    reference: string;
}

const transactionSchema = new Schema<ITransaction>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        type: {
            type: String,
            enum: Object.values(TRX_TYPE),
            required: true,
        },
        service: {
            type: String,
            enum: Object.values(TRX_SERVICE),
            required: true,
        },
        reference: {
            type: String,
            unique: true,
            required: true,
        }
    },
    { timestamps: true }
);

export default model<ITransaction>("Transaction", transactionSchema);