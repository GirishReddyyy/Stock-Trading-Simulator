import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Navbar from "../components/layout/Navbar.jsx";
import Loader from "../components/ui/Loader.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import { getOrders, cancelOrder } from "../api/traderApi.js";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadOrders = async () => {
        try {
            const res = await getOrders();
            setOrders(res.data.orders || []);
        } catch (error) {
            toast.error(error.response?.data?.message || "Orders load failed");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const handleCancel = async (id) => {
        try {
            await cancelOrder(id);
            toast.success("Order cancelled successfully");
            loadOrders(); // reload
        } catch (error) {
            toast.error(error.response?.data?.message || "Cancellation failed");
        }
    };

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
                    Your Orders
                </h1>

                <div className="bg-pb-card rounded-2xl shadow-[0_4px_14px_rgba(0,0,0,0.35)] border border-pb-border overflow-hidden">
                    <div className="p-6 border-b border-pb-border-divider bg-pb-card-hover/30">
                        <h2 className="text-lg font-bold text-pb-text tracking-wide uppercase">Order History & Limits</h2>
                    </div>
                    {orders.length === 0 ? (
                        <div className="p-10">
                            <EmptyState
                                title="No Orders"
                                subtitle="Your active and past orders will appear here"
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
                                        <th className="p-5 text-right">Limit Price</th>
                                        <th className="p-5">Status</th>
                                        <th className="p-5">Date</th>
                                        <th className="p-5 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-pb-border-divider">
                                    {orders.map((order) => (
                                        <tr key={order._id} className="hover:bg-pb-card-hover transition-colors group">
                                            <td className="p-5 font-bold text-pb-text">
                                                {order.stock?.symbol}
                                            </td>
                                            <td className={`p-5 font-bold tracking-wider ${
                                                order.orderType === "BUY" ? "text-pb-profit" : "text-pb-loss"
                                            }`}>
                                                {order.orderType}
                                            </td>
                                            <td className="p-5 text-right font-medium text-pb-text-sec">{order.quantity}</td>
                                            <td className="p-5 text-right font-semibold tabular-nums">₹{order.limitPrice?.toLocaleString('en-IN', {minimumFractionDigits:2}) || 0}</td>
                                            <td className="p-5">
                                                <span className={`inline-block px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                                                    order.status === 'PENDING' ? 'bg-pb-warn/15 text-pb-warn' :
                                                    order.status === 'EXECUTED' ? 'bg-pb-profit/15 text-pb-profit' :
                                                    'bg-pb-surface text-pb-text-muted border border-pb-border'
                                                }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="p-5 font-medium text-pb-text-muted text-sm tabular-nums">
                                                {new Date(order.createdAt).toLocaleString()}
                                            </td>
                                            <td className="p-5 text-center">
                                                {order.status === "PENDING" && (
                                                    <button
                                                        onClick={() => handleCancel(order._id)}
                                                        className="bg-pb-surface text-pb-loss border border-pb-border hover:bg-pb-loss hover:text-pb-bg px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Orders;
