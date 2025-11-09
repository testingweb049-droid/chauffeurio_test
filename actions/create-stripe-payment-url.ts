"use server"

import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2025-10-29.clover",
})

export async function CreateStripePaymentURLAction(amount: number, orderId:string, secret:string) {
  try {
    // ✅ Validate amount
    if (!amount || typeof amount !== "number" || amount <= 0) {
      throw new Error("Valid amount is required")
    }

    const centsAmount = Math.round(amount * 100)

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"  ],
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: "Custom Payment",
            },
            unit_amount: centsAmount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}&id=${orderId}&sss=${secret}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-cancelled?id=${orderId}`,
    })

    return {
      success: true,
      url: session.url,
    }
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return {
      success: false,
      error: "Failed to create Stripe session",
    }
  }
}
