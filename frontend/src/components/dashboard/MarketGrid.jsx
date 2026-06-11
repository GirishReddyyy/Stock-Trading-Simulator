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
          className="bg-pb-card rounded-2xl shadow-[0_4px_14px_rgba(0,0,0,0.25)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-all duration-300 p-6 relative overflow-hidden group border border-pb-border"
        >
          {/* Accent decoration */}
          <div className="absolute top-0 left-0 w-1.5 h-full bg-pb-accent opacity-80 group-hover:opacity-100 transition-opacity"></div>
          
          <div className="flex justify-between items-start mb-8 border-b border-pb-border-divider pb-4">
            <div>
              <h3 className="text-3xl font-extrabold text-pb-text tracking-tight">
                {stock.symbol}
              </h3>
              <p className="text-pb-text-muted font-medium text-sm mt-1 uppercase tracking-widest">
                {stock.companyName.replace(" (Live API)", "")}
              </p>
            </div>

            <div className="text-right">
              <h3 className="text-3xl text-pb-profit font-bold tabular-nums">
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
            className="mt-6 w-full py-3 rounded-xl text-sm font-bold text-pb-accent hover:text-pb-accent-hover hover:bg-pb-card-hover transition-colors border border-pb-border hover:border-pb-accent/50"
          >
            View Full Details & Chart
          </button>
        </div>
      ))}
    </div>
  );
};

export default MarketGrid;
