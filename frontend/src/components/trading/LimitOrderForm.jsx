import { useState } from "react";
import { placeLimitOrder } from "../../api/traderApi.js";

const LimitOrderForm = ({ stock, refreshOrders }) => {
  const [quantity, setQuantity] = useState(1);
  const [limitPrice, setLimitPrice] = useState(stock?.currentPrice || 0);
  const [orderType, setOrderType] = useState("BUY");
  const [loading, setLoading] = useState(false);

  const handleOrder = async () => {
    try {
      setLoading(true);
      await placeLimitOrder({
        stockId: stock?._id,
        quantity: Number(quantity),
        limitPrice: Number(limitPrice),
        orderType,
      });
      alert("Order placed");
      refreshOrders();
    } catch (error) {
      alert(error.response?.data?.message || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 mt-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="flex justify-between items-center mb-1">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Limit Order</h4>
        <span className="text-xs text-slate-500 dark:text-slate-400">Triggers at set price</span>
      </div>
      
      <div className="flex gap-2">
        <select
          value={orderType}
          onChange={(e) => setOrderType(e.target.value)}
          className="w-1/3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
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
          className="w-1/3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <div className="w-1/3 relative">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500 text-sm">₹</span>
          <input
            type="number"
            value={limitPrice}
            onChange={(e) => setLimitPrice(e.target.value)}
            placeholder="Price"
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg pl-6 pr-2 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <button
        onClick={handleOrder}
        disabled={loading}
        className={`w-full py-2.5 rounded-lg text-white font-bold transition-all ${
          orderType === 'BUY' 
            ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-blue-600/30 shadow-lg' 
            : 'bg-orange-500 hover:bg-orange-600 active:bg-orange-700 shadow-orange-500/30 shadow-lg'
        } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {loading ? 'Processing...' : `Place ${orderType} Limit`}
      </button>
    </div>
  );
};

export default LimitOrderForm;
