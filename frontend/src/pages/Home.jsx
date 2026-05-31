import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import socket from "../services/socket.js";

import Loader from "../components/ui/Loader.jsx";
import Navbar from "../components/layout/Navbar.jsx";
import ThemeToggle from "../components/layout/ThemeToggle.jsx";
import NotificationCenter from "../components/dashboard/NotificationCenter.jsx";
import Leaderboard from "../components/dashboard/Leaderboard.jsx";
import Watchlist from "../components/trading/Watchlist.jsx";
import MarketNews from "../components/dashboard/MarketNews.jsx";
import OrderBook from "../components/trading/OrderBook.jsx";

// Extracted Components
import DashboardStats from "../components/dashboard/DashboardStats.jsx";
import OrderList from "../components/dashboard/OrderList.jsx";
import { getDashboard, getMarketStocks, getOrders, cancelOrder } from "../api/traderApi.js";

const Home = () => {
  const [dashboard, setDashboard] = useState(null);
  const [stocks, setStocks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([loadDashboard(), loadStocks(), loadOrders()]).finally(() =>
      setLoading(false)
    );

    const handlePriceUpdate = (updatedStock) => {
      setStocks((prev) =>
        prev.map((stock) =>
          stock._id === updatedStock.stockId
            ? { ...stock, currentPrice: updatedStock.currentPrice }
            : stock
        )
      );
    };

    const handleOrderExecuted = (data) => {
      toast.success(`${data.type} ${data.stock} executed @ ₹${data.price}`);
      loadDashboard();
      loadOrders();
    };

    socket.on("priceUpdate", handlePriceUpdate);
    socket.on("orderExecuted", handleOrderExecuted);

    return () => {
      socket.off("priceUpdate", handlePriceUpdate);
      socket.off("orderExecuted", handleOrderExecuted);
    };
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await getDashboard();
      setDashboard(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Dashboard load failed");
    }
  };

  const loadStocks = async () => {
    try {
      const res = await getMarketStocks();
      setStocks(res.data.stocks || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Market load failed");
    }
  };

  const loadOrders = async () => {
    try {
      const res = await getOrders();
      setOrders(res.data.orders || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Orders load failed");
    }
  };

  const handleCancel = async (id) => {
    try {
      await cancelOrder(id);
      toast.info("Order cancelled");
      loadOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Cancel failed");
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Dynamic Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9InJnYmEoMTcwLCA1OSLCAyNTUsIDAuMDUpIi8+PC9zdmc+')] opacity-50 z-0 pointer-events-none"></div>
      
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
              Dashboard Overview
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
              Manage your portfolio and execute trades
            </p>
          </div>
          <ThemeToggle />
        </div>

        <NotificationCenter />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 space-y-8">
            <DashboardStats dashboard={dashboard} />
            <Watchlist stocks={stocks} />
          </div>
          <div className="space-y-8">
            <Leaderboard />
            <MarketNews />
          </div>
        </div>

        <div className="my-12 border-t border-slate-200 dark:border-slate-800"></div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6">Your Orders</h2>
            <OrderList orders={orders} handleCancel={handleCancel} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6">Market Order Book</h2>
            <OrderBook />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;