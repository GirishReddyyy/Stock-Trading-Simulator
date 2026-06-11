import React from 'react';

const MarketPulse = ({ stocks, recentTransactions }) => {
    const displayStocks = stocks.slice(0, 4);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-pb-card border border-pb-border rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-pb-text uppercase tracking-widest mb-4 border-b border-pb-border-divider pb-3">Market Pulse</h3>
                <div className="space-y-3">
                    {displayStocks.map(s => (
                        <div key={s._id} className="flex justify-between items-center group hover:bg-pb-card-hover p-3 -mx-3 rounded-xl transition-colors cursor-pointer">
                            <div>
                                <p className="font-bold text-pb-text">{s.symbol}</p>
                                <p className="text-xs text-pb-text-muted truncate w-32">{s.companyName.replace(" (Live API)", "")}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-pb-text">₹{s.currentPrice.toLocaleString('en-IN', {minimumFractionDigits: 2})}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-pb-card border border-pb-border rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-pb-text uppercase tracking-widest mb-4 border-b border-pb-border-divider pb-3">Recent Activity</h3>
                <div className="space-y-3">
                    {recentTransactions?.length === 0 ? (
                        <p className="text-sm text-pb-text-muted py-2">No recent trades.</p>
                    ) : (
                        recentTransactions?.map(tx => (
                            <div key={tx._id} className="flex justify-between items-center hover:bg-pb-card-hover p-3 -mx-3 rounded-xl transition-colors">
                                <div className="flex items-center gap-4">
                                    <span className={`w-2 h-2 rounded-full ${tx.type === 'BUY' ? 'bg-pb-profit' : 'bg-pb-loss'}`}></span>
                                    <div>
                                        <p className="font-bold text-pb-text">{tx.stock?.symbol}</p>
                                        <p className="text-xs text-pb-text-muted">{new Date(tx.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`font-bold text-sm tracking-wide ${tx.type === 'BUY' ? 'text-pb-profit' : 'text-pb-loss'}`}>{tx.type}</p>
                                    <p className="text-xs font-medium text-pb-text-sec">{tx.quantity} @ ₹{tx.price.toFixed(2)}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default MarketPulse;
