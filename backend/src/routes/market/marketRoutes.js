import express from "express";

import {
  getMarketStocks,
  getMarketStockById,
} from "../../controllers/market/marketController.js";

const router = express.Router();

router.get("/stocks", getMarketStocks);

router.get("/stocks/:id", getMarketStockById);

export default router;
