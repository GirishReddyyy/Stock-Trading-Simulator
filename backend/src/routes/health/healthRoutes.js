import express from "express";
const router = express.Router();

import { healthCheck } from "../../controllers/health/healthController.js";

router.get("/", healthCheck);

export default router;
