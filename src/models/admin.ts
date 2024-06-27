import {model, Schema, Document} from 'mongoose';

export interface IAdmin extends Document {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    role: 'admin';
}

const adminSchema = new Schema<IAdmin>({
    firstName: {type: String},
    lastName: {type: String},
    email: {type: String, required: true, unique: true},
    phoneNumber: {type: String},
    password: {type: String, required: true},
    role: {type: String, default: 'admin'},
});

export default model<IAdmin>('Admin', adminSchema);