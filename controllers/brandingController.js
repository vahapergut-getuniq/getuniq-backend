import { buildBrandPrompt } from "../utils/ai/promptBuilder.js";
import { generateBrandText } from "../utils/ai/openai.js";
import { generateBrandImage } from "../utils/ai/leonardo.js";


// ======================================================
// GENERATE BRANDING AI
// ======================================================

export const generateBrandingAI = async (req, res) => {
  try {
    const { industry, keywords, tone } = req.body;

    // 1️⃣ Validation
    if (!industry || !keywords || !tone) {
      return res.status(400).json({
        success: false,
        error: "MISSING_REQUIRED_FIELDS",
      });
    }

    // 2️⃣ Prompt
    const prompt = buildBrandPrompt({
      industry,
      keywords,
      style: tone,
    });

    // 3️⃣ Text AI (OpenAI)
    const text = await generateBrandText(prompt);

    // 4️⃣ Image AI (Leonardo)
    const images = await generateBrandImage(
      `Luxury logo design. ${keywords}. ${tone}`
    );

    return res.json({
      success: true,
      data: {
        text,
        images,
      },
    });

  } catch (err) {
    console.error("AI branding error:", err.message || err);

    return res.status(500).json({
      success: false,
      error: "AI_BRANDING_FAILED",
    });
  }
};


// ======================================================
// GET BRANDING SAMPLES
// ======================================================

export const getBrandingSamples = async (req, res) => {
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

    return res.status(200).json({
      success: true,
      data: samples
    });

  } catch (err) {
    console.error("GET_BRANDING_SAMPLES_ERROR:", err);

    return res.status(500).json({
      success: false,
      error: "FAILED_TO_FETCH_SAMPLES"
    });
  }
};