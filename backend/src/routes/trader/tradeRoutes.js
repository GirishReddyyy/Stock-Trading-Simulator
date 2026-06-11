import express from "express";

import protect from "../../middleware/authMiddleware.js";
import authorize from "../../middleware/roleMiddleware.js";

import {
  getPortfolio,
  getTransactions,
  getAnalytics,
  getDashboard,
  getExternalStock,
  getLeaderboard,
} from "../../controllers/trader/tradeController.js";

const router = express.Router();

router.get("/portfolio", protect, authorize("trader", "admin"), getPortfolio);

router.get("/transactions", protect, authorize("trader", "admin"), getTransactions);

router.get("/analytics", protect, authorize("trader", "admin"), getAnalytics);

router.get("/dashboard", protect, authorize("trader", "admin"), getDashboard);

router.get("/stock/:symbol", protect, authorize("trader", "admin"), getExternalStock);

router.get("/leaderboard", protect, getLeaderboard);

export default router;
