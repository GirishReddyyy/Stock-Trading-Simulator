import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";

import connectDB from "./src/config/db.js";

import healthRoutes from "./src/routes/health/healthRoutes.js";
import authRoutes from "./src/routes/auth/authRoutes.js";
import testRoutes from "./src/routes/testRoutes.js";
import adminStockRoutes from "./src/routes/admin/stockRoutes.js";
import marketRoutes from "./src/routes/market/marketRoutes.js";
import tradeRoutes from "./src/routes/trader/tradeRoutes.js";
import { startMarketSimulation } from "./src/services/marketSimulationService.js";
import {initSocket} from "./src/sockets/socketServer.js";

dotenv.config();

connectDB();

const app = express();
const server =
    http.createServer(app);

initSocket(server);
startMarketSimulation();

app.use(
    cors({
        origin:
            "http://localhost:5173",
        credentials: true
    })
);

app.use(express.json());

app.use("/api", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/admin", adminStockRoutes);
app.use("/api/market", marketRoutes);
app.use("/api/trader", tradeRoutes);

const PORT =
    process.env.PORT || 5000;

server.listen(
    PORT,
    () => {
        console.log(
            `Server running on port ${PORT}`
        );
    }
);