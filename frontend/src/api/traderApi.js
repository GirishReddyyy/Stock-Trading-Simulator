import API from "./axios.js";

/* AUTH */

export const login =
    (data) =>
        API.post(
            "/auth/login",
            data
        );

export const updateProfile =
    (data) =>
        API.put(
            "/auth/me",
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

export const getExternalStock =
    (symbol) =>
        API.get(
            `/trader/stock/${symbol}`
        );

export default API;