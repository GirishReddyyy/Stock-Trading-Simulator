import { useState } from "react";

import { buyStock, sellStock } from "../api/traderApi.js";

const TradeForm = ({ stock, refreshDashboard }) => {
  const [quantity, setQuantity] = useState(1);

  const [type, setType] = useState("BUY");

  const handleTrade = async () => {
    try {
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
    }
  };

  return (
    <div
      style={{
        marginTop: 10,
      }}
    >
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option>BUY</option>

        <option>SELL</option>
      </select>

      <input
        type="number"
        min="1"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        style={{
          marginLeft: 10,
        }}
      />

      <button
        onClick={handleTrade}
        style={{
          marginLeft: 10,
        }}
      >
        Submit
      </button>
    </div>
  );
};

export default TradeForm;
