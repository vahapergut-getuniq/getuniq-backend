import express from "express";
import { signup, login, getMe } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// PUBLIC
router.post("/signup", signup);
router.post("/login", login);

// PRIVATE
router.get("/me", authMiddleware, getMe);

export default router;
