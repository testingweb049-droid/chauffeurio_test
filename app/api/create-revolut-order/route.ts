import { NextResponse } from "next/server"

export async function POST(request: Request) {
  console.log("---------------------------------")
  try {
    const { amount, customerDetails, environment = 'sandbox' } = await request.json()

    if (!amount || !customerDetails?.email) {
      return NextResponse.json(
        { error: "Missing required fields: amount and customerDetails.email" },
        { status: 400 }
      )
    }

    // Environment-based configuration
    const isProduction = environment === 'production'
    const revolutApiUrl = isProduction 
      ? process.env.REVOLUT_PRODUCTION_API_URL 
      : process.env.REVOLUT_API_URL
    
    const revolutApiKey = isProduction 
      ? process.env.REVOLUT_PRODUCTION_API_KEY 
      : process.env.REVOLUT_API_KEY

    if (!revolutApiUrl || !revolutApiKey) {
      return NextResponse.json(
        { error: "Revolut configuration missing" },
        { status: 500 }
      )
    }

    // Revolut expects amount in minor units (pence)
    const payload = {
      amount: Math.round(amount * 100),
      currency: "EUR",
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

    console.log(`Sending payload to Revolut ${environment}:`, payload)

    const res = await fetch(revolutApiUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${revolutApiKey}`,
        "Content-Type": "application/json",
        "Revolut-Api-Version": "2023-09-01",
      },
      body: JSON.stringify(payload),
    })

    const data = await res.json()
    console.log(`Revolut ${environment} API response:`, data)

    if (!res.ok) {
      console.error(`Revolut ${environment} API error:`, data)
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