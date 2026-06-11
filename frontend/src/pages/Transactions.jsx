import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Navbar from "../components/layout/Navbar.jsx";
import Loader from "../components/ui/Loader.jsx";
import TradeHistoryFilters from "../components/TradeHistoryFilters.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import { getTransactions } from "../api/traderApi.js";

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({});

    const loadTransactions = async () => {
        try {
            const res = await getTransactions();
            setTransactions(res.data.transactions || []);
        } catch (error) {
            toast.error(error.response?.data?.message || "Transaction load failed");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTransactions();
    }, []);

    const filtered = (transactions || []).filter((tx) => {
        if (filters.type && tx.type !== filters.type) return false;
        
        // All transactions in the history are implicitly completed.
        // If filtering by status, only show them if status is COMPLETED.
        if (filters.status && filters.status !== "COMPLETED") return false;
        
        return true;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-pb-bg">
                <Navbar />
                <Loader />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-pb-bg font-['Inter'] pb-12">
            <Navbar />
            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-4xl font-extrabold mb-8 text-pb-text tracking-tight">
                    Transaction History
                </h1>

                <div className="mb-6">
                    <TradeHistoryFilters onFilter={setFilters} />
                </div>

                <div className="bg-pb-card rounded-2xl shadow-[0_4px_14px_rgba(0,0,0,0.35)] border border-pb-border overflow-hidden">
                    <div className="p-6 border-b border-pb-border-divider bg-pb-card-hover/30">
                        <h2 className="text-lg font-bold text-pb-text tracking-wide uppercase">All Transactions</h2>
                    </div>
                    {filtered.length === 0 ? (
                        <div className="p-10">
                            <EmptyState
                                title="No Transactions"
                                subtitle="Trades will appear here"
                            />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-pb-text text-left">
                                <thead className="bg-pb-surface text-pb-text-muted font-bold uppercase text-xs tracking-widest border-b border-pb-border-divider">
                                    <tr>
                                        <th className="p-5">Stock</th>
                                        <th className="p-5">Type</th>
                                        <th className="p-5 text-right">Qty</th>
                                        <th className="p-5 text-right">Price</th>
                                        <th className="p-5 text-right">Total</th>
                                        <th className="p-5">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-pb-border-divider">
                                    {filtered.map((tx) => {
                                        const total = tx.price * tx.quantity;
                                        return (
                                            <tr key={tx._id} className="hover:bg-pb-card-hover transition-colors group">
                                                <td className="p-5 font-bold text-pb-text">
                                                    {tx.stock?.symbol}
                                                </td>
                                                <td className={`p-5 font-bold tracking-wider ${
                                                    tx.type === "BUY" ? "text-pb-profit" : "text-pb-loss"
                                                }`}>
                                                    {tx.type}
                                                </td>
                                                <td className="p-5 text-right font-medium text-pb-text-sec">{tx.quantity}</td>
                                                <td className="p-5 text-right font-semibold tabular-nums">₹{tx.price.toLocaleString('en-IN', {minimumFractionDigits:2})}</td>
                                                <td className="p-5 text-right font-bold text-pb-text tabular-nums">₹{total.toLocaleString('en-IN', {minimumFractionDigits:2})}</td>
                                                <td className="p-5 font-medium text-pb-text-muted text-sm tabular-nums">
                                                    {new Date(tx.createdAt).toLocaleString()}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Transactions;