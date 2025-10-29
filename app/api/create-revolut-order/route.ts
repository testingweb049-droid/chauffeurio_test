import { NextResponse } from "next/server"

export async function POST(request: Request) {
  console.log("---------------------------------")
  try {
    const { amount, customerDetails } = await request.json()

    if (!amount || !customerDetails?.email) {
      return NextResponse.json(
        { error: "Missing required fields: amount and customerDetails.email" },
        { status: 400 }
      )
    }

    // Revolut expects amount in minor units (pence)
    const payload = {
      amount: Math.round(amount * 100),
      currency: "GBP",
      capture_mode: "AUTOMATIC",
      merchant_order_ext_ref: `order_${Date.now()}`,
      description: "Chauffeur Booking",
      customer: {
        email: customerDetails.email,
        phone: customerDetails.phone,
        full_name: customerDetails.name,
      },
      // 3DS Configuration
      payment_methods_include: ["CARD"],
      security_checks: {
        card: {
          challenge_notification_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/revolut-webhook`,
          exemption: "LOW_VALUE",
          three_ds_required: true,
        }
      },
      // Webhook and redirect URLs
      merchant_notify_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/revolut-webhook`,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order-placed`,
      failure_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-failed`,
    }

    console.log("Sending payload to Revolut:", payload)

    const res = await fetch(process.env.REVOLUT_API_URL!, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.REVOLUT_API_KEY}`,
        "Content-Type": "application/json",
        "Revolut-Api-Version": "2023-09-01",
      },
      body: JSON.stringify(payload),
    })

    const data = await res.json()
    console.log("Revolut API response:", data)

    if (!res.ok) {
      console.error("Revolut API error:", data)
      return NextResponse.json(
        { error: data.message || `Revolut order failed: ${res.status}` },
        { status: res.status }
      )
    }

    return NextResponse.json({
      id: data.id,
      public_id: data.public_id,
      checkout_url: data.checkout_url,
      status: data.state,
    })
  } catch (error: any) {
    console.error("Revolut payment error:", error)
    return NextResponse.json(
      { error: error.message || "Revolut payment failed" },
      { status: 500 }
    )
  }
}