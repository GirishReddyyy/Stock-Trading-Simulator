import { useState } from "react";

const TradeHistoryFilters = ({ onFilter }) => {
    const [type, setType] = useState("");
    const [status, setStatus] = useState("");

    const applyFilter = () => {
        onFilter({
            type,
            status
        });
    };

    return (
        <div className="bg-pb-card rounded-2xl shadow-[0_4px_14px_rgba(0,0,0,0.35)] border border-pb-border p-6 flex flex-col md:flex-row gap-4 items-center">
            <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full md:w-auto bg-pb-bg border border-pb-border rounded-xl px-4 py-3 text-pb-text font-bold focus:outline-none focus:ring-2 focus:ring-pb-accent focus:border-transparent transition-all uppercase tracking-widest text-xs"
            >
                <option value="">All Types</option>
                <option value="BUY">BUY</option>
                <option value="SELL">SELL</option>
            </select>

            <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full md:w-auto bg-pb-bg border border-pb-border rounded-xl px-4 py-3 text-pb-text font-bold focus:outline-none focus:ring-2 focus:ring-pb-accent focus:border-transparent transition-all uppercase tracking-widest text-xs"
            >
                <option value="">All Status</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="PENDING">PENDING</option>
                <option value="CANCELLED">CANCELLED</option>
            </select>

            <button
                onClick={applyFilter}
                className="w-full md:w-auto ml-auto px-6 py-3 bg-pb-accent text-pb-bg hover:bg-pb-accent-hover font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-sm"
            >
                Apply
            </button>
        </div>
    );
};

export default TradeHistoryFilters;