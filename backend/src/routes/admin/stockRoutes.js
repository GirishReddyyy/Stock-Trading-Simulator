import express from "express";
const router = express.Router();

import protect from "../../middleware/authMiddleware.js";
import authorize from "../../middleware/roleMiddleware.js";

import {
    createStock
} from "../../controllers/admin/stockController.js";

router.post(
    "/stocks",
    protect,
    authorize("admin"),
    createStock
);

export default router;