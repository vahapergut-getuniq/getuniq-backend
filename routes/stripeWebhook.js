import express from "express";
import Stripe from "stripe";
import User from "../models/User.js";
import CreditLedger from "../models/CreditLedger.js";
import {
  STRIPE_PLANS,
  STRIPE_CREDIT_PACKS,
} from "../config/stripePlans.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * STRIPE WEBHOOK
 * ⚠️ raw body REQUIRED
 * ⚠️ express.json() BU ROUTE'TAN ÖNCE ÇALIŞMAMALI
 */
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("❌ Stripe signature error:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      /* =====================================================
         SUBSCRIPTION EVENTS (RESET CREDIT)
      ===================================================== */
      if (
        event.type === "customer.subscription.created" ||
        event.type === "customer.subscription.updated" ||
        event.type === "invoice.paid"
      ) {
        const data = event.data.object;

        const priceId =
          data.items?.data?.[0]?.price?.id ||
          data.lines?.data?.[0]?.price?.id;

        const customerId = data.customer;

        const planConfig = STRIPE_PLANS[priceId];
        if (!planConfig) {
          return res.json({ received: true });
        }

        const user = await User.findOne({
          stripeCustomerId: customerId,
        });

        if (!user) {
          console.warn("⚠️ User not found for Stripe customer:", customerId);
          return res.json({ received: true });
        }

        // 🔁 CREDIT RESET (AYLIK PLAN)
        user.plan = planConfig.plan;
        user.credits = planConfig.monthlyCredits;
        await user.save();

        await CreditLedger.create({
          userId: user._id,
          type: "reset",
          source: "subscription",
          refId: event.id,
          amount: planConfig.monthlyCredits,
          balanceAfter: user.credits,
        });

        console.log(
          `🔁 Subscription reset → ${user.email} (${user.plan})`
        );
      }

      /* =====================================================
         ONE-TIME CREDIT PURCHASE (ADD CREDIT)
      ===================================================== */
      if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        const priceId = session.metadata?.priceId;
        if (!priceId) {
          return res.json({ received: true });
        }

        const pack = STRIPE_CREDIT_PACKS[priceId];
        if (!pack) {
          return res.json({ received: true });
        }

        const user = await User.findOne({
          stripeCustomerId: session.customer,
        });

        if (!user) {
          console.warn("⚠️ User not found for Stripe customer");
          return res.json({ received: true });
        }

        // ➕ CREDIT ADD
        user.credits += pack.credits;
        await user.save();

        await CreditLedger.create({
          userId: user._id,
          type: "earn",
          source: "credit_pack",
          refId: session.id,
          amount: pack.credits,
          balanceAfter: user.credits,
        });

        console.log(
          `➕ Credit pack added → ${user.email} (+${pack.credits})`
        );
      }

      res.json({ received: true });
    } catch (err) {
      console.error("❌ Stripe webhook handler error:", err);
      res.status(500).send("Webhook processing failed");
    }
  }
);

export default router;
