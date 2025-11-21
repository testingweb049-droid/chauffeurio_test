import Stripe from "stripe"

const isProduction = process.env.NEXT_PUBLIC_APP_ENV === "production"

// Use live key in production, test key in development
const stripeSecretKey = isProduction
  ? process.env.STRIPE_SECRET_KEY!
  : process.env.STRIPE_SECRET_KEY!.replace("live", "test") // converts live -> test for dev

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion:"2025-10-29.clover",
})
