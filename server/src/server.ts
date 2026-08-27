import "./config/Dotenv.js";

import express from "express";
import connectMongoDB from "./config/Database.js";
import userRouter from "./routes/UserRoutes.js";
import bodyParser from "body-parser";
import cors from "cors";
import orderRouter from "./routes/OrderRoutes.js";
import productRouter from "./routes/ProductRoutes.js";
import { User } from "./models/User.js";
import paymentRouter from "./routes/PaymentRoutes.js";

const app = express();

// Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// CORS
const allowedOrigins = [
    "http://localhost:3000",
    "https://project-git-main-apsans-projects-d6a4facb.vercel.app/",
];

app.use(
    cors({
        origin: allowedOrigins,
        allowedHeaders: ["Content-Type", "Authorization"],
        methods: ["GET", "POST", "PUT", "DELETE"],
    }),
);

// Static files
app.use(express.static("public"));

// Routes
app.use(userRouter);
app.use(productRouter);
app.use(orderRouter);
app.use(paymentRouter);

// Start Server
async function startServer() {
    try {
        // Connect to MongoDB first
        await connectMongoDB();

        // Check if admin user exists
        const user = await User.findOne({
            email: "admin@shop.com",
        });

        // Create admin user if it doesn't exist
        if (!user) {
            const admin = {
                fullName: "Admin",
                email: "admin@shop.com",
                password: "Admin@123",
                phone: "0123456789",
            };

            await User.create(admin);

            console.log("Created Admin User");
        }

        console.log(
            "\nAdmin Credentials:\nEmail: admin@shop.com\nPassword: Admin@123\n",
        );

       
        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        });
    } catch (error) {
        console.error("Server startup error:", error);
        process.exit(1);
    }
}

startServer();