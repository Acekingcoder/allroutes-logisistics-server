import mongoose, { Document, Schema } from "mongoose";

export interface TxDocument extends Document {
  ref: string;
  userId: string;
  date: Number;
  amount:Number;
  status: string;
}

const txSchema = new Schema<TxDocument>({
  ref: { type: String, required: true },
  userId: { type: String, required: true, unique: true },
  date: { type: Number, required: true },
  amount: { type: Number, required: true },
  status: { type: String, required: true, default : 'pending' },
}, {
    timestamps: true
});

const Tx = mongoose.model<TxDocument>("Tx", txSchema);

export default Tx;
