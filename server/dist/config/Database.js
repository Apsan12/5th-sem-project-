import mongoose from "mongoose";
export default async function connectMongoDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB Connection Successful");
    }
    catch (error) {
        console.error("MongoDB Connection Error:", error);
        throw error;
    }
}
//# sourceMappingURL=Database.js.map