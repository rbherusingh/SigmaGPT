import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";

const app = express();
const PORT = 8080;

const allowedOrigins = [
    "https://sigma-gpt-puce.vercel.app",
    "http://localhost:5173"
];

app.use(express.json());
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api", chatRoutes);

app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
    connectDB();
});

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("connected with database!");
    } catch (err) {
        console.log("faild to connect with Db", err);
    }
};