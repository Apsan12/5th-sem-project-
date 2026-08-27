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
import path from "path";
import { fileURLToPath } from "url";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const allowedOrigins = [
    "http://localhost:3000",
    "https://5th-sem-project-git-main-apsans-projects-d6a4facb.vercel.app",
];

app.use(
    cors({
        origin: allowedOrigins,
        allowedHeaders: ["Content-Type", "Authorization"],
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: true,
    }),
);

app.use(express.static(path.join(__dirname, "../public")));

app.use(userRouter);
app.use(productRouter);
app.use(orderRouter);
app.use(paymentRouter);

async function startServer() {
    try {
        await connectMongoDB();

        const user = await User.findOne({
            email: "admin@shop.com",
        });

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