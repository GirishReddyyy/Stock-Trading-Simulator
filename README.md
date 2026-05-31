# 📈 Stock Trading Simulator

[![Frontend Setup](https://img.shields.io/badge/Frontend-React%20%7C%20Vite-blue?logo=react&logoColor=white)](https://stock-trading-simulator-kappa.vercel.app)
[![Backend Setup](https://img.shields.io/badge/Backend-Express%20%7C%20Node.js-green?logo=nodedotjs&logoColor=white)](https://stock-trading-simulator-0tby.onrender.com)
[![Database](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)]()

A full-stack, real-time web application that simulates a live stock market environment. Users can securely register, view live market data streams, and execute trades instantly. 

### 🚀 Live Demos
- **Live Platform:** [https://stock-trading-simulator-kappa.vercel.app](https://stock-trading-simulator-kappa.vercel.app)
- **API Endpoint:** [https://stock-trading-simulator-0tby.onrender.com](https://stock-trading-simulator-0tby.onrender.com)

---

## 🛠 Tech Stack

### Frontend
- **Framework:** React 19 (via Vite)
- **State Management:** Redux Toolkit
- **Styling:** TailwindCSS
- **WebSockets:** Socket.io-client
- **Charting:** Chart.js & react-chartjs-2

### Backend
- **Framework:** Node.js & Express.js
- **Database:** MongoDB (Mongoose)
- **WebSockets:** Socket.io (Real-time Market Data Simulation)
- **Security:** JWT Authentication, bcryptjs, CORS

---

## 📂 Project Structure

```text
.
├── backend/            # Express.js API, JWT Auth, and Market Simulation Service
└── frontend/           # React.js SPA, Redux Store, and UI Components
```

---

## 💻 Local Development Setup

To run this application locally, you will need **Node.js (v18+)** and a local instance of **MongoDB** running.

### 1. Start the Backend API
Open a terminal and navigate to the backend directory:
```bash
cd backend
npm install
npm run dev
```
*The backend will start at `http://localhost:5000`.*

### 2. Start the Frontend UI
Open a second terminal and navigate to the frontend directory:
```bash
cd frontend
npm install
npm run dev
```
*The frontend will start at `http://localhost:5173` and automatically connect to the local backend.*

### Environment Variables (.env)
When running locally, create `.env` files in both directories. 

**`backend/.env`**
```env
MONGO_URI=mongodb://localhost:27017/stock_simulator
JWT_SECRET=your_super_secret_jwt_key
# FRONTEND_URL is optional locally, defaults to http://localhost:5173
```
**`frontend/.env`**
```env
# Optional locally, defaults to http://localhost:5000
VITE_API_URL=http://localhost:5000
```

---

## ☁️ Cloud Deployment (Render & Vercel)

This repository is optimized for cloud deployment with zero configuration required for CORS or API URLs—they are pre-wired for the live domains!

### Deploying the Backend (Render)
1. Commit and push your code to GitHub.
2. Go to [Render](https://render.com/) -> **New +** -> **Web Service**.
3. Connect your repository and configure:
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add your **Environment Variables**:
   - `MONGO_URI`: Your MongoDB Atlas connection string.
   - `JWT_SECRET`: A secure random string for tokens.
5. Click **Deploy**.

### Deploying the Frontend (Vercel)
1. Go to [Vercel](https://vercel.com/) -> **Add New Project**.
2. Connect your repository.
3. Vercel will automatically detect the Vite framework. 
4. Ensure the **Root Directory** is set to `frontend`.
5. Click **Deploy**. *(React routing is automatically handled by the included `vercel.json` file).*
