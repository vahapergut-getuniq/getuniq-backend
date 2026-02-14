import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { useCredits } from "../utils/useCredits.js";
import { CREDIT_COSTS } from "../config/creditCosts.js";
import { buildBrandPrompt } from "../utils/promptBuilder.js";
import Project from "../models/Project.js";

const router = express.Router();


// ======================================================
// GET /api/branding/samples
// ======================================================

router.get("/samples", async (req, res) => {
  try {
    const samples = [
      {
        id: "brandbook-10",
        title: "Brandbook – 10 Pages",
        pages: 10,
        previewUrl: "/samples/brandbook-10.pdf",
        creditsRequired: 40
      },
      {
        id: "brandbook-20",
        title: "Brandbook – 20 Pages",
        pages: 20,
        previewUrl: "/samples/brandbook-20.pdf",
        creditsRequired: 80
      },
      {
        id: "brandbook-20plus",
        title: "Brandbook – 20+ Pages",
        pages: 30,
        previewUrl: "/samples/brandbook-20plus.pdf",
        creditsRequired: 120
      }
    ];

    return res.json({
      success: true,
      data: samples
    });

  } catch (err) {
    console.error("branding/samples error:", err.message || err);

    return res.status(500).json({
      error: "BRANDING_SAMPLES_FAILED"
    });
  }
});


// ======================================================
// POST /api/branding/generate
// ======================================================

router.post("/generate", authMiddleware, async (req, res) => {
  const { projectId, pipeline = "fast", brief } = req.body;

  if (
    !projectId ||
    !brief ||
    !brief.industry ||
    !brief.keywords ||
    !brief.tone
  ) {
    return res.status(400).json({
      error: "INVALID_BRIEF",
    });
  }

  try {
    // 1️⃣ CREDIT DÜŞ
    const remainingCredits = await useCredits({
      userId: req.user.id,
      amount: CREDIT_COSTS.branding.generate,
      source: "branding_generate",
      refId: projectId,
    });

    // 2️⃣ PROMPT OLUŞTUR
    const prompt = buildBrandPrompt({
      industry: brief.industry,
      keywords: brief.keywords,
      style: brief.tone,
    });

    // 3️⃣ MOCK AI RESULT (AI layer geçici olarak kapalı)
    const brandText = {
      name: "Sample Brand",
      slogan: "Luxury Redefined",
      description: `Premium brand concept for ${brief.industry}`
    };

    const images = [];

    const aiResult = {
      prompt,
      text: brandText,
      images,
      generatedAt: new Date(),
    };

    // 4️⃣ PROJECT’E YAZ
    const project = await Project.findByIdAndUpdate(
      projectId,
      {
        $set: {
          [`pipelines.branding.${pipeline}.data.generate`]: aiResult,
        },
        $addToSet: {
          [`pipelines.branding.${pipeline}.steps`]: "generate",
        },
      },
      { new: true }
    );

    if (!project) {
      throw new Error("PROJECT_NOT_FOUND");
    }

    return res.json({
      success: true,
      cost: CREDIT_COSTS.branding.generate,
      remainingCredits,
      data: aiResult,
    });

  } catch (err) {
    console.error("branding/generate error:", err.message || err);

    if (err.message === "INSUFFICIENT_CREDITS") {
      return res.status(402).json({
        error: "INSUFFICIENT_CREDITS",
        required: CREDIT_COSTS.branding.generate,
      });
    }

    if (err.message === "USER_NOT_FOUND") {
      return res.status(404).json({ error: "USER_NOT_FOUND" });
    }

    if (err.message === "PROJECT_NOT_FOUND") {
      return res.status(404).json({ error: "PROJECT_NOT_FOUND" });
    }

    return res.status(500).json({
      error: "BRANDING_GENERATE_FAILED",
    });
  }
});

export default router;