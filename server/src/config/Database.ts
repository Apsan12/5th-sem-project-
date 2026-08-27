import mongoose from "mongoose";

export default async function connectMongoDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);

        console.log("MongoDB Connection Successful");
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
        throw error;
    }
}