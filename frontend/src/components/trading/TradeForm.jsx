import { useState } from "react";
import { toast } from "react-toastify";
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
        toast.success("Buy successful");
      } else {
        await sellStock(payload);
        toast.success("Sell successful");
      }

      refreshDashboard();
    } catch (error) {
      toast.error(error.response?.data?.message || "Trade failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 mt-4 bg-pb-surface p-5 rounded-2xl border border-pb-border shadow-sm">
      <div className="flex justify-between items-center mb-1">
        <h4 className="text-sm font-bold text-pb-text tracking-wide uppercase">Market Order</h4>
        <span className="text-xs font-semibold text-pb-text-muted tracking-widest uppercase">Executes Instantly</span>
      </div>
      
      <div className="flex gap-3">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-1/2 bg-pb-bg border border-pb-border rounded-xl px-4 py-3 text-base font-bold text-pb-text focus:outline-none focus:ring-2 focus:ring-pb-accent focus:border-transparent transition-all"
        >
          <option value="BUY">BUY</option>
          <option value="SELL">SELL</option>
        </select>
        
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Qty"
          className="w-1/2 bg-pb-bg border border-pb-border rounded-xl px-4 py-3 text-base font-bold text-pb-text focus:outline-none focus:ring-2 focus:ring-pb-accent focus:border-transparent transition-all placeholder:text-pb-text-disabled"
        />
      </div>

      <button
        onClick={handleTrade}
        disabled={loading}
        className={`w-full py-3 mt-2 rounded-xl text-pb-bg font-extrabold tracking-widest uppercase transition-all shadow-sm ${
          type === 'BUY' 
            ? 'bg-pb-profit hover:bg-pb-profit/90 active:scale-[0.98]' 
            : 'bg-pb-loss hover:bg-pb-loss/90 active:scale-[0.98]'
        } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {loading ? 'Processing...' : `${type} ${stock.symbol}`}
      </button>
    </div>
  );
};

export default TradeForm;
