import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import stripeWebhook from "./routes/stripeWebhook.js";
import testCreditRoutes from "./routes/testCredits.js"; // 👈 EKLENDİ

dotenv.config();

const app = express();

/* ===============================
   STRIPE WEBHOOK (RAW BODY)
================================ */
app.use("/stripe", stripeWebhook);

/* ===============================
   MIDDLEWARE
================================ */
app.use(cors());
app.use(express.json());

/* ===============================
   ROUTES
================================ */
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/test", testCreditRoutes); // 👈 EKLENDİ

const PORT = process.env.PORT || 3001;

/* ===============================
   START SERVER
================================ */
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
