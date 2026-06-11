import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import socket from "../services/socket.js";

import Loader from "../components/ui/Loader.jsx";
import Navbar from "../components/layout/Navbar.jsx";
import MiniWatchlist from "../components/dashboard/MiniWatchlist.jsx";
import MarketNews from "../components/dashboard/MarketNews.jsx";

// New Components
import PerformanceHeader from "../components/dashboard/PerformanceHeader.jsx";
import MarketPulse from "../components/dashboard/MarketPulse.jsx";
import HoldingsTable from "../components/dashboard/HoldingsTable.jsx";

import { getDashboard, getMarketStocks, getPortfolio } from "../api/traderApi.js";

const Home = () => {
  const [dashboard, setDashboard] = useState(null);
  const [stocks, setStocks] = useState([]);
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([loadDashboard(), loadStocks(), loadPortfolio()]).finally(() =>
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
      
      // Update portfolio live prices
      setPortfolio((prev) => {
        if (!prev || !prev.holdings) return prev;
        const newHoldings = prev.holdings.map((h) => {
          if (h.stock._id === updatedStock.stockId) {
            return { ...h, stock: { ...h.stock, currentPrice: updatedStock.currentPrice } };
          }
          return h;
        });
        return { ...prev, holdings: newHoldings };
      });
    };

    const handleOrderExecuted = (data) => {
      toast.success(`${data.type} ${data.stock} executed @ ₹${data.price}`);
      loadDashboard();
      loadPortfolio();
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

  const loadPortfolio = async () => {
    try {
      const res = await getPortfolio();
      setPortfolio(res.data.portfolio);
    } catch (error) {
      toast.error(error.response?.data?.message || "Portfolio load failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-pb-bg font-['Inter']">
        <Navbar />
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pb-bg font-['Inter'] text-pb-text pb-12">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Top Section */}
        <section>
          <PerformanceHeader dashboard={dashboard} />
        </section>

        {/* Middle Section */}
        <section>
          <MarketPulse stocks={stocks} recentTransactions={dashboard?.recentTransactions} />
        </section>

        {/* Main Section */}
        <section>
          <HoldingsTable holdings={portfolio?.holdings || []} />
        </section>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6">
          <section className="lg:col-span-1">
            <MiniWatchlist stocks={stocks} />
          </section>
          <section className="lg:col-span-2">
            <h2 className="text-xl font-bold text-pb-text mb-4 px-1">Relevant News</h2>
            <MarketNews />
          </section>
        </div>

      </main>
    </div>
  );
};

export default Home;