import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "")

export async function POST(request: NextRequest) {
  try {
    const { amount } = await request.json()
    
    // Validate amount
    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { error: "Valid amount is required" }, 
        { status: 400 }
      )
    }

    const centsAmount = Math.round(amount * 100)

    const paymentIntent = await stripe.paymentIntents.create({
      amount: centsAmount, 
      currency: "gbp",
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    console.error("Error creating payment intent:", error)
    return NextResponse.json(
      { error: "Error creating payment intent" }, 
      { status: 500 }
    )
  }
}