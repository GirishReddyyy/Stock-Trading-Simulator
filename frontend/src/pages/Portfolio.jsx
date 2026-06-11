import { useEffect, useState } from "react";

import { toast } from "react-toastify";

import Navbar from "../components/layout/Navbar.jsx";
import Loader from "../components/ui/Loader.jsx";
import socket from "../services/socket.js";

import { getPortfolio, sellStock, placeLimitOrder } from "../api/traderApi.js";

const Portfolio = () => {
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sell Modal State
  const [selectedHolding, setSelectedHolding] = useState(null);
  const [sellQty, setSellQty] = useState(1);
  const [isAutoSell, setIsAutoSell] = useState(false);
  const [sellTargetPrice, setSellTargetPrice] = useState(0);
  const [sellLoading, setSellLoading] = useState(false);

  const loadPortfolio = async () => {
    try {
      const res = await getPortfolio();

      setHoldings(res.data.holdings || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Portfolio load failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortfolio();

    // LIVE PRICE UPDATE

    const handlePriceUpdate = () => {
      loadPortfolio();
    };

    const handleOrderExecuted = () => {
      loadPortfolio();
    };

    socket.on("priceUpdate", handlePriceUpdate);
    socket.on("orderExecuted", handleOrderExecuted);

    return () => {
      socket.off("priceUpdate", handlePriceUpdate);
      socket.off("orderExecuted", handleOrderExecuted);
    };
  }, []);

  const totalInvestment = holdings.reduce(
    (sum, item) => sum + item.averageBuyPrice * item.quantity,
    0,
  );

  const currentValue = holdings.reduce(
    (sum, item) => sum + item.stock.currentPrice * item.quantity,
    0,
  );

  const totalPnL = currentValue - totalInvestment;

  const openSellModal = (holding) => {
    setSelectedHolding(holding);
    setSellQty(1);
    setIsAutoSell(false);
    setSellTargetPrice(holding.stock.currentPrice);
  };

  const closeSellModal = () => {
    setSelectedHolding(null);
  };

  const handleSellSubmit = async () => {
    try {
      setSellLoading(true);
      if (isAutoSell) {
        await placeLimitOrder({
          stockId: selectedHolding.stock._id,
          quantity: Number(sellQty),
          limitPrice: Number(sellTargetPrice),
          orderType: "SELL",
        });
        toast.success("Auto-sell limit order placed!");
      } else {
        await sellStock({
          stockId: selectedHolding.stock._id,
          quantity: Number(sellQty),
        });
        toast.success("Stock sold successfully!");
      }
      closeSellModal();
      loadPortfolio();
    } catch (error) {
      toast.error(error.response?.data?.message || "Action failed");
    } finally {
      setSellLoading(false);
    }
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
    <div className="min-h-screen bg-pb-bg font-['Inter']">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-extrabold text-pb-text mb-8 tracking-tight">
          Portfolio
        </h1>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <Card title="Total Investment" value={totalInvestment} />

          <Card title="Current Value" value={currentValue} />

          <Card title="Total P/L" value={totalPnL} pnl />
        </div>

        <div className="bg-pb-card border border-pb-border rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-pb-border-divider bg-pb-card-hover/30">
            <h2 className="text-lg font-bold text-pb-text tracking-wide uppercase">Your Holdings</h2>
          </div>
          {holdings.length === 0 ? (
            <div className="py-16 text-center">
              <h3 className="text-xl font-bold text-pb-text mb-2">
                No Holdings Yet
              </h3>
              <p className="text-pb-text-muted text-sm uppercase tracking-widest">
                Buy stocks to build your portfolio
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-pb-surface text-pb-text-muted font-bold uppercase text-xs tracking-widest border-b border-pb-border-divider">
                  <tr>
                    <th className="p-5">Stock</th>
                    <th className="p-5 text-right">Qty</th>
                    <th className="p-5 text-right">Avg Buy</th>
                    <th className="p-5 text-right">Current</th>
                    <th className="p-5 text-right">Investment</th>
                    <th className="p-5 text-right">Value</th>
                    <th className="p-5 text-right">P/L</th>
                    <th className="p-5 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-pb-border-divider">
                  {holdings.map((item) => {
                    const investment = item.averageBuyPrice * item.quantity;
                    const value = item.stock.currentPrice * item.quantity;
                    const pnl = value - investment;

                    return (
                      <tr
                        key={item.stock._id}
                        className="hover:bg-pb-card-hover transition-colors group"
                      >
                        <td className="p-5">
                          <p className="font-bold text-pb-text group-hover:text-pb-accent transition-colors">{item.stock.symbol}</p>
                          <p className="text-xs text-pb-text-muted mt-1 uppercase tracking-widest truncate max-w-[150px]">{item.stock.companyName.replace(" (Live API)", "")}</p>
                        </td>

                        <td className="p-5 text-right font-medium text-pb-text-sec">{item.quantity}</td>

                        <td className="p-5 text-right font-medium text-pb-text-sec">
                          ₹{item.averageBuyPrice.toLocaleString('en-IN', {minimumFractionDigits:2})}
                        </td>

                        <td className="p-5 text-right font-bold text-pb-text tabular-nums">
                          ₹{item.stock.currentPrice.toLocaleString('en-IN', {minimumFractionDigits:2})}
                        </td>

                        <td className="p-5 text-right font-medium text-pb-text-sec tabular-nums">
                          ₹{investment.toLocaleString('en-IN', {minimumFractionDigits:2})}
                        </td>

                        <td className="p-5 text-right font-semibold text-pb-text tabular-nums">
                          ₹{value.toLocaleString('en-IN', {minimumFractionDigits:2})}
                        </td>

                        <td
                          className={`p-5 text-right font-bold tabular-nums ${
                            pnl >= 0 ? "text-pb-profit" : "text-pb-loss"
                          }`}
                        >
                          {pnl >= 0 ? "+" : ""}₹{pnl.toLocaleString('en-IN', {minimumFractionDigits:2})}
                        </td>

                        <td className="p-5 text-center">
                          <button
                            onClick={() => openSellModal(item)}
                            className="bg-pb-surface text-pb-loss hover:bg-pb-loss hover:text-pb-bg px-4 py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-all border border-pb-border hover:border-transparent"
                          >
                            Sell
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Sell Modal */}
      {selectedHolding && (
        <div className="fixed inset-0 bg-pb-bg/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-pb-card rounded-2xl p-8 w-full max-w-md shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative border border-pb-border">
            <button
              onClick={closeSellModal}
              className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-pb-surface hover:bg-pb-card-hover text-pb-text-muted hover:text-pb-text transition-colors border border-pb-border"
            >
              ✕
            </button>
            <h2 className="text-3xl font-extrabold mb-1 text-pb-text tracking-tight">
              Sell {selectedHolding.stock.symbol}
            </h2>
            <p className="text-xs font-semibold text-pb-text-muted uppercase tracking-widest mb-8">
              Available Qty: {selectedHolding.quantity}
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-pb-text-sec uppercase tracking-wider mb-2">
                  Quantity to Sell
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedHolding.quantity}
                  value={sellQty}
                  onChange={(e) => setSellQty(e.target.value)}
                  className="w-full bg-pb-bg border border-pb-border rounded-xl px-4 py-3 text-pb-text font-bold focus:outline-none focus:ring-2 focus:ring-pb-accent focus:border-transparent transition-all"
                />
              </div>

              <div className="flex items-center justify-between bg-pb-surface p-4 rounded-xl border border-pb-border">
                <div>
                  <h4 className="text-sm font-bold text-pb-text">Auto Sell (Limit Order)</h4>
                  <p className="text-xs font-semibold text-pb-text-muted uppercase tracking-widest mt-1">Trigger at set price</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={isAutoSell}
                    onChange={(e) => setIsAutoSell(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-pb-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-pb-text after:border-pb-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pb-warn"></div>
                </label>
              </div>

              {isAutoSell && (
                <div>
                  <label className="block text-xs font-bold text-pb-text-sec uppercase tracking-wider mb-2">
                    Target Price (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={sellTargetPrice}
                    onChange={(e) => setSellTargetPrice(e.target.value)}
                    className="w-full bg-pb-bg border border-pb-border rounded-xl px-4 py-3 text-pb-text font-bold focus:outline-none focus:ring-2 focus:ring-pb-warn focus:border-transparent transition-all"
                  />
                </div>
              )}

              <button
                onClick={handleSellSubmit}
                disabled={sellLoading || sellQty > selectedHolding.quantity}
                className={`w-full py-4 mt-2 rounded-xl text-pb-bg font-extrabold uppercase tracking-widest transition-all ${
                  isAutoSell ? 'bg-pb-warn hover:bg-pb-warn/90' : 'bg-pb-loss hover:bg-pb-loss/90'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {sellLoading 
                  ? "Processing..." 
                  : isAutoSell 
                    ? `Limit Sell @ ₹${sellTargetPrice}` 
                    : `Sell Now @ ₹${(selectedHolding.stock.currentPrice * sellQty).toFixed(2)}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Card = ({ title, value, pnl }) => (
  <div className="bg-pb-card border border-pb-border rounded-2xl shadow-[0_4px_14px_rgba(0,0,0,0.35)] p-6">
    <p className="text-xs font-semibold text-pb-text-muted uppercase tracking-widest">{title}</p>
    <h2
      className={`text-3xl font-bold mt-3 tracking-tight ${
        pnl ? (value >= 0 ? "text-pb-profit" : "text-pb-loss") : "text-pb-text"
      }`}
    >
      ₹{value.toLocaleString('en-IN', {minimumFractionDigits:2, maximumFractionDigits:2})}
    </h2>
  </div>
);

export default Portfolio;
