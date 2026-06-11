import { useEffect, useState } from "react";

const Watchlist = ({ stocks }) => {
    const [watchlist, setWatchlist] = useState([]);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("watchlist")) || [];
        setWatchlist(saved);
    }, []);

    const toggleWatchlist = (stock) => {
        let updated;
        const exists = watchlist.find((item) => item._id === stock._id);
        if (exists) {
            updated = watchlist.filter((item) => item._id !== stock._id);
        } else {
            updated = [...watchlist, stock];
        }
        setWatchlist(updated);
        localStorage.setItem("watchlist", JSON.stringify(updated));
    };

    return (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100">
                {stocks.slice(0, 8).map((stock) => {
                    const saved = watchlist.find((s) => s._id === stock._id);
                    return (
                        <div key={stock._id} className="flex justify-between items-center px-5 py-3 hover:bg-slate-50 transition-colors group">
                            <div>
                                <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{stock.symbol}</h4>
                                <p className="text-xs font-medium text-slate-500 truncate max-w-[150px]">{stock.companyName.replace(" (Live API)", "")}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <p className="font-bold text-slate-900">₹{stock.currentPrice.toLocaleString('en-IN', {minimumFractionDigits:2})}</p>
                                <button
                                    onClick={() => toggleWatchlist(stock)}
                                    className={`px-2.5 py-1 rounded text-xs font-bold transition-colors border ${
                                        saved
                                            ? "bg-slate-50 text-slate-600 border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                                            : "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-600 hover:text-white"
                                    }`}
                                >
                                    {saved ? "Remove" : "Add"}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Watchlist;