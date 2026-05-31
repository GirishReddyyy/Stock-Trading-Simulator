# Stock Trading Simulator

A full-stack web application that simulates a live stock market trading environment. Users can register, log in, view live market data, and execute trades in real-time.

## Tech Stack

The application is split into two main components:

- **Backend:** Node.js, Express, MongoDB, and Socket.io.
- **Frontend:** React, Vite, Redux Toolkit, TailwindCSS, and Socket.io-client.

## Project Structure

```
.
├── backend/            # Express.js API, WebSockets, and Market Simulation logic
└── frontend/           # React.js UI built with Vite
```

## Running Locally

You will need Node.js (v18+) and MongoDB installed locally.

### 1. Start the Backend
Navigate to the `backend` folder, install dependencies, and start the server:
```bash
cd backend
npm install
npm run dev
```

### 2. Start the Frontend
In a new terminal window, navigate to the `frontend` folder, install dependencies, and start the Vite development server:
```bash
cd frontend
npm install
npm run dev
```
The frontend will be available at [http://localhost:5173](http://localhost:5173).

## Environment Variables

When running locally, you can create a `.env` file in the `backend` and `frontend` folders respectively. For production deployments, these must be added to your hosting platform's dashboard.

**Backend (`backend/.env`):**
- `MONGO_URI`: Connection string for MongoDB (e.g., MongoDB Atlas).
- `JWT_SECRET`: Secret key for JWT authentication.
- `FRONTEND_URL`: URL of the deployed frontend application (required to allow CORS in production).

**Frontend (`frontend/.env`):**
- `VITE_API_URL`: The full URL to the backend API (e.g., `http://localhost:5000` locally, or `https://tradesim-backend.onrender.com` in production).

---

## Cloud Deployment (Render & Vercel)

This repository has been fully configured to deploy natively to the cloud. The frontend and backend URLs are already pre-wired into the codebase:
- **Backend (Render):** `https://stock-trading-simulator-0tby.onrender.com`
- **Frontend (Vercel):** `https://stock-trading-simulator-kappa.vercel.app`

### 1. Deploy the Backend to Render
Render natively supports Node.js Web Services.
1. Make sure you have pushed the latest code to GitHub.
2. Sign up for [Render](https://render.com/) and click **New +** > **Web Service**.
3. Connect this GitHub repository.
4. Configure the service:
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Under **Environment Variables**, you only need to add:
   - `MONGO_URI`: Your MongoDB Atlas connection string.
   - `JWT_SECRET`: A random string for secure logins.
   *(Note: You do NOT need to set the `FRONTEND_URL` variable, as the Vercel URL is already whitelisted in the code!)*
6. Click **Deploy**.

### 2. Deploy the Frontend to Vercel
Vercel handles React apps built with Vite out of the box.
1. Make sure you have pushed the latest code to GitHub.
2. Sign up for [Vercel](https://vercel.com/) and click **Add New Project**.
3. Connect your GitHub repository.
4. Expand **Build and Output Settings** and ensure:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
5. Click **Deploy**. 
*(Note: You do NOT need to set the `VITE_API_URL` variable, as the code automatically defaults to your Render backend URL when built for production!)*
