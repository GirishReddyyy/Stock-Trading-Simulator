import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Navbar from "../components/layout/Navbar.jsx";
import Loader from "../components/ui/Loader.jsx";
import MarketGrid from "../components/dashboard/MarketGrid.jsx";
import StockModal from "../components/trading/StockModal.jsx";

import { getMarketStocks, getExternalStock, getOrders } from "../api/traderApi.js";

const Market = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStock, setSelectedStock] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    loadStocks().finally(() => setLoading(false));
  }, []);

  const loadStocks = async () => {
    try {
      const res = await getMarketStocks();
      setStocks(res.data.stocks || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load market");
    }
  };

  // Dummy function for MarketGrid props since we moved it from Home
  const loadDashboard = async () => {
    // Only used to refresh balances after trading, could be refined later
  };
  
  const loadOrders = async () => {
    // Only used to refresh order limits
  };

  const handleApiSearch = async () => {
    if (!search) return;
    setIsSearching(true);
    try {
      await getExternalStock(search);
      toast.success("Stock loaded from API!");
      loadStocks();
      setSearch("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch from API");
    } finally {
      setIsSearching(false);
    }
  };

  const filteredStocks = stocks.filter(
    (stock) =>
      stock.symbol?.toLowerCase().includes(search.toLowerCase()) ||
      stock.companyName?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100">
        <Navbar />
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 relative">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">
              Market Explorer
            </h1>
            <p className="text-slate-500 mt-2 text-lg">
              Discover, search, and trade available stocks
            </p>
          </div>

          <div className="relative w-full md:w-[28rem] flex gap-2">
            <input
              type="text"
              placeholder="Search by symbol or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleApiSearch()}
              className="w-full bg-white border border-slate-300 rounded-xl px-5 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
            <button
              onClick={handleApiSearch}
              disabled={isSearching || !search}
              className="bg-primary text-white px-6 py-3 rounded-xl font-semibold shadow hover:bg-blue-600 disabled:opacity-50 transition-all whitespace-nowrap"
            >
              {isSearching ? "Loading..." : "Fetch API"}
            </button>
          </div>
        </div>

        <MarketGrid
          filteredStocks={filteredStocks}
          setSelectedStock={setSelectedStock}
          loadDashboard={loadDashboard}
          loadOrders={loadOrders}
        />

        <StockModal stock={selectedStock} onClose={() => setSelectedStock(null)} />
      </main>
    </div>
  );
};

export default Market;
