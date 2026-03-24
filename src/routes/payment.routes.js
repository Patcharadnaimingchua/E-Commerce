const express = require("express");
const router = express.Router();
const Stripe = require("stripe");

// โหลด env
require("dotenv").config();

// เช็คว่ามี Stripe key หรือไม่
if (!process.env.STRIPE_SECRET) {
  console.error("❌ STRIPE_SECRET missing in .env");
}

const stripe = new Stripe(process.env.STRIPE_SECRET);

router.post("/create-checkout", async (req, res) => {
  try {

    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }

    const session = await stripe.checkout.sessions.create({

      payment_method_types: ["card"],

      line_items: items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name || "Product"
          },
          unit_amount: Math.round(item.price * 100)
        },
        quantity: item.quantity || 1
      })),

      mode: "payment",

      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cart"
    });

    res.json({ url: session.url });

  } catch (err) {

    console.error("Stripe error:", err.message);

    res.status(500).json({
      message: "Payment session failed"
    });

  }
});

module.exports = router;