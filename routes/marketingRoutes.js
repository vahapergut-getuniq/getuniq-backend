// routes/marketingRoutes.js

import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { exportMarketingPDF } from "../controllers/marketingController.js";

const router = express.Router();

/* ============================================================
   MARKETING — PDF EXPORT
   POST /api/marketing/pdf
   Body: { projectId, data }
   Auth: Required
============================================================ */

// Eğer PDF sadece login olmuş kullanıcılara açıksa:
router.post("/pdf", authMiddleware, exportMarketingPDF);

// Eğer public kullanılacaksa (opsiyonel):
// router.post("/pdf", exportMarketingPDF);

export default router;
