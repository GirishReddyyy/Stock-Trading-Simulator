import express from "express";

import protect from "../../middleware/authMiddleware.js";
import authorize from "../../middleware/roleMiddleware.js";

import {
    buyStock,
    sellStock,
    getPortfolio,
    getTransactions,
    getAnalytics,
    placeOrder,
    getOrders,
    getDashboard
} from "../../controllers/trader/tradeController.js";

const router =
    express.Router();

router.post(
    "/buy",
    protect,
    authorize("trader","admin"),
    buyStock
);

router.post(
    "/sell",
    protect,
    authorize("trader","admin"),
    sellStock
);

router.post(
    "/orders",
    protect,
    authorize("trader","admin"),
    placeOrder
);

router.get(
    "/orders",
    protect,
    authorize("trader","admin"),
    getOrders
);

router.get(
    "/portfolio",
    protect,
    authorize("trader","admin"),
    getPortfolio
);

router.get(
    "/transactions",
    protect,
    authorize("trader","admin"),
    getTransactions
);

router.get(
    "/analytics",
    protect,
    authorize("trader","admin"),
    getAnalytics
);

router.get(
    "/dashboard",
    protect,
    authorize(
        "trader",
        "admin"
    ),
    getDashboard
);

export default router;