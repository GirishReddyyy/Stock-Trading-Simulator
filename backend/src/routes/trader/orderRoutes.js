import express from "express";

import protect from "../../middleware/authMiddleware.js";
import authorize from "../../middleware/roleMiddleware.js";

import {
  placeOrder,
  getOrders,
  cancelOrder,
} from "../../controllers/trader/orderController.js";

import {
  buyStock,
  sellStock,
} from "../../controllers/trader/tradeController.js";

const router = express.Router();

router.post("/buy", protect, authorize("trader", "admin"), buyStock);
router.post("/sell", protect, authorize("trader", "admin"), sellStock);
router.post("/limit", protect, authorize("trader", "admin"), placeOrder);
router.post("/", protect, authorize("trader", "admin"), placeOrder);
router.get("/", protect, getOrders);
router.put("/:id/cancel", protect, cancelOrder);

export default router;
