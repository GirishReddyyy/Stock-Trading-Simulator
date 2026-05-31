import { useEffect, useState } from "react";

import { toast } from "react-toastify";

import Navbar from "../components/layout/Navbar.jsx";
import Loader from "../components/ui/Loader.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import socket from "../services/socket.js";

import { getPortfolio } from "../api/traderApi.js";

const Portfolio = () => {
  const [holdings, setHoldings] = useState([]);

  const [loading, setLoading] = useState(true);

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

  const totalInvestment = holdings.reduce(
    (sum, item) => sum + item.averageBuyPrice * item.quantity,
    0,
  );

  const currentValue = holdings.reduce(
    (sum, item) => sum + item.stock.currentPrice * item.quantity,
    0,
  );

  const totalPnL = currentValue - totalInvestment;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100">
        <Navbar />

        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <div className="p-6">
        <h1
          className="
                        text-3xl
                        font-bold
                        mb-6
                    "
        >
          Portfolio
        </h1>

        <div
          className="
                        grid
                        md:grid-cols-3
                        gap-5
                        mb-6
                    "
        >
          <Card title="Investment" value={totalInvestment} />

          <Card title="Current Value" value={currentValue} />

          <Card title="Total P/L" value={totalPnL} pnl />
        </div>

        <div
          className="
                        bg-white
                        rounded-xl
                        shadow
                        overflow-hidden
                    "
        >
          {holdings.length === 0 ? (
            <div
              className="
                                    py-10
                                    text-center
                                "
            >
              <h3
                className="
                                        text-xl
                                        font-semibold
                                        text-gray-600
                                    "
              >
                No Holdings Yet
              </h3>

              <p
                className="
                                        text-gray-400
                                        mt-2
                                    "
              >
                Buy stocks to build your portfolio
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead
                className="
                                        bg-slate-200
                                    "
              >
                <tr>
                  <th className="p-4 text-left">Stock</th>

                  <th className="p-4 text-left">Qty</th>

                  <th className="p-4 text-left">Avg Buy</th>

                  <th className="p-4 text-left">Current</th>

                  <th className="p-4 text-left">Investment</th>

                  <th className="p-4 text-left">Value</th>

                  <th className="p-4 text-left">P/L</th>
                </tr>
              </thead>

              <tbody>
                {holdings.map((item) => {
                  const investment = item.averageBuyPrice * item.quantity;

                  const value = item.stock.currentPrice * item.quantity;

                  const pnl = value - investment;

                  return (
                    <tr
                      key={item.stock._id}
                      className="
                                                            border-t
                                                        "
                    >
                      <td className="p-4 font-semibold">{item.stock.symbol}</td>

                      <td className="p-4">{item.quantity}</td>

                      <td className="p-4">
                        ₹{item.averageBuyPrice.toFixed(2)}
                      </td>

                      <td className="p-4">
                        ₹{item.stock.currentPrice.toFixed(2)}
                      </td>

                      <td className="p-4">₹{investment.toFixed(2)}</td>

                      <td className="p-4">₹{value.toFixed(2)}</td>

                      <td
                        className={`
                                                                p-4
                                                                font-semibold
                                                                ${
                                                                  pnl >= 0
                                                                    ? "text-green-600"
                                                                    : "text-red-600"
                                                                }
                                                            `}
                      >
                        ₹{pnl.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

const Card = ({ title, value, pnl }) => (
  <div
    className="
            bg-white
            rounded-xl
            shadow
            p-5
        "
  >
    <p className="text-gray-500">{title}</p>

    <h2
      className={`
                text-2xl
                font-bold
                mt-2
                ${pnl ? (value >= 0 ? "text-green-600" : "text-red-600") : ""}
            `}
    >
      ₹{value.toFixed(2)}
    </h2>
  </div>
);

export default Portfolio;
