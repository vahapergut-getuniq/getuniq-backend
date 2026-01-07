import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { useCredits } from "../utils/useCredits.js";
import { CREDIT_COSTS } from "../config/creditCosts.js";

const router = express.Router();

/**
 * POST /api/branding/generate
 */
router.post("/generate", authMiddleware, async (req, res) => {
  try {
    const remainingCredits = await useCredits({
      userId: req.user.id,
      amount: CREDIT_COSTS.branding.generate, // 20
      source: "branding_generate",
      refId: "branding_generate",
    });

    // şimdilik mock response (AI kısmı sonra)
    return res.json({
      success: true,
      message: "Branding generate OK",
      remainingCredits,
      cost: CREDIT_COSTS.branding.generate,
    });
  } catch (err) {
    if (err.message === "INSUFFICIENT_CREDITS") {
      return res.status(402).json({
        error: "INSUFFICIENT_CREDITS",
        required: CREDIT_COSTS.branding.generate,
      });
    }

    if (err.message === "USER_NOT_FOUND") {
      return res.status(404).json({ error: "USER_NOT_FOUND" });
    }

    console.error("branding/generate error:", err);
    return res.status(500).json({ error: "BRANDING_GENERATE_FAILED" });
  }
});

export default router;
