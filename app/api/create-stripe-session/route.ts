import { stripe } from "@/lib/stripe"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { amount, customerDetails } = await req.json()

    if (!amount || !customerDetails?.email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"], // Enables Apple Pay & Google Pay automatically
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { name: "Chauffeur Booking" },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: customerDetails.email,
      metadata: {
        name: customerDetails.name,
        phone: customerDetails.phone || "",
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order-placed?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-failed?payment=failed`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error("Stripe session creation error:", error)
    return NextResponse.json({ error: error.message || "Stripe session failed" }, { status: 500 })
  }
}
