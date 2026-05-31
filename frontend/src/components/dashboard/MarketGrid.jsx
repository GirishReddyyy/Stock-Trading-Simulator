import EmptyState from "../ui/EmptyState.jsx";
import TradeForm from "../trading/TradeForm.jsx";
import LimitOrderForm from "../trading/LimitOrderForm.jsx";

const MarketGrid = ({ filteredStocks, setSelectedStock, loadDashboard, loadOrders }) => {
  if (filteredStocks.length === 0) {
    return <EmptyState title="No Stocks Found" subtitle="Try adjusting your search query" />;
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {filteredStocks.map((stock) => (
        <div
          key={stock._id}
          className="glass-panel rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 relative overflow-hidden group"
        >
          {/* Accent decoration */}
          <div className="absolute top-0 left-0 w-1 h-full bg-primary/80"></div>
          
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">
                {stock.symbol}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1">
                {stock.companyName}
              </p>
            </div>

            <div className="text-right">
              <h3 className="text-3xl text-green-500 dark:text-green-400 font-bold tabular-nums">
                ₹{stock.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </h3>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <TradeForm stock={stock} refreshDashboard={loadDashboard} />
            </div>
            <div className="flex-1">
              <LimitOrderForm stock={stock} refreshOrders={loadOrders} />
            </div>
          </div>

          <button
            onClick={() => setSelectedStock(stock)}
            className="mt-6 w-full py-2 rounded-xl text-sm font-semibold text-primary hover:bg-primary/10 transition-colors border border-primary/20"
          >
            View Full Details & Chart
          </button>
        </div>
      ))}
    </div>
  );
};

export default MarketGrid;
