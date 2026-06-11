import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const StockModal = ({ stock, onClose }) => {
    const [watchlist, setWatchlist] = useState([]);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("watchlist")) || [];
        setWatchlist(saved);
    }, [stock]);

    if (!stock) return null;

    const isAdded = watchlist.some((s) => s._id === stock._id);

    const toggleWatchlist = () => {
        let updated;
        if (isAdded) {
            updated = watchlist.filter((s) => s._id !== stock._id);
            toast.info(`${stock.symbol} removed from Watchlist`);
        } else {
            updated = [...watchlist, stock];
            toast.success(`${stock.symbol} added to Watchlist`);
        }
        setWatchlist(updated);
        localStorage.setItem("watchlist", JSON.stringify(updated));
    };

    return (
        <div className="fixed inset-0 bg-pb-bg/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-pb-card rounded-2xl p-8 w-full max-w-md shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative border border-pb-border">
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-pb-surface hover:bg-pb-card-hover text-pb-text-muted hover:text-pb-text transition-colors border border-pb-border"
                >
                    ✕
                </button>

                <div className="flex justify-between items-start mb-8 pr-10">
                    <div>
                        <h2 className="text-4xl font-extrabold text-pb-text tracking-tight">{stock.symbol}</h2>
                        <p className="text-pb-text-muted font-semibold uppercase tracking-widest text-xs mt-1">{stock.companyName.replace(" (Live API)", "")}</p>
                    </div>
                    <button
                        onClick={toggleWatchlist}
                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border shadow-sm ${
                            isAdded
                                ? "bg-pb-surface text-pb-text-sec border-pb-border hover:border-pb-loss hover:text-pb-loss"
                                : "bg-pb-accent text-pb-bg border-pb-accent hover:bg-pb-accent-hover"
                        }`}
                    >
                        {isAdded ? "Remove" : "Add to List"}
                    </button>
                </div>

                <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-end pb-4 border-b border-pb-border-divider">
                        <span className="text-pb-text-sec font-semibold tracking-wide uppercase text-sm">Current Price</span>
                        <span className="text-4xl font-bold text-pb-text tabular-nums">
                            ₹{stock.currentPrice.toLocaleString('en-IN', {minimumFractionDigits:2})}
                        </span>
                    </div>
                </div>

                <div className="rounded-xl overflow-hidden border border-pb-border bg-pb-surface">
                    <div className="p-4 border-b border-pb-border-divider text-xs font-bold text-pb-text-muted uppercase tracking-widest">
                        Price Trend (7 Days)
                    </div>
                    <div className="p-5 bg-pb-card">
                        <div className="h-32 flex items-end justify-between gap-2">
                            {[30, 60, 45, 80, 55, 95, 70].map((bar, i) => (
                                <div
                                    key={i}
                                    className="flex-1 bg-pb-profit/80 hover:bg-pb-profit rounded-t transition-colors"
                                    style={{ height: `${bar}%` }}
                                />
                            ))}
                        </div>
                        <div className="flex justify-between text-[10px] uppercase font-bold text-pb-border-hover mt-4">
                            <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    );
};

export default StockModal;