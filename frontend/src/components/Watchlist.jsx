import { useEffect, useState } from "react";

const Watchlist = ({
    stocks
}) => {

    const [watchlist,
        setWatchlist] =
        useState([]);

    useEffect(() => {

        const saved =
            JSON.parse(
                localStorage.getItem(
                    "watchlist"
                )
            ) || [];

        setWatchlist(
            saved
        );

    }, []);

    const toggleWatchlist =
        (
            stock
        ) => {

            let updated;

            const exists =
                watchlist.find(
                    (
                        item
                    ) =>
                        item._id ===
                        stock._id
                );

            if (exists) {

                updated =
                    watchlist.filter(
                        (
                            item
                        ) =>
                            item._id !==
                            stock._id
                    );

            } else {

                updated = [
                    ...watchlist,
                    stock
                ];
            }

            setWatchlist(
                updated
            );

            localStorage.setItem(
                "watchlist",
                JSON.stringify(
                    updated
                )
            );
        };

    return (

        <div
            className="
                bg-white
                rounded-xl
                shadow
                p-5
                mb-8
            "
        >

            <h2
                className="
                    text-2xl
                    font-semibold
                    mb-4
                "
            >
                Watchlist
            </h2>

            {
                stocks.map(
                    (
                        stock
                    ) => {

                        const saved =
                            watchlist.find(
                                (
                                    s
                                ) =>
                                    s._id ===
                                    stock._id
                            );

                        return (

                            <div
                                key={
                                    stock._id
                                }
                                className="
                                    flex
                                    justify-between
                                    items-center
                                    py-2
                                    border-b
                                "
                            >

                                <div>

                                    <h4
                                        className="
                                            font-semibold
                                        "
                                    >
                                        {
                                            stock.symbol
                                        }
                                    </h4>

                                    <p
                                        className="
                                            text-sm
                                            text-gray-500
                                        "
                                    >
                                        {
                                            stock.companyName
                                        }
                                    </p>

                                </div>

                                <button
                                    onClick={() =>
                                        toggleWatchlist(
                                            stock
                                        )
                                    }
                                    className={`
                                        px-3
                                        py-1
                                        rounded-lg
                                        text-sm
                                        text-white
                                        ${
                                            saved
                                                ? "bg-red-500"
                                                : "bg-green-500"
                                        }
                                    `}
                                >
                                    {
                                        saved
                                            ? "Remove"
                                            : "Add"
                                    }
                                </button>

                            </div>
                        );
                    }
                )
            }

        </div>
    );
};

export default Watchlist;