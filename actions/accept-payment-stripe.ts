"use server";

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");

export async function createPaymentIntent({ amount }: { amount: number }) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "eur",
    });
    console.log("paymentIntent ", paymentIntent);
    
    return { success: true, clientSecret: paymentIntent.client_secret };
  } catch (error) {
    console.error("Stripe Error:", error);
    return { success: false, error: "Failed to create payment intent" };
  }
}