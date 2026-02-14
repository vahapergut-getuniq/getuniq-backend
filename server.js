import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import testCreditRoutes from "./routes/testCredits.js";
import brandingRoutes from "./routes/brandingRoutes.js"; // ✅ EKLENDİ

// Stripe webhook SADECE key varsa yüklenecek
import stripeWebhook from "./routes/stripeWebhook.js";

dotenv.config();

const app = express();

/* ===============================
   STRIPE WEBHOOK (RAW BODY)
   ⚠️ SADECE STRIPE VARSA
================================ */
if (process.env.STRIPE_WEBHOOK_SECRET) {
  app.use("/stripe", stripeWebhook);
  console.log("💳 Stripe webhook enabled");
} else {
  console.log("💤 Stripe webhook disabled (no env keys)");
}

/* ===============================
   MIDDLEWARE
================================ */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://getuniqbucet.s3.eu-north-1.amazonaws.com",
      "https://getuniqbucet.s3.eu-north-1.amazonaws.com",
      "http://getuniq.ai",
      "https://getuniq.ai",
    ],
    credentials: true,
  })
);

app.use(express.json());

/* ===============================
   HEALTH CHECK
================================ */
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    env: process.env.NODE_ENV,
    stripe: !!process.env.STRIPE_SECRET_KEY,
  });
});

/* ===============================
   ROUTES
================================ */
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/test", testCreditRoutes);
app.use("/api/branding", brandingRoutes); // ✅ EKLENDİ

/* ===============================
   START SERVER
================================ */
const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Backend running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Server start failed:", err.message);
    process.exit(1);
  }
};

startServer();