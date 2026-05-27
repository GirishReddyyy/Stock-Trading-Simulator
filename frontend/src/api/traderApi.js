import axios from "axios";

const API =
    axios.create({
        baseURL:
            "http://localhost:5000/api"
    });

API.interceptors.request.use(
    (config) => {

        const token =
            localStorage.getItem(
                "token"
            );

        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    }
);

/* AUTH */

export const login =
    (data) =>
        API.post(
            "/auth/login",
            data
        );

/* DASHBOARD */

export const getDashboard =
    () =>
        API.get(
            "/trader/dashboard"
        );

/* MARKET */

export const getMarketStocks =
    () =>
        API.get(
            "/trader/stocks"
        );

/* MARKET BUY/SELL */

export const buyStock =
    (data) =>
        API.post(
            "/trader/orders/buy",
            data
        );

export const sellStock =
    (data) =>
        API.post(
            "/trader/orders/sell",
            data
        );

/* LIMIT ORDERS */

export const placeLimitOrder =
    (data) =>
        API.post(
            "/trader/orders/limit",
            data
        );

/* ORDERS */

export const getOrders =
    () =>
        API.get(
            "/trader/orders"
        );

export const cancelOrder =
    (id) =>
        API.put(
            `/trader/orders/${id}/cancel`
        );

/* PORTFOLIO */

export const getPortfolio =
    () =>
        API.get(
            "/trader/portfolio"
        );

/* TRANSACTIONS */

export const getTransactions =
    () =>
        API.get(
            "/trader/transactions"
        );

/* ANALYTICS */

export const getAnalytics =
    () =>
        API.get(
            "/trader/analytics"
        );

export default API;