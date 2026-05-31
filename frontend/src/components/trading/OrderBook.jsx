import {
    useEffect,
    useState
} from "react";

import socket
    from "../../services/socket.js";

import {
    getOrders
} from "../../api/traderApi.js";

const OrderBook = () => {

    const [
        buyOrders,
        setBuyOrders
    ] =
        useState([]);

    const [
        sellOrders,
        setSellOrders
    ] =
        useState([]);

    useEffect(
        () => {

            loadOrderBook();

            socket.on(
                "orderExecuted",
                () => {
                    loadOrderBook();
                }
            );

            return () => {

                socket.off(
                    "orderExecuted"
                );
            };

        },
        []
    );

    const loadOrderBook =
        async () => {

            try {

                const res =
                    await getOrders();

                const pending =
                    res.data.orders.filter(
                        (
                            order
                        ) =>
                            order.status ===
                            "PENDING"
                    );

                setBuyOrders(
                    pending
                        .filter(
                            (
                                o
                            ) =>
                                o.type ===
                                "BUY"
                        )
                        .sort(
                            (
                                a,
                                b
                            ) =>
                                b.limitPrice -
                                a.limitPrice
                        )
                );

                setSellOrders(
                    pending
                        .filter(
                            (
                                o
                            ) =>
                                o.type ===
                                "SELL"
                        )
                        .sort(
                            (
                                a,
                                b
                            ) =>
                                a.limitPrice -
                                b.limitPrice
                        )
                );

            } catch (
                error
            ) {

                console.log(
                    error
                );
            }
        };

    return (

        <div
            className="
                grid
                md:grid-cols-2
                gap-5
                mt-8
            "
        >

            {/* BUY */}

            <div
                className="
                    bg-white
                    rounded-xl
                    shadow
                    p-5
                "
            >

                <h2
                    className="
                        text-xl
                        font-bold
                        text-green-600
                        mb-4
                    "
                >
                    Buy Orders
                </h2>

                {
                    buyOrders.length ===
                    0 ? (

                        <p className="text-gray-500">
                            No pending buys
                        </p>

                    ) : (

                        <div className="space-y-3">

                            {
                                buyOrders.map(
                                    (
                                        order
                                    ) => (

                                        <div
                                            key={
                                                order._id
                                            }
                                            className="
                                                border
                                                rounded-lg
                                                p-3
                                            "
                                        >

                                            <div
                                                className="
                                                    flex
                                                    justify-between
                                                "
                                            >

                                                <span className="font-semibold">
                                                    {
                                                        order
                                                            .stock
                                                            ?.symbol
                                                    }
                                                </span>

                                                <span>
                                                    ₹
                                                    {
                                                        order.limitPrice
                                                    }
                                                </span>

                                            </div>

                                            <p
                                                className="
                                                    text-sm
                                                    text-gray-500
                                                "
                                            >
                                                Qty:
                                                {
                                                    order.quantity
                                                }
                                            </p>

                                        </div>
                                    )
                                )
                            }

                        </div>
                    )
                }

            </div>

            {/* SELL */}

            <div
                className="
                    bg-white
                    rounded-xl
                    shadow
                    p-5
                "
            >

                <h2
                    className="
                        text-xl
                        font-bold
                        text-red-600
                        mb-4
                    "
                >
                    Sell Orders
                </h2>

                {
                    sellOrders.length ===
                    0 ? (

                        <p className="text-gray-500">
                            No pending sells
                        </p>

                    ) : (

                        <div className="space-y-3">

                            {
                                sellOrders.map(
                                    (
                                        order
                                    ) => (

                                        <div
                                            key={
                                                order._id
                                            }
                                            className="
                                                border
                                                rounded-lg
                                                p-3
                                            "
                                        >

                                            <div
                                                className="
                                                    flex
                                                    justify-between
                                                "
                                            >

                                                <span className="font-semibold">
                                                    {
                                                        order
                                                            .stock
                                                            ?.symbol
                                                    }
                                                </span>

                                                <span>
                                                    ₹
                                                    {
                                                        order.limitPrice
                                                    }
                                                </span>

                                            </div>

                                            <p
                                                className="
                                                    text-sm
                                                    text-gray-500
                                                "
                                            >
                                                Qty:
                                                {
                                                    order.quantity
                                                }
                                            </p>

                                        </div>
                                    )
                                )
                            }

                        </div>
                    )
                }

            </div>

        </div>
    );
};

export default OrderBook;