import express from "express";
import Stripe from "stripe";
import User from "../models/User.js";
import CreditLedger from "../models/CreditLedger.js";
import {
  STRIPE_PLANS,
  STRIPE_CREDIT_PACKS,
} from "../config/stripePlans.js";

const router = express.Router();

/* =====================================================
   STRIPE INIT (GUARDED)
===================================================== */
let stripe = null;

if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  console.log("💳 Stripe webhook ENABLED");
} else {
  console.log("💤 Stripe webhook DISABLED (missing env keys)");
}

/* =====================================================
   WEBHOOK ROUTE
===================================================== */
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    if (!stripe) {
      return res.json({ received: true });
    }

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
      return res.status(400).send(`Webhook Error`);
    }

    try {
      /* =====================================================
         IDEMPOTENCY CHECK
      ===================================================== */
      const alreadyProcessed = await CreditLedger.findOne({
        refId: event.id,
      });

      if (alreadyProcessed) {
        return res.json({ received: true });
      }

      /* =====================================================
         SUBSCRIPTION MONTHLY CREDIT RESET
         (ONLY REAL BILLING CYCLE)
      ===================================================== */
      if (
        event.type === "invoice.payment_succeeded" &&
        event.data.object.billing_reason === "subscription_cycle"
      ) {
        const invoice = event.data.object;
        const priceId = invoice.lines?.data?.[0]?.price?.id;
        const customerId = invoice.customer;

        const planConfig = STRIPE_PLANS[priceId];
        if (!planConfig) return res.json({ received: true });

        const user = await User.findOne({
          stripeCustomerId: customerId,
        });

        if (!user) return res.json({ received: true });

        const previousBalance = user.credits;

        user.plan = planConfig.plan;
        user.credits = planConfig.monthlyCredits;
        user.isPaid = true;

        await user.save();

        await CreditLedger.create({
          userId: user._id,
          type: "reset",
          source: "subscription_cycle",
          refId: event.id,
          amount: planConfig.monthlyCredits,
          previousBalance,
          balanceAfter: user.credits,
        });

        console.log(`🔁 Monthly credit reset → ${user.email}`);
      }

      /* =====================================================
         ONE-TIME CREDIT PACK PURCHASE
      ===================================================== */
      if (
        event.type === "checkout.session.completed" &&
        event.data.object.mode === "payment"
      ) {
        const session = event.data.object;
        const priceId = session.metadata?.priceId;

        if (!priceId) return res.json({ received: true });

        const pack = STRIPE_CREDIT_PACKS[priceId];
        if (!pack) return res.json({ received: true });

        const user = await User.findOne({
          stripeCustomerId: session.customer,
        });

        if (!user) return res.json({ received: true });

        const previousBalance = user.credits;
        user.credits += pack.credits;

        await user.save();

        await CreditLedger.create({
          userId: user._id,
          type: "earn",
          source: "credit_pack",
          refId: event.id,
          amount: pack.credits,
          previousBalance,
          balanceAfter: user.credits,
        });

        console.log(`➕ Credit pack added → ${user.email}`);
      }

      /* =====================================================
         SUBSCRIPTION CANCEL
      ===================================================== */
      if (event.type === "customer.subscription.deleted") {
        const subscription = event.data.object;

        await User.findOneAndUpdate(
          { stripeSubscriptionId: subscription.id },
          {
            plan: "free",
            isPaid: false,
          }
        );

        console.log("⛔ Subscription cancelled");
      }

      res.json({ received: true });
    } catch (err) {
      console.error("❌ Stripe webhook handler error:", err);
      res.status(500).send("Webhook processing failed");
    }
  }
);

export default router;
