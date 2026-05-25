import { useEffect, useState } from "react";
import axios from "axios";
import socket from "../services/socket";

const Home = () => {

    const [stocks, setStocks] =
        useState([]);

    useEffect(() => {

        fetchStocks();

        socket.on(
            "priceUpdate",
            (
                updatedStock
            ) => {

                setStocks(
                    (
                        prevStocks
                    ) =>
                        prevStocks.map(
                            (
                                stock
                            ) =>
                                stock._id ===
                                updatedStock.stockId
                                    ? {
                                          ...stock,
                                          currentPrice:
                                              updatedStock.currentPrice
                                      }
                                    : stock
                        )
                );
            }
        );

        return () => {
            socket.off(
                "priceUpdate"
            );
        };

    }, []);

    const fetchStocks =
        async () => {

            try {

                const res =
                    await axios.get(
                        "http://localhost:5000/api/market/stocks"
                    );

                setStocks(
                    res.data.stocks
                );

            } catch (error) {

                console.log(
                    error
                );

            }
        };

    return (
        <div
            style={{
                padding: 30
            }}
        >
            <h1>
                Stock Trading Simulator
            </h1>

            <h2>
                Live Market
            </h2>

            {
                stocks.map(
                    (
                        stock
                    ) => (
                        <div
                            key={
                                stock._id
                            }
                            style={{
                                border:
                                    "1px solid gray",
                                padding: 10,
                                marginBottom: 10
                            }}
                        >
                            <h3>
                                {
                                    stock.symbol
                                }
                            </h3>

                            <p>
                                {
                                    stock.companyName
                                }
                            </p>

                            <p>
                                ₹
                                {
                                    stock.currentPrice
                                }
                            </p>
                        </div>
                    )
                )
            }
        </div>
    );
};

export default Home;