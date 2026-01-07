import express from "express";
import Stripe from "stripe";
import User from "../models/User.js";
import { STRIPE_PLANS } from "../config/stripePlans.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * POST /api/billing/change-plan
 * Body: { newPriceId }
 */
router.post("/change-plan", async (req, res) => {
  try {
    const userId = req.user.id; // 🔒 auth middleware
    const { newPriceId } = req.body;

    // 🔒 Allow only known plans
    if (!STRIPE_PLANS[newPriceId]) {
      return res.status(400).json({ error: "Invalid plan" });
    }

    const user = await User.findById(userId);
    if (!user || !user.stripeCustomerId) {
      return res.status(400).json({ error: "User not found" });
    }

    // Get active subscription
    const subscriptions = await stripe.subscriptions.list({
      customer: user.stripeCustomerId,
      status: "active",
      limit: 1,
    });

    const subscription = subscriptions.data[0];
    if (!subscription) {
      return res.status(400).json({ error: "No active subscription" });
    }

    // Update subscription (NO PRORATION)
    await stripe.subscriptions.update(subscription.id, {
      items: [
        {
          id: subscription.items.data[0].id,
          price: newPriceId,
        },
      ],
      proration_behavior: "none",
    });

    res.json({
      success: true,
      message: "Plan will change on next billing cycle",
    });
  } catch (err) {
    console.error("Change plan error:", err);
    res.status(500).json({ error: "Plan change failed" });
  }
});

export default router;
