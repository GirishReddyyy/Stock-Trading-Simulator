# Backend - Stock Trading Simulator

This directory contains the Node.js backend for the Stock Trading Simulator. It serves as the core engine for user authentication, trade execution, portfolio management, and real-time market simulation.

## 🛠 Tech Stack
- **Runtime Environment:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB via Mongoose ORM
- **WebSockets:** Socket.io (for live price updates)
- **Security & Auth:** JSON Web Tokens (JWT), bcryptjs, CORS
- **External APIs:** Integration with Yahoo Finance / external sources for stock seeding.

## ✨ Key Features
- **User Authentication:** Secure registration and login using JWT and encrypted passwords.
- **Live Market Simulation:** A background WebSocket service that artificially fluctuates market prices every few seconds to simulate a live trading environment.
- **Order Execution Engine:** Processes market orders instantly and continuously checks pending Limit Orders against live market prices.
- **Portfolio Management:** Tracks user holdings, calculates average buy prices, and logs all historical transactions.
- **RESTful API:** Clean, modularized API routes for frontend consumption.

## 📂 Folder Structure
```text
backend/
├── src/
│   ├── config/             # Database connection setup
│   ├── controllers/        # Route logic and business rules
│   ├── middleware/         # Auth protection and error handling
│   ├── models/             # Mongoose schemas (User, Stock, Portfolio, Order, Transaction)
│   ├── routes/             # Express API route definitions
│   ├── scripts/            # Background tasks (e.g., checking limit orders)
│   ├── services/           # Complex external logic (API fetching)
│   ├── sockets/            # Socket.io event handlers and market simulator
│   └── utils/              # Helper functions
├── .env                    # Environment variables (not tracked)
└── server.js               # Application entry point
```

## ⚙️ Environment Variables
Create a `.env` file in the `backend` directory with the following variables:
```env
# MongoDB Connection String (Required)
MONGO_URI=mongodb://localhost:27017/stock_simulator

# JWT Secret for Auth Tokens (Required)
JWT_SECRET=your_super_secret_jwt_key

# Optional: Port to run the server on (Defaults to 5000)
PORT=5000

# Optional: Frontend URL for CORS (Defaults to http://localhost:5173)
FRONTEND_URL=http://localhost:5173
```

## 🚀 Running Locally
Make sure you have Node.js and a local MongoDB instance running.
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server (uses `nodemon` for hot-reloading):
   ```bash
   npm run dev
   ```
3. The API will be available at `http://localhost:5000` (or your configured `PORT`).
