import { useState } from "react";
import { toast } from "react-toastify";
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
      toast.success("Order placed");
      refreshOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 mt-4 bg-pb-surface p-5 rounded-2xl border border-pb-border shadow-sm">
      <div className="flex justify-between items-center mb-1">
        <h4 className="text-sm font-bold text-pb-text tracking-wide uppercase">Limit Order</h4>
        <span className="text-xs font-semibold text-pb-text-muted tracking-widest uppercase">Triggers at set price</span>
      </div>
      
      <div className="flex flex-col gap-3">
        <div className="flex gap-3">
          <select
            value={orderType}
            onChange={(e) => setOrderType(e.target.value)}
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

        <div className="w-full relative mt-1">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-pb-text-muted font-bold text-lg">₹</span>
          <input
            type="number"
            value={limitPrice}
            onChange={(e) => setLimitPrice(e.target.value)}
            placeholder="Target Price"
            className="w-full bg-pb-bg border border-pb-border rounded-xl pl-9 pr-4 py-3 text-lg font-bold text-pb-text tracking-wide focus:outline-none focus:ring-2 focus:ring-pb-accent focus:border-transparent transition-all placeholder:text-pb-text-disabled"
          />
        </div>
      </div>

      <button
        onClick={handleOrder}
        disabled={loading}
        className={`w-full py-3 mt-2 rounded-xl text-pb-bg font-extrabold tracking-widest uppercase transition-all shadow-sm bg-pb-accent hover:bg-pb-accent-hover active:scale-[0.98] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {loading ? 'Processing...' : `Place ${orderType} Limit`}
      </button>
    </div>
  );
};

export default LimitOrderForm;
