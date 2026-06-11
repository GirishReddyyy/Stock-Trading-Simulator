import React from 'react';

const PerformanceHeader = ({ dashboard }) => {
    if (!dashboard) return <div className="h-48 bg-pb-card animate-pulse rounded-2xl border border-pb-border"></div>;

    const { portfolioValue, totalProfitLoss, balance } = dashboard;
    const isProfit = totalProfitLoss >= 0;
    const returnPct = (portfolioValue - totalProfitLoss) > 0 ? (totalProfitLoss / (portfolioValue - totalProfitLoss)) * 100 : 0;

    return (
        <div className="bg-pb-card border border-pb-border rounded-2xl p-8 shadow-[0_4px_14px_rgba(0,0,0,0.35)] flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="space-y-2">
                <p className="text-xs font-semibold text-pb-text-muted uppercase tracking-widest">Total Portfolio Value</p>
                <h2 className="text-5xl font-bold text-pb-text tracking-tight">₹{portfolioValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                <div className="flex items-center gap-3 mt-3">
                    <p className={`text-xl font-bold flex items-center ${isProfit ? 'text-pb-profit' : 'text-pb-loss'}`}>
                        {isProfit ? '▲' : '▼'} ₹{Math.abs(totalProfitLoss).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </p>
                    <p className={`text-sm font-semibold px-2 py-1 rounded-md ${isProfit ? 'bg-pb-profit/10 text-pb-profit' : 'bg-pb-loss/10 text-pb-loss'}`}>
                        {isProfit ? '+' : ''}{returnPct.toFixed(2)}% All Time
                    </p>
                </div>
            </div>

            <div className="mt-8 md:mt-0 text-right">
                <p className="text-xs font-semibold text-pb-text-muted uppercase tracking-widest">Available Cash</p>
                <h3 className="text-3xl font-bold text-pb-text tracking-tight">₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                <div className="flex gap-2 mt-5 justify-end">
                    {['1D', '1W', '1M', 'ALL'].map((f) => (
                        <button key={f} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${f === 'ALL' ? 'bg-pb-accent text-pb-bg shadow-sm' : 'text-pb-text-sec hover:bg-pb-card-hover'}`}>
                            {f}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PerformanceHeader;
