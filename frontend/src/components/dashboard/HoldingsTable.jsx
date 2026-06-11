import React from 'react';

const HoldingsTable = ({ holdings }) => {
    if (!holdings || holdings.length === 0) {
        return (
            <div className="bg-pb-card border border-pb-border rounded-2xl p-12 shadow-sm text-center">
                <p className="text-pb-text-sec font-medium text-lg tracking-wide">No holdings currently. Start trading to build your portfolio!</p>
            </div>
        );
    }

    return (
        <div className="bg-pb-card border border-pb-border rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-pb-border-divider flex justify-between items-center bg-pb-card-hover/30">
                <h3 className="text-lg font-bold text-pb-text tracking-wide">Your Holdings</h3>
                <button className="text-sm font-bold text-pb-accent hover:text-pb-accent-hover bg-pb-surface px-4 py-2 rounded-lg transition-colors border border-pb-border hover:border-pb-accent/50 shadow-sm">View Full Portfolio</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-pb-surface text-pb-text-muted font-bold uppercase text-xs tracking-widest border-b border-pb-border">
                        <tr>
                            <th className="px-6 py-5">Instrument</th>
                            <th className="px-6 py-5 text-right">Qty.</th>
                            <th className="px-6 py-5 text-right">Avg. Price</th>
                            <th className="px-6 py-5 text-right">LTP</th>
                            <th className="px-6 py-5 text-right">Current Value</th>
                            <th className="px-6 py-5 text-right">P&L</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-pb-border-divider">
                        {holdings.map((h, i) => {
                            const currentPrice = h.stock?.currentPrice || 0;
                            const avgPrice = h.averageBuyPrice || 0;
                            const qty = h.quantity;
                            const currentValue = currentPrice * qty;
                            const invested = avgPrice * qty;
                            const pnl = currentValue - invested;
                            const isProfit = pnl >= 0;
                            const pnlPct = invested > 0 ? (pnl / invested) * 100 : 0;

                            return (
                                <tr key={i} className="hover:bg-pb-card-hover transition-colors cursor-pointer group">
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <p className="font-bold text-pb-text group-hover:text-pb-accent transition-colors">{h.stock?.symbol}</p>
                                        <p className="text-xs font-medium text-pb-text-muted truncate max-w-[150px]">{h.stock?.companyName?.replace(" (Live API)", "")}</p>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap text-right font-medium text-pb-text-sec">
                                        {qty}
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap text-right font-medium text-pb-text-sec">
                                        ₹{avgPrice.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap text-right font-bold text-pb-text">
                                        ₹{currentPrice.toLocaleString('en-IN', {minimumFractionDigits:2})}
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap text-right font-semibold text-pb-text">
                                        ₹{currentValue.toLocaleString('en-IN', {minimumFractionDigits:2})}
                                    </td>
                                    <td className={`px-6 py-5 whitespace-nowrap text-right font-bold ${isProfit ? 'text-pb-profit' : 'text-pb-loss'}`}>
                                        {isProfit ? '+' : ''}₹{pnl.toFixed(2)} 
                                        <div className="text-xs font-medium opacity-80 mt-1">{isProfit ? '+' : ''}{pnlPct.toFixed(2)}%</div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HoldingsTable;
