import mongoose, { Schema, model, Document, Types } from "mongoose";

const transactionSchema = new Schema<TransactionDocument>(
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
            required: true,
        },
    },
    { timestamps: true }
);

export default model<TransactionDocument>("Transaction", transactionSchema);