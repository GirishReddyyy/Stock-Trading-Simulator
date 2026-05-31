const DashboardStats = ({ dashboard }) => {
  if (!dashboard) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <DashboardCard title="Available Balance" value={dashboard.balance} />
      <DashboardCard title="Portfolio Value" value={dashboard.portfolioValue} />
      <DashboardCard title="Total Investment" value={dashboard.totalInvestment} />
      <DashboardCard title="Total Profit / Loss" value={dashboard.totalProfitLoss} profitLoss />
      <DashboardCard title="Active Holdings" value={dashboard.holdingsCount} noCurrency />
      <DashboardCard title="Pending Orders" value={dashboard.pendingOrders} noCurrency />
    </div>
  );
};

const DashboardCard = ({ title, value, profitLoss, noCurrency }) => {
  const isNegative = profitLoss && value < 0;

  return (
    <div className="glass-panel rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 flex flex-col justify-center relative overflow-hidden group">
      {/* Decorative background glow */}
      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-2xl opacity-20 transition-opacity duration-300 group-hover:opacity-40 ${
        profitLoss ? (isNegative ? "bg-red-500" : "bg-green-500") : "bg-primary"
      }`}></div>
      
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 relative z-10">
        {title}
      </p>
      
      <h2 className={`text-3xl font-extrabold relative z-10 tracking-tight ${
          profitLoss
            ? isNegative
              ? "text-red-500 dark:text-red-400"
              : "text-green-500 dark:text-green-400"
            : "text-slate-800 dark:text-slate-100"
        }`}
      >
        {!noCurrency && <span className="text-xl font-medium opacity-80 mr-1">₹</span>}
        {typeof value === 'number' && !noCurrency ? value.toLocaleString('en-IN', { maximumFractionDigits: 2 }) : value}
      </h2>
    </div>
  );
};

export default DashboardStats;
