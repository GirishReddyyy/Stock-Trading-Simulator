import express from "express";
const router = express.Router();

import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

router.get(
    "/admin-test",
    protect,
    authorize("admin"),
    (req, res) => {
        res.json({
            success: true,
            message: "Welcome Admin"
        });
    }
);

router.get(
    "/trader-test",
    protect,
    authorize("trader", "admin"),
    (req, res) => {
        res.json({
            success: true,
            message: "Welcome Trader"
        });
    }
);

export default router;