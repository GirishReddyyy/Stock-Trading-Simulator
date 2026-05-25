import express from "express";
import protect from "../../middleware/authMiddleware.js";
import authorize from "../../middleware/roleMiddleware.js";

import {
    createStock,
    getAllStocks,
    getSingleStock,
    updateStock,
    deactivateStock
} from "../../controllers/admin/stockController.js";

const router = express.Router();

router.post(
    "/stocks",
    protect,
    authorize("admin"),
    createStock
);

router.get(
    "/stocks",
    protect,
    authorize("admin"),
    getAllStocks
);

router.get(
    "/stocks/:id",
    protect,
    authorize("admin"),
    getSingleStock
);

router.put(
    "/stocks/:id",
    protect,
    authorize("admin"),
    updateStock
);

router.delete(
    "/stocks/:id",
    protect,
    authorize("admin"),
    deactivateStock
);

export default router;