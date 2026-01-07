import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { useCredits } from "../utils/useCredits.js";
import { CREDIT_COSTS } from "../config/creditCosts.js";

const router = express.Router();

router.post("/credit", authMiddleware, async (req, res) => {
  try {
    const remainingCredits = await useCredits({
      userId: req.user.id,
      amount: CREDIT_COSTS.branding.generate, // 20
      source: "test_generate",
      refId: "TEST",
    });

    res.json({
      success: true,
      remainingCredits,
    });
  } catch (err) {
    if (err.message === "INSUFFICIENT_CREDITS") {
      return res.status(402).json({ error: "Not enough credits" });
    }

    res.status(500).json({ error: err.message });
  }
});

export default router;
