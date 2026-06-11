# Frontend - Stock Trading Simulator

This directory contains the React-based User Interface for the Stock Trading Simulator. It provides users with a premium, real-time trading experience designed around a "Private Banking / Wealth Management" aesthetic.

## 🛠 Tech Stack
- **Framework:** React 19, Vite
- **Styling:** Tailwind CSS (Custom `pb-*` palette for warm walnut and gold tones)
- **State & Data:** React Hooks, Axios (API client)
- **Real-Time Data:** Socket.io-client
- **Charting:** Chart.js & react-chartjs-2
- **Routing:** React Router v6
- **Notifications:** React Toastify

## ✨ Key Features
- **Premium UI:** A fully custom design system using warm earth tones, removing the need for a standard light/dark toggle.
- **Market Explorer:** Browse available stocks, view real-time price updates, and search external APIs for new stocks.
- **Live Watchlist:** Add and remove stocks to monitor their simulated real-time price fluctuations.
- **Advanced Trading:** Execute market orders or place Buy/Sell Limit Orders.
- **Portfolio & Analytics:** Track your holdings, view historical transaction logs, and visualize P/L with dynamic charts.
- **Auto-Sell Limits:** Set target limit prices on your portfolio holdings for automated selling.

## 📂 Folder Structure
```text
frontend/
├── public/                 # Static assets
└── src/
    ├── api/                # Axios interceptors and API service definitions (traderApi.js)
    ├── components/         # Reusable UI components
    │   ├── dashboard/      # Dashboard widgets (Pulse, Holdings Table, News)
    │   ├── layout/         # Navbar and structural elements
    │   ├── trading/        # Trade Forms, Limit Orders, and Modals
    │   └── ui/             # Loaders, Empty States
    ├── pages/              # Main route views (Home, Market, Portfolio, Analytics, etc.)
    ├── services/           # External service configurations (socket.js)
    ├── App.jsx             # Main application router
    └── index.css           # Global CSS and custom Tailwind theme variables
```

## ⚙️ Environment Variables
Create a `.env` file in the `frontend` directory:
```env
# Optional locally, defaults to http://localhost:5000
VITE_API_URL=http://localhost:5000
```

## 🚀 Running Locally
Make sure you have Node.js installed.
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open your browser and navigate to the URL provided by Vite (usually `http://localhost:5173`).
