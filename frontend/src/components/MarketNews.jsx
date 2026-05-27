import { useEffect, useState } from "react";

const MarketNews = () => {

    const [news,
        setNews] =
        useState([]);

    useEffect(() => {

        const dummyNews = [

            {
                title:
                    "Tech stocks rally as market opens higher",
                sentiment:
                    "Bullish"
            },

            {
                title:
                    "Investors cautious over inflation data",
                sentiment:
                    "Neutral"
            },

            {
                title:
                    "Energy sector faces selling pressure",
                sentiment:
                    "Bearish"
            }

        ];

        setNews(
            dummyNews
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
                Market News
            </h2>

            <div className="space-y-4">

                {
                    news.map(
                        (
                            item,
                            index
                        ) => (

                            <div
                                key={index}
                                className="
                                    border-b
                                    pb-3
                                "
                            >

                                <h3
                                    className="
                                        font-semibold
                                    "
                                >
                                    {
                                        item.title
                                    }
                                </h3>

                                <span
                                    className={`
                                        inline-block
                                        mt-2
                                        px-3
                                        py-1
                                        rounded-full
                                        text-sm
                                        text-white
                                        ${
                                            item.sentiment ===
                                            "Bullish"
                                                ? "bg-green-500"
                                                : item.sentiment ===
                                                  "Bearish"
                                                ? "bg-red-500"
                                                : "bg-yellow-500"
                                        }
                                    `}
                                >
                                    {
                                        item.sentiment
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

export default MarketNews;