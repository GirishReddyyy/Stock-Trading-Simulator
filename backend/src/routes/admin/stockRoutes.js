import express from "express";
import protect from "../../middleware/authMiddleware.js";
import authorize from "../../middleware/roleMiddleware.js";

import {
  createStock,
  getAllStocks,
  getSingleStock,
  updateStock,
  deactivateStock,
} from "../../controllers/admin/stockController.js";

const router = express.Router();

/**
 * @route   POST /api/admin/stocks
 * @desc    Create a new stock
 * @access  Private/Admin
 */
router.post("/stocks", protect, authorize("admin"), createStock);

/**
 * @route   GET /api/admin/stocks
 * @desc    Get all stocks
 * @access  Private/Admin
 */
router.get("/stocks", protect, authorize("admin"), getAllStocks);

/**
 * @route   GET /api/admin/stocks/:id
 * @desc    Get a single stock by ID
 * @access  Private/Admin
 */
router.get("/stocks/:id", protect, authorize("admin"), getSingleStock);

/**
 * @route   PUT /api/admin/stocks/:id
 * @desc    Update a stock by ID
 * @access  Private/Admin
 */
router.put("/stocks/:id", protect, authorize("admin"), updateStock);

/**
 * @route   DELETE /api/admin/stocks/:id
 * @desc    Deactivate a stock by ID (soft delete)
 * @access  Private/Admin
 */
router.delete("/stocks/:id", protect, authorize("admin"), deactivateStock);

export default router;
