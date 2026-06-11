import express from "express";
const router = express.Router();

import {
  registerUser,
  loginUser,
  getMe,
  updateMe,
  changePassword,
} from "../../controllers/auth/authController.js";

import protect from "../../middleware/authMiddleware.js";

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);
router.put("/change-password", protect, changePassword);

export default router;
