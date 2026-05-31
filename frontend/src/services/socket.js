import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "https://stock-trading-simulator-0tby.onrender.com" : "http://localhost:5000"));

export default socket;
