import { useState } from "react";

import {
  placeLimitOrder
}
  from "../api/traderApi.js";

const LimitOrderForm = ({ stock, refreshOrders }) => {
  const [quantity, setQuantity] = useState(1);

  const [limitPrice, setLimitPrice] = useState(stock.currentPrice);

  const [orderType, setOrderType] = useState("BUY");

  const handleOrder = async () => {
    try {
      await placeLimitOrder({
        stockId: stock._id,
        quantity: Number(quantity),
        limitPrice: Number(limitPrice),
        orderType,
      });

      alert("Order placed");

      refreshOrders();
    } catch (error) {
      alert(error.response?.data?.message || "Order failed");
    }
  };

  return (
    <div
      style={{
        marginTop: 10,
      }}
    >
      <h4>Limit Order</h4>

      <select value={orderType} onChange={(e) => setOrderType(e.target.value)}>
        <option>BUY</option>

        <option>SELL</option>
      </select>

      <input
        type="number"
        min="1"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        placeholder="Qty"
        style={{
          marginLeft: 10,
        }}
      />

      <input
        type="number"
        value={limitPrice}
        onChange={(e) => setLimitPrice(e.target.value)}
        placeholder="Limit Price"
        style={{
          marginLeft: 10,
        }}
      />

      <button
        onClick={handleOrder}
        style={{
          marginLeft: 10,
        }}
      >
        Place
      </button>
    </div>
  );
};

export default LimitOrderForm;
