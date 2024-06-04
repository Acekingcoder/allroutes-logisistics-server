
import { Document, Schema, Types, model } from "mongoose";

export interface WalletDocument extends Document {
    customerId: Types.ObjectId;
    balance: number;
    transactions: {
        type: string;
        amount: number;
        date: Date;
    }[];
}

const walletSchema = new Schema<WalletDocument>({
    customerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    balance: { type: Number, default: 0.00 },
    transactions: [
        {
            type: { type: String, enum: ["debit", "credit"], required: true },
            amount: { type: Number, required: true },
            date: { type: Date, default: Date.now }
        }
    ]
}, {
    timestamps: true
});

export default model<WalletDocument>("Wallet", walletSchema);