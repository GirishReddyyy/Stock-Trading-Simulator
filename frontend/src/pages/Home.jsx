import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import socket from "../services/socket.js";

import Loader from "../components/Loader.jsx";
import Navbar from "../components/Navbar.jsx";

import TradeForm from "../components/TradeForm.jsx";
import LimitOrderForm from "../components/LimitOrderForm.jsx";

import Watchlist from "../components/Watchlist.jsx";
import MarketNews from "../components/MarketNews.jsx";
import Leaderboard from "../components/Leaderboard.jsx";
import NotificationCenter from "../components/NotificationCenter.jsx";
import ThemeToggle from "../components/ThemeToggle.jsx";
import EmptyState from "../components/EmptyState.jsx";
import OrderBook from "../components/OrderBook.jsx";
import StockModal from "../components/StockModal.jsx";

import {
  getDashboard,
  getMarketStocks,
  getOrders,
  cancelOrder
} from "../api/traderApi.js";

const Home = () => {

  const [dashboard,
    setDashboard] =
    useState(null);

  const [stocks,
    setStocks] =
    useState([]);

  const [orders,
    setOrders] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

  const [search,
    setSearch] =
    useState("");

  const [selectedStock,
    setSelectedStock] =
    useState(null);

  useEffect(() => {

    Promise.all([
      loadDashboard(),
      loadStocks(),
      loadOrders()
    ]).finally(
      () =>
        setLoading(false)
    );

    socket.on(
      "priceUpdate",
      (
        updatedStock
      ) => {

        setStocks(
          (prev) =>
            prev.map(
              (
                stock
              ) =>
                stock._id ===
                updatedStock.stockId
                  ? {
                      ...stock,
                      currentPrice:
                        updatedStock.currentPrice
                    }
                  : stock
            )
        );
      }
    );

    socket.on(
      "orderExecuted",
      (
        data
      ) => {

        toast.success(
          `${data.type} ${data.stock} executed @ ₹${data.price}`
        );

        loadDashboard();
        loadOrders();
      }
    );

    return () => {

      socket.off(
        "priceUpdate"
      );

      socket.off(
        "orderExecuted"
      );
    };

  }, []);

  const loadDashboard =
    async () => {

      try {

        const res =
          await getDashboard();

        setDashboard(
          res.data
        );

      } catch (
        error
      ) {

        toast.error(
          error.response?.data?.message ||
          "Dashboard load failed"
        );
      }
    };

  const loadStocks =
    async () => {

      try {

        const res =
          await getMarketStocks();

        setStocks(
          res.data.stocks
        );

      } catch (
        error
      ) {

        toast.error(
          error.response?.data?.message ||
          "Market load failed"
        );
      }
    };

  const loadOrders =
    async () => {

      try {

        const res =
          await getOrders();

        setOrders(
          res.data.orders
        );

      } catch (
        error
      ) {

        toast.error(
          error.response?.data?.message ||
          "Orders load failed"
        );
      }
    };

  const handleCancel =
    async (
      id
    ) => {

      try {

        await cancelOrder(
          id
        );

        toast.info(
          "Order cancelled"
        );

        loadOrders();

      } catch (
        error
      ) {

        toast.error(
          error.response?.data?.message ||
          "Cancel failed"
        );
      }
    };

  const filteredStocks =
    stocks.filter(
      (stock) =>
        stock.symbol
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        stock.companyName
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

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

        <div
          className="
            flex
            justify-end
            mb-4
          "
        >
          <ThemeToggle />
        </div>

        <NotificationCenter />

        <Leaderboard />

        <Watchlist
          stocks={stocks}
        />

        <MarketNews />

        <h1
          className="
            text-4xl
            font-bold
            text-slate-800
            mb-6
          "
        >
          Stock Trading Simulator
        </h1>

        {dashboard && (

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              lg:grid-cols-3
              gap-5
              mb-8
            "
          >

            <DashboardCard
              title="Balance"
              value={dashboard.balance}
            />

            <DashboardCard
              title="Portfolio Value"
              value={dashboard.portfolioValue}
            />

            <DashboardCard
              title="Investment"
              value={dashboard.totalInvestment}
            />

            <DashboardCard
              title="Profit / Loss"
              value={dashboard.totalProfitLoss}
              profitLoss
            />

            <DashboardCard
              title="Holdings"
              value={dashboard.holdingsCount}
              noCurrency
            />

            <DashboardCard
              title="Pending Orders"
              value={dashboard.pendingOrders}
              noCurrency
            />

          </div>
        )}

        <h2
          className="
            text-2xl
            font-semibold
            mb-4
          "
        >
          Live Market
        </h2>

        <div className="mb-5">

          <input
            type="text"
            placeholder="Search stock..."
            value={search}
            onChange={(e)=>
              setSearch(
                e.target.value
              )
            }
            className="
              w-full
              md:w-96
              border
              rounded-lg
              px-4
              py-2
              bg-white
            "
          />

        </div>

        {filteredStocks.length === 0 ? (

          <EmptyState
            title="No Stocks"
            subtitle="Try another search"
          />

        ) : (

          <div
            className="
              grid
              grid-cols-1
              lg:grid-cols-2
              gap-5
            "
          >

            {filteredStocks.map(
              (stock) => (

                <div
                  key={stock._id}
                  className="
                    bg-white
                    rounded-xl
                    shadow-md
                    p-5
                  "
                >

                  <div
                    className="
                      flex
                      justify-between
                      items-center
                    "
                  >

                    <div>

                      <h3
                        className="
                          text-xl
                          font-bold
                        "
                      >
                        {stock.symbol}
                      </h3>

                      <p className="text-gray-500">
                        {stock.companyName}
                      </p>

                    </div>

                    <h3
                      className="
                        text-2xl
                        text-green-600
                        font-semibold
                      "
                    >
                      ₹
                      {stock.currentPrice}
                    </h3>

                  </div>

                  <button
                    onClick={() =>
                      setSelectedStock(
                        stock
                      )
                    }
                    className="
                      mt-3
                      text-sm
                      text-blue-600
                    "
                  >
                    View Details
                  </button>

                  <div className="mt-4">

                    <TradeForm
                      stock={stock}
                      refreshDashboard={
                        loadDashboard
                      }
                    />

                  </div>

                  <div className="mt-4">

                    <LimitOrderForm
                      stock={stock}
                      refreshOrders={
                        loadOrders
                      }
                    />

                  </div>

                </div>
              )
            )}

          </div>
        )}

        <div className="my-10 border-t"></div>

        <h2
          className="
            text-2xl
            font-semibold
            mb-4
          "
        >
          Orders
        </h2>

        {orders.length === 0 ? (

          <EmptyState
            title="No Orders"
            subtitle="Place your first trade"
          />

        ) : (

          <div className="space-y-4">

            {orders.map(
              (order) => (

                <div
                  key={order._id}
                  className="
                    bg-white
                    rounded-xl
                    shadow
                    p-5
                  "
                >

                  <div
                    className="
                      flex
                      justify-between
                    "
                  >

                    <div>

                      <h3 className="font-bold">
                        {order.stock?.symbol}
                      </h3>

                      <p className="text-gray-500">
                        {order.orderType}
                      </p>

                    </div>

                    <span>
                      {order.status}
                    </span>

                  </div>

                  <p className="mt-2">
                    Qty:
                    {order.quantity}
                  </p>

                  <p>
                    Limit:
                    ₹
                    {order.limitPrice}
                  </p>

                  {order.status ===
                    "PENDING" && (

                    <button
                      onClick={() =>
                        handleCancel(
                          order._id
                        )
                      }
                      className="
                        mt-3
                        bg-red-500
                        text-white
                        px-4
                        py-2
                        rounded-lg
                      "
                    >
                      Cancel
                    </button>
                  )}

                </div>
              )
            )}

          </div>
        )}

        <OrderBook />

        <StockModal
          stock={selectedStock}
          onClose={() =>
            setSelectedStock(
              null
            )
          }
        />

      </div>

    </div>
  );
};

const DashboardCard = ({
  title,
  value,
  profitLoss,
  noCurrency
}) => {

  const isNegative =
    profitLoss &&
    value < 0;

  return (

    <div
      className="
        bg-white
        rounded-xl
        shadow-md
        p-5
      "
    >

      <p className="text-gray-500">
        {title}
      </p>

      <h2
        className={`
          text-2xl
          font-bold
          mt-2
          ${
            profitLoss
              ? isNegative
                ? "text-red-600"
                : "text-green-600"
              : "text-slate-800"
          }
        `}
      >
        {
          noCurrency
            ? value
            : `₹${value}`
        }
      </h2>

    </div>
  );
};

export default Home;