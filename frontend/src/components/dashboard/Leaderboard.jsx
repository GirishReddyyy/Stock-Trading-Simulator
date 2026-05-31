import { useEffect, useState } from "react";

const Leaderboard = () => {

    const [leaders,
        setLeaders] =
        useState([]);

    useEffect(() => {

        const data = [

            {
                name:
                    "Rahul",
                pnl:
                    45200
            },

            {
                name:
                    "Aman",
                pnl:
                    31800
            },

            {
                name:
                    "Sneha",
                pnl:
                    28900
            },

            {
                name:
                    "You",
                pnl:
                    12500
            }

        ];

        data.sort(
            (a, b) =>
                b.pnl -
                a.pnl
        );

        setLeaders(
            data
        );

    }, []);

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
                Top Traders
            </h2>

            <div className="space-y-3">

                {
                    leaders.map(
                        (
                            trader,
                            index
                        ) => (

                            <div
                                key={index}
                                className="
                                    flex
                                    justify-between
                                    items-center
                                    border-b
                                    pb-2
                                "
                            >

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-3
                                    "
                                >

                                    <span
                                        className="
                                            text-lg
                                            font-bold
                                        "
                                    >
                                        #
                                        {index + 1}
                                    </span>

                                    <span>
                                        {
                                            trader.name
                                        }
                                    </span>

                                </div>

                                <span
                                    className="
                                        text-green-600
                                        font-semibold
                                    "
                                >
                                    ₹
                                    {
                                        trader.pnl
                                    }
                                </span>

                            </div>
                        )
                    )
                }

            </div>

        </div>
    );
};

export default Leaderboard;