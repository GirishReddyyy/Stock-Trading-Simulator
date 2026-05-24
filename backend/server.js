import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./src/config/db.js";

import healthRoutes from "./src/routes/health/healthRoutes.js";
import authRoutes from "./src/routes/auth/authRoutes.js";
import testRoutes from "./src/routes/testRoutes.js";
import adminStockRoutes from "./src/routes/admin/stockRoutes.js";

dotenv.config();

connectDB();

const app = express();

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true
    })
);

app.use(express.json());

app.use("/api", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/admin", adminStockRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});