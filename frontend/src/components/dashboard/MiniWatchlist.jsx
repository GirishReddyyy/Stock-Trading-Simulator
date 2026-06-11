import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const MiniWatchlist = ({ stocks }) => {
    const [watchlist, setWatchlist] = useState([]);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("watchlist")) || [];
        setWatchlist(saved);
    }, []);

    // Helper to calculate a dummy daily change
    const getDummyChange = (price) => {
        const seed = Math.abs(Math.sin(price)) * 5; // deterministic 0-5% based on price
        const sign = price % 2 === 0 ? 1 : -1;
        return (seed * sign).toFixed(2);
    };

    return (
        <div className="bg-pb-card border border-pb-border rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-5 border-b border-pb-border-divider flex justify-between items-center bg-pb-card-hover/30">
                <h3 className="text-sm font-bold text-pb-text uppercase tracking-widest">Watchlist</h3>
                <Link to="/watchlist" className="text-xs font-bold text-pb-accent hover:text-pb-accent-hover transition-colors tracking-wide">
                    View All →
                </Link>
            </div>
            
            <div className="flex-1 overflow-y-auto">
                {watchlist.length === 0 ? (
                    <div className="p-8 text-center">
                        <p className="text-sm text-pb-text-muted mb-4">No stocks added yet.</p>
                        <Link to="/watchlist" className="text-xs font-bold text-pb-bg bg-pb-accent hover:bg-pb-accent-hover px-4 py-2 rounded-lg transition-colors">
                            Browse Market
                        </Link>
                    </div>
                ) : (
                    <div className="divide-y divide-pb-border-divider">
                        {watchlist.slice(0, 4).map((stock) => {
                            const change = getDummyChange(stock.currentPrice);
                            const isPositive = parseFloat(change) >= 0;
                            
                            return (
                                <Link 
                                    to="/market"
                                    state={{ selectedStock: stock }}
                                    key={stock._id} 
                                    className="flex justify-between items-center px-5 py-4 hover:bg-pb-card-hover transition-colors group block"
                                >
                                    <div>
                                        <h4 className="font-bold text-pb-text text-sm group-hover:text-pb-accent transition-colors">{stock.symbol}</h4>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-xs font-bold tracking-wider ${isPositive ? 'text-pb-profit' : 'text-pb-loss'}`}>
                                            {isPositive ? '+' : ''}{change}%
                                        </p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MiniWatchlist;
