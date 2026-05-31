import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./src/config/db.js";

import healthRoutes from "./src/routes/health/healthRoutes.js";
import authRoutes from "./src/routes/auth/authRoutes.js";
import testRoutes from "./src/routes/testRoutes.js";
import adminStockRoutes from "./src/routes/admin/stockRoutes.js";

import startMarketSimulation from "./src/services/marketSimulator.js";

import orderRoutes from "./src/routes/trader/orderRoutes.js";
import transactionRoutes from "./src/routes/trader/transactionRoutes.js";
import tradeRoutes from "./src/routes/trader/tradeRoutes.js";
import marketRoutes from "./src/routes/market/marketRoutes.js";

dotenv.config();

connectDB();

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api", healthRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/test", testRoutes);

app.use("/api/admin/stocks", adminStockRoutes);

app.use("/api/trader/orders", orderRoutes);
app.use("/api/trader/transactions", transactionRoutes);
app.use("/api/trader", tradeRoutes);
app.use("/api/trader", marketRoutes);

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

startMarketSimulation(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
