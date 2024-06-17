declare namespace Express {
    export interface Request {
        user: IUserPayload;
    }
}

interface IUserPayload {
    id: string;
    role: string;
}

interface IOrder extends Document {
    description: string;
    weight: number;
    specialInstruction: string;
    deliveryAddress: {
        street: string;
        city: string;
        state: string;
        coordinates: {
            lat: number;
            lng: number;
        };
    };
    pickupAddress: {
        street: string;
        city: string;
        state: string;
        coordinates: {
            lat: number;
            lng: number;
        };
    };
    pickupDate: Date;
    deliveryDate?: Date;
    createdAt: Date;
    updatedAt: Date;
    status: string;
    customer: Types.ObjectId;
    rider?: Types.ObjectId;
    recipient: {
        name: string;
        phoneNumber: string;
    };
}

interface ITransaction extends Document {
    amount: number;
    transactionType: string;
    status: string;
    ref: string;
    user: Types.ObjectId;
    reference: string;
}


