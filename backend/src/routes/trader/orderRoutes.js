import express from "express";

import protect from "../../middleware/authMiddleware.js";

import {
  placeOrder,
  getOrders,
  cancelOrder,
} from "../../controllers/trader/orderController.js";

const router = express.Router();

// PLACE LIMIT ORDER

router.post("/", protect, placeOrder);

// GET USER ORDERS

router.get("/", protect, getOrders);

// CANCEL ORDER

router.put("/:id/cancel", protect, cancelOrder);

export default router;
