# Stock Trading Simulator

A full-stack web application that simulates a live stock market trading environment. Users can register, log in, view live market data, and execute trades in real-time.

## Tech Stack

The application is split into two main components:

- **Backend:** Node.js, Express, MongoDB, Redis, and Socket.io.
- **Frontend:** React, Vite, Redux Toolkit, TailwindCSS, and Socket.io-client.

## Project Structure

```
.
├── backend/            # Express.js API, WebSockets, and Market Simulation logic
├── frontend/           # React.js UI built with Vite
└── docker-compose.yml  # Deployment configuration for all services
```

## Prerequisites

To run this application, you will need to have installed:
- [Docker](https://www.docker.com/) and Docker Compose

*Alternatively, to run the services manually without Docker, you will need Node.js (v18+), MongoDB, and Redis installed locally.*

## Running with Docker (Recommended)

The easiest way to get the entire application running is by using Docker Compose. This will spin up the MongoDB database, Redis cache, the Node.js backend, and the React frontend simultaneously.

1. Clone the repository and navigate to the root directory.
2. Build and start the containers in detached mode:
   ```bash
   docker compose up --build -d
   ```
3. Once the containers are running, you can access the application at:
   - **Frontend UI:** [http://localhost:5173](http://localhost:5173)
   - **Backend API:** [http://localhost:5000](http://localhost:5000)

To stop the application, run:
```bash
docker compose down
```

## Local Development (Without Docker)

If you prefer to run the applications locally for active development, follow these steps:

### 1. Setup Infrastructure
Ensure you have a local MongoDB instance running on `localhost:27017` and a Redis instance running on `localhost:6379`.

### 2. Start the Backend
```bash
cd backend
npm install
npm run dev
```

### 3. Start the Frontend
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
The frontend will start on [http://localhost:5173](http://localhost:5173) and automatically proxy or connect to the backend API.

## Environment Variables

The project uses sensible defaults for development. If deploying to production, you should override these in your environment or Docker configurations:

**Backend:**
- `MONGO_URI`: Connection string for MongoDB.
- `REDIS_URI`: Connection string for Redis.
- `JWT_SECRET`: Secret key for JWT authentication.
- `FRONTEND_URL`: URL of the frontend application (for CORS).

**Frontend:**
- `VITE_API_URL`: The full URL to the backend API (e.g., `http://localhost:5000`).

---
*This repository was recently migrated fully to JavaScript (React + Express) and containerized for seamless deployment.*
