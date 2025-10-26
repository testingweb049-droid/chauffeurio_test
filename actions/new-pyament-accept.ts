"use server";

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");

interface ProcessStripePaymentProps {
  amount: number;
  paymentIntentId: string;
}

export async function processStripePayment({ 
  amount, 
  paymentIntentId 
}: ProcessStripePaymentProps) {
  try {
    // Verify the payment was successful
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return { success: false, error: "Payment not successful" };
    }

    // Verify the amount matches
    if (paymentIntent.amount !== amount) {
      return { success: false, error: "Payment amount mismatch" };
    }

    // Here you would typically save the payment details to your database
    // ...

    return {
      success: true,
      paymentId: paymentIntentId,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
    };
  } catch (error) {
    console.error("Error processing Stripe payment:", error);
    return {
      success: false,
      error: "Failed to process payment",
    };
  }
}