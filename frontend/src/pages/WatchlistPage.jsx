import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Navbar from "../components/layout/Navbar.jsx";
import Loader from "../components/ui/Loader.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import { getMarketStocks } from "../api/traderApi.js";

const WatchlistPage = () => {
  const navigate = useNavigate();
  const [stocks, setStocks] = useState([]);
  const [watchlist, setWatchlist] = useState(() => JSON.parse(localStorage.getItem("watchlist")) || []);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadStocks = async () => {
    try {
      const res = await getMarketStocks();
      setStocks(res.data.stocks || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load market");
    }
  };

  useEffect(() => {
    loadStocks().finally(() => setLoading(false));
  }, []);



  const addToWatchlist = (stock) => {
    const exists = watchlist.find((item) => item._id === stock._id);
    if (!exists) {
      const updated = [...watchlist, stock];
      setWatchlist(updated);
      localStorage.setItem("watchlist", JSON.stringify(updated));
      toast.success(`${stock.symbol} added to Watchlist`);
      setSearch(""); // clear search on add
    }
  };

  const removeFromWatchlist = (stock) => {
    const updated = watchlist.filter((item) => item._id !== stock._id);
    setWatchlist(updated);
    localStorage.setItem("watchlist", JSON.stringify(updated));
    toast.info(`${stock.symbol} removed from Watchlist`);
  };

  const handleTrade = (stock) => {
    navigate("/market", { state: { selectedStock: stock } });
  };

  const searchResults = search.trim() === "" ? [] : stocks.filter(
    (stock) =>
      stock.symbol?.toLowerCase().includes(search.toLowerCase()) ||
      stock.companyName?.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 5); // limit to 5 results for clean UI

  // Helper to calculate a dummy daily change (since backend doesn't provide history yet)
  const getDummyChange = (price) => {
    const seed = Math.abs(Math.sin(price)) * 5; // deterministic 0-5% based on price
    const sign = price % 2 === 0 ? 1 : -1;
    return (seed * sign).toFixed(2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-pb-bg">
        <Navbar />
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pb-bg font-['Inter'] pb-12">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-4xl font-extrabold text-pb-text mb-8 tracking-tight">Your Watchlist</h1>

        {/* SECTION 1: SEARCH */}
        <section className="mb-10 relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Search stocks by symbol or company name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-pb-surface border border-pb-border rounded-xl px-5 py-4 text-lg text-pb-text shadow-sm focus:outline-none focus:ring-2 focus:ring-pb-accent focus:border-transparent transition-all placeholder:text-pb-text-disabled"
            />
          </div>

          {search && (
            <div className="absolute z-20 w-full mt-2 bg-pb-card border border-pb-border rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden">
              {searchResults.length === 0 ? (
                <div className="p-4 text-pb-text-muted text-center">No stocks found matching "{search}"</div>
              ) : (
                <div className="divide-y divide-pb-border-divider">
                  {searchResults.map((stock) => {
                    const isAdded = watchlist.some((w) => w._id === stock._id);
                    const change = getDummyChange(stock.currentPrice);
                    const isPositive = parseFloat(change) >= 0;

                    return (
                      <div key={stock._id} className="flex justify-between items-center p-4 hover:bg-pb-card-hover transition-colors">
                        <div>
                          <p className="font-bold text-pb-text">{stock.symbol}</p>
                          <p className="text-xs text-pb-text-muted uppercase tracking-widest">{stock.companyName.replace(" (Live API)", "")}</p>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right hidden sm:block">
                            <p className="font-bold text-pb-text tabular-nums">₹{stock.currentPrice.toLocaleString('en-IN', {minimumFractionDigits:2})}</p>
                            <p className={`text-xs font-semibold tabular-nums tracking-wide ${isPositive ? 'text-pb-profit' : 'text-pb-loss'}`}>
                              {isPositive ? '+' : ''}{change}%
                            </p>
                          </div>
                          <button
                            onClick={() => isAdded ? removeFromWatchlist(stock) : addToWatchlist(stock)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border shadow-sm ${
                              isAdded 
                                ? "bg-pb-surface text-pb-text-sec border-pb-border hover:border-pb-loss hover:text-pb-loss" 
                                : "bg-pb-accent text-pb-bg border-pb-accent hover:bg-pb-accent-hover"
                            }`}
                          >
                            {isAdded ? "Added" : "Add to List"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </section>

        {/* SECTION 2: MY WATCHLIST */}
        <section>
          <div className="bg-pb-card border border-pb-border rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-pb-border-divider bg-pb-card-hover/30">
              <h2 className="text-lg font-bold text-pb-text tracking-wide uppercase">My Watchlist</h2>
            </div>
            
            {watchlist.length === 0 ? (
              <div className="p-10">
                <EmptyState 
                  title="Watchlist is Empty" 
                  subtitle="Search and add stocks to start tracking them." 
                />
              </div>
            ) : (
              <div className="divide-y divide-pb-border-divider">
                {watchlist.map((stock) => {
                  const change = getDummyChange(stock.currentPrice);
                  const isPositive = parseFloat(change) >= 0;

                  return (
                    <div key={stock._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 hover:bg-pb-card-hover transition-colors group">
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className={`w-1.5 h-10 rounded-full ${isPositive ? 'bg-pb-profit' : 'bg-pb-loss'}`}></div>
                        <div>
                          <h4 className="font-bold text-xl text-pb-text tracking-tight">{stock.symbol}</h4>
                          <p className="text-xs font-semibold text-pb-text-muted uppercase tracking-widest truncate max-w-[200px]">{stock.companyName.replace(" (Live API)", "")}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between w-full sm:w-auto mt-4 sm:mt-0 gap-6">
                        <div className="text-right">
                          <p className="font-bold text-pb-text text-xl tabular-nums tracking-tight">₹{stock.currentPrice.toLocaleString('en-IN', {minimumFractionDigits:2})}</p>
                          <p className={`text-sm font-semibold flex items-center justify-end gap-1 tabular-nums ${isPositive ? 'text-pb-profit' : 'text-pb-loss'}`}>
                            {isPositive ? '▲' : '▼'} {Math.abs(change)}%
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleTrade(stock)}
                            className="bg-pb-surface text-pb-accent hover:bg-pb-accent hover:text-pb-bg px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all border border-pb-border hover:border-transparent"
                          >
                            Trade
                          </button>
                          <button
                            onClick={() => removeFromWatchlist(stock)}
                            className="bg-pb-surface text-pb-text-muted hover:bg-pb-surface hover:text-pb-loss px-3 py-2 rounded-lg text-sm font-bold transition-all border border-pb-border hover:border-pb-loss/50"
                            title="Remove"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

      </main>
    </div>
  );
};

export default WatchlistPage;
