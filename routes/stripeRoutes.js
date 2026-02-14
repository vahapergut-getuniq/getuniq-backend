import express from "express";
import stripe from "../config/stripe.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

const PRICE_ID = "price_1Sx2CaDQy2Pr83BFHbFqa9cy";

router.post("/checkout", authMiddleware, async (req, res) => {
  try {
    const user = req.user;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: PRICE_ID,
          quantity: 1,
        },
      ],
      customer_email: user.email,
      success_url: `${process.env.FRONTEND_URL}/payment-success`,
      cancel_url: `${process.env.FRONTEND_URL}/billing`,
      metadata: {
        userId: user._id.toString(),
        plan: "starter",
        credits: "300",
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    res.status(500).json({ error: "Stripe checkout failed" });
  }
});

export default router;
