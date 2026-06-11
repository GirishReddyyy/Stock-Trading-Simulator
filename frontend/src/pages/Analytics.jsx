import { useEffect, useState, useMemo } from "react";

import { Pie, Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";

import Navbar from "../components/layout/Navbar.jsx";
import Loader from "../components/ui/Loader.jsx";
import { getPortfolio } from "../api/traderApi.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

// pb theme friendly chart colors (Warm earth, gold, muted green, terracotta)
const CHART_COLORS = [
  "#D4A373", // Primary pb accent (warm sand/gold)
  "#8C7A6E", // Disabled text / brownish grey
  "#6BAA75", // Profit green
  "#C96A5B", // Loss red/terracotta
  "#E6B17E", // Soft Accent
  "#B8A397", // Muted Text
  "#7FA6C9", // Info blue
  "#A38A75", // Muted warm
  "#C98C5A", // Hover primary
  "#4F3C31", // Dark warm
];

const Analytics = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [selectedStockId, setSelectedStockId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await getPortfolio();
      const holdings = res.data.holdings || [];
      setPortfolio(holdings);
      if (holdings.length > 0) {
        setSelectedStockId(holdings[0].stock?._id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const safePortfolio = portfolio || [];
  const labels = safePortfolio.map((item) => item.stock?.symbol || "Unknown");

  const values = safePortfolio.map(
    (item) => (item.stock?.currentPrice || 0) * (item.quantity || 0),
  );

  const backgroundColors = labels.map(
    (_, index) => CHART_COLORS[index % CHART_COLORS.length]
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
        backgroundColor: backgroundColors,
        borderColor: "#2B211C", // pb-card background
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  const pieOptions = {
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const clickedHolding = safePortfolio[index];
        if (clickedHolding && clickedHolding.stock) {
          setSelectedStockId(clickedHolding.stock._id);
        }
      }
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#D6C6B8' // pb-text-sec
        }
      }
    }
  };

  // Mock historical data for the selected stock
  const selectedHolding = safePortfolio.find(
    (item) => item.stock?._id === selectedStockId
  );

  const barChartData = useMemo(() => {
    if (!selectedHolding) return null;
    
    const currentPrice = selectedHolding.stock.currentPrice;
    // Generate mock 7-day variation around current price
    const mockPrices = [
      currentPrice * 0.95,
      currentPrice * 0.98,
      currentPrice * 0.92,
      currentPrice * 1.02,
      currentPrice * 0.99,
      currentPrice * 1.05,
      currentPrice,
    ];

    return {
      labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Today"],
      datasets: [
        {
          label: `${selectedHolding.stock.symbol} Price Trend`,
          data: mockPrices,
          backgroundColor: CHART_COLORS[safePortfolio.indexOf(selectedHolding) % CHART_COLORS.length],
          borderRadius: 4,
        },
      ],
    };
  }, [selectedHolding, safePortfolio]);

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: selectedHolding ? `${selectedHolding.stock.symbol} 7-Day Trend (Mocked)` : "Select a stock",
        font: { size: 16 },
        color: '#F5EDE6' // pb-text
      },
    },
    scales: {
      x: {
        ticks: { color: '#B8A397' } // pb-text-muted
      },
      y: {
        beginAtZero: false,
        ticks: { color: '#B8A397' } // pb-text-muted
      }
    }
  };

  if (!portfolio) {
    return (
        <div className="min-h-screen bg-pb-bg">
            <Navbar />
            <Loader />
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-pb-bg font-['Inter'] pb-12 transition-colors duration-300">
      <Navbar />

      <main className="p-6 max-w-7xl mx-auto py-8">
        <h1 className="text-4xl font-extrabold mb-8 text-pb-text tracking-tight">
          Analytics
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card title="Total Investment" value={totalInvestment} />
          <Card title="Portfolio Value" value={portfolioValue} />
          <Card title="Total P/L" value={pnl} pnl />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left side: Bar Chart */}
          <div className="bg-pb-card rounded-2xl shadow-[0_4px_14px_rgba(0,0,0,0.35)] border border-pb-border p-8 flex flex-col justify-center">
            <h2 className="text-lg font-bold mb-6 text-pb-text uppercase tracking-wide">
              Stock Performance
            </h2>
            {barChartData ? (
              <div className="w-full h-[300px] flex items-center justify-center">
                <Bar data={barChartData} options={barOptions} />
              </div>
            ) : (
              <div className="w-full h-[300px] flex items-center justify-center text-pb-text-muted">
                <p className="uppercase tracking-widest text-xs font-semibold">Select a stock from the pie chart to view performance</p>
              </div>
            )}
          </div>

          {/* Right side: Pie Chart */}
          <div className="bg-pb-card rounded-2xl shadow-[0_4px_14px_rgba(0,0,0,0.35)] border border-pb-border p-8">
            <h2 className="text-lg font-bold mb-2 text-pb-text uppercase tracking-wide">
              Portfolio Allocation
            </h2>
            <p className="text-xs font-semibold uppercase tracking-widest text-pb-text-muted mb-8">
              Click on a slice to view its historical trend.
            </p>
            <div className="w-full max-w-md mx-auto">
              {safePortfolio.length > 0 ? (
                <Pie data={chartData} options={pieOptions} />
              ) : (
                <div className="py-12 text-center text-pb-text-muted">
                  <p className="uppercase tracking-widest text-xs font-semibold">No holdings data available.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const Card = ({ title, value, pnl }) => (
  <div className="bg-pb-card rounded-2xl shadow-[0_4px_14px_rgba(0,0,0,0.35)] border border-pb-border p-6">
    <p className="text-xs font-semibold uppercase tracking-widest text-pb-text-muted">{title}</p>
    <h2
      className={`text-3xl font-bold mt-3 tracking-tight ${
        pnl ? (value >= 0 ? "text-pb-profit" : "text-pb-loss") : "text-pb-text"
      }`}
    >
      ₹{value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </h2>
  </div>
);

export default Analytics;
