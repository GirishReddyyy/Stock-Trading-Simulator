import { useEffect, useState } from "react";

import { Pie } from "react-chartjs-2";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import Navbar from "../components/layout/Navbar.jsx";
import Loader from "../components/ui/Loader.jsx";
import { getPortfolio } from "../api/traderApi.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const Analytics = () => {
  const [portfolio, setPortfolio] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await getPortfolio();

      setPortfolio(res.data.holdings || []);
    } catch (error) {
      console.log(error);
    }
  };

  const safePortfolio = portfolio || [];
  const labels = safePortfolio.map((item) => item.stock?.symbol || 'Unknown');

  const values = safePortfolio.map(
    (item) => (item.stock?.currentPrice || 0) * (item.quantity || 0),
  );

  const totalInvestment = safePortfolio.reduce(
    (sum, item) => sum + (item.averageBuyPrice || 0) * (item.quantity || 0),
    0,
  );

  const portfolioValue = safePortfolio.reduce(
    (sum, item) => sum + (item.stock?.currentPrice || 0) * (item.quantity || 0),
    0,
  );

  const pnl = portfolioValue - totalInvestment;

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
      },
    ],
  };

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
          Analytics
        </h1>

        <div
          className="
                        grid
                        grid-cols-1
                        md:grid-cols-3
                        gap-5
                        mb-6
                    "
        >
          <Card title="Investment" value={totalInvestment} />

          <Card title="Portfolio Value" value={portfolioValue} />

          <Card title="P/L" value={pnl} pnl />
        </div>

        <div
          className="
                        bg-white
                        rounded-xl
                        shadow
                        p-6
                        max-w-xl
                    "
        >
          <h2
            className="
                            text-xl
                            font-semibold
                            mb-4
                        "
          >
            Portfolio Allocation
          </h2>

          <Pie data={chartData} />
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

export default Analytics;
