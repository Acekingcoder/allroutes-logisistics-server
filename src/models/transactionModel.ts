import mongoose, { Schema, model } from "mongoose";

const transactionSchema = new Schema<transactionDocument>(
    {
        amount: {
            type: Number,
            required: true,
        },
        transactionType: {
            type: String,
            required: true,
            enum: ['credit', 'debit'],
        },
        status: {
            type: String,
            default: "pending",
            enum: ['pending', 'completed', 'failed']
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            // required: true,
        },
        reference: {
            type: String,
            unique: true
        }
    },
    { timestamps: true }
);

export default model<transactionDocument>("Transaction", transactionSchema);