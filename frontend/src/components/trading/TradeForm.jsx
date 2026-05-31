import { useState } from "react";
import { buyStock, sellStock } from "../../api/traderApi.js";

const TradeForm = ({ stock, refreshDashboard }) => {
  const [quantity, setQuantity] = useState(1);
  const [type, setType] = useState("BUY");
  const [loading, setLoading] = useState(false);

  const handleTrade = async () => {
    try {
      setLoading(true);
      const payload = {
        stockId: stock._id,
        quantity: Number(quantity),
      };

      if (type === "BUY") {
        await buyStock(payload);
        alert("Buy successful");
      } else {
        await sellStock(payload);
        alert("Sell successful");
      }

      refreshDashboard();
    } catch (error) {
      alert(error.response?.data?.message || "Trade failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 mt-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="flex gap-2">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="BUY">BUY</option>
          <option value="SELL">SELL</option>
        </select>
        
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <button
        onClick={handleTrade}
        disabled={loading}
        className={`w-full py-2.5 rounded-lg text-white font-bold transition-all ${
          type === 'BUY' 
            ? 'bg-green-600 hover:bg-green-700 active:bg-green-800 shadow-green-600/30 shadow-lg' 
            : 'bg-red-600 hover:bg-red-700 active:bg-red-800 shadow-red-600/30 shadow-lg'
        } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {loading ? 'Processing...' : `${type} ${stock.symbol}`}
      </button>
    </div>
  );
};

export default TradeForm;
