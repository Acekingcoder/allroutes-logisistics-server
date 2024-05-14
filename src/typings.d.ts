declare namespace Express {
  export interface Request {
    user?: any;
  }
}

interface ItemDocument extends Document {
  name: string;
  description: string;
  weight: number;
  quantity: number;
  category: string;
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
  deliveryDate: Date;
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
