import { model, Schema, Document, Types } from 'mongoose';

export interface INotification extends Document {
    message: string;
    user: Types.ObjectId;
    read: boolean;
}

const notificationSchema = new Schema<INotification>({
    message: { type: String, required: true },
    user: {type: Schema.Types.ObjectId, required: true},
    read: {type: Boolean, default: false},
}, { timestamps: true });

export default model<INotification>('Notification', notificationSchema);