import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Navbar from "../components/Navbar.jsx";
import Loader from "../components/Loader.jsx";

import { getTransactions } from "../api/traderApi.js";

import TradeHistoryFilters
from "../components/TradeHistoryFilters.jsx";

import EmptyState
from "../components/EmptyState.jsx";

const Transactions = () => {

    const [transactions,
        setTransactions] =
        useState([]);

    const [loading,
        setLoading] =
        useState(true);

    const [filters,
        setFilters] =
        useState({});

    useEffect(() => {

        loadTransactions();

    }, []);

    const loadTransactions =
        async () => {

            try {

                const res =
                    await getTransactions();

                setTransactions(
                    res.data.transactions
                );

            } catch (
                error
            ) {

                toast.error(
                    error.response?.data?.message ||
                    "Transaction load failed"
                );

            } finally {

                setLoading(
                    false
                );
            }
        };

    const filtered =
        transactions.filter(
            (tx) => {

                if (
                    filters.type &&
                    tx.type !==
                    filters.type
                )
                    return false;

                if (
                    filters.status &&
                    tx.status !==
                    filters.status
                )
                    return false;

                return true;
            }
        );

    if (loading) {

        return (

            <div className="min-h-screen bg-slate-100">

                <Navbar />

                <Loader />

            </div>
        );
    }

    return (

        <div className="min-h-screen bg-slate-100">

            <Navbar />

            <div className="p-6">

                <h1
                    className="
                        text-3xl
                        font-bold
                        mb-6
                    "
                >
                    Transaction History
                </h1>

                <TradeHistoryFilters
                    onFilter={
                        setFilters
                    }
                />

                <div
                    className="
                        bg-white
                        rounded-xl
                        shadow
                        overflow-hidden
                    "
                >

                    {
                        filtered.length === 0 ? (

                            <div className="p-6">

                                <EmptyState
                                    title="No Transactions"
                                    subtitle="Trades will appear here"
                                />

                            </div>

                        ) : (

                            <table className="w-full">

                                <thead
                                    className="
                                        bg-slate-200
                                    "
                                >

                                    <tr>

                                        <th className="p-4 text-left">
                                            Stock
                                        </th>

                                        <th className="p-4 text-left">
                                            Type
                                        </th>

                                        <th className="p-4 text-left">
                                            Qty
                                        </th>

                                        <th className="p-4 text-left">
                                            Price
                                        </th>

                                        <th className="p-4 text-left">
                                            Total
                                        </th>

                                        <th className="p-4 text-left">
                                            Date
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {
                                        filtered.map(
                                            (tx) => {

                                                const total =
                                                    tx.price *
                                                    tx.quantity;

                                                return (

                                                    <tr
                                                        key={
                                                            tx._id
                                                        }
                                                        className="
                                                            border-t
                                                        "
                                                    >

                                                        <td
                                                            className="
                                                                p-4
                                                                font-semibold
                                                            "
                                                        >
                                                            {
                                                                tx.stock?.symbol
                                                            }
                                                        </td>

                                                        <td
                                                            className={`
                                                                p-4
                                                                font-semibold
                                                                ${
                                                                    tx.type ===
                                                                    "BUY"
                                                                        ? "text-green-600"
                                                                        : "text-red-600"
                                                                }
                                                            `}
                                                        >
                                                            {
                                                                tx.type
                                                            }
                                                        </td>

                                                        <td className="p-4">
                                                            {
                                                                tx.quantity
                                                            }
                                                        </td>

                                                        <td className="p-4">
                                                            ₹
                                                            {
                                                                tx.price.toFixed(
                                                                    2
                                                                )
                                                            }
                                                        </td>

                                                        <td className="p-4">
                                                            ₹
                                                            {
                                                                total.toFixed(
                                                                    2
                                                                )
                                                            }
                                                        </td>

                                                        <td className="p-4">
                                                            {
                                                                new Date(
                                                                    tx.createdAt
                                                                ).toLocaleString()
                                                            }
                                                        </td>

                                                    </tr>
                                                );
                                            }
                                        )
                                    }

                                </tbody>

                            </table>
                        )
                    }

                </div>

            </div>

        </div>
    );
};

export default Transactions;