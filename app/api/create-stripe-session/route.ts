import { stripe } from "@/lib/stripe"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { amount, customerDetails, orderId } = await req.json()

    if (!amount || !customerDetails?.email || !orderId) {
      return NextResponse.json(
        { error: "Missing required fields: amount, customer email, or order ID" }, 
        { status: 400 }
      )
    }

    // Validate that orderId is not a temporary one
    if (orderId.startsWith('pending-')) {
      return NextResponse.json(
        { error: "Invalid order ID. Please create order first." }, 
        { status: 400 }
      )
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { 
              name: "Chauffeur Booking",
              description: `Booking ID: ${orderId}`,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: customerDetails.email,
      metadata: {
        orderId: orderId, // Actual order ID from database
        customerName: customerDetails.name,
        customerEmail: customerDetails.email,
        customerPhone: customerDetails.phone || "",
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order-placed?payment=success&session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-failed?payment=failed&order_id=${orderId}`,
    })

    return NextResponse.json({ 
      url: session.url,
      sessionId: session.id,
      orderId: orderId 
    })
  } catch (error: any) {
    console.error("Stripe session creation error:", error)
    return NextResponse.json(
      { error: error.message || "Stripe session failed" }, 
      { status: 500 }
    )
  }
}