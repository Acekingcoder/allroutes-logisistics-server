import mongoose from "mongoose";

export default async function connectDB() {
    let databaseUrl = process.env.DEV_MONGO_URI as string;
    if (process.env.NODE_ENV === "prod") {
        databaseUrl = process.env.PROD_MONGO_URI as string;
    }
    try {
        await mongoose.connect(databaseUrl);
        console.log(`Connected to ${process.env.NODE_ENV} database successfully`,);
    } catch (error) {
        console.error(error);
    }
}
