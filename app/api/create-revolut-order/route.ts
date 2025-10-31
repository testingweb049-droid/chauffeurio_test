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
      console.error('Missing Revolut configuration:', {
        revolutApiUrl: !!revolutApiUrl,
        revolutApiKey: !!revolutApiKey,
        environment
      })
      return NextResponse.json(
        { error: "Revolut configuration missing" },
        { status: 500 }
      )
    }

    // Build payload step by step
    const payload: Record<string, any> = {
      amount: Math.round(amount * 100),
      currency: "EUR",
      capture_mode: "AUTOMATIC",
      customer_email: customerDetails.email,
      description: "Chauffeur Booking",
      merchant_order_ext_ref: `order_${Date.now()}`,
      payment_methods: ["card", "apple_pay", "google_pay"],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order-placed?payment=success`,
      failure_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-failed?payment=failed`,
      merchant_notify_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/revolut-webhook`,
    }

    // Add optional fields
    if (customerDetails.phone) payload.customer_phone = customerDetails.phone
    if (customerDetails.name) payload.customer_name = customerDetails.name

    console.log(`Sending payload to Revolut ${environment}:`, JSON.stringify(payload, null, 2))
    console.log(`API URL: ${revolutApiUrl}`)
    console.log(`API Key prefix: ${revolutApiKey.substring(0, 10)}...`)

    const res = await fetch(revolutApiUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${revolutApiKey}`,
        "Content-Type": "application/json",
        "Revolut-Api-Version": "2023-09-01",
      },
      body: JSON.stringify(payload),
    })

    // Rest of the code remains the same...
    const responseText = await res.text()
    console.log(`Raw API response (${res.status}):`, responseText)

    let data
    try {
      data = JSON.parse(responseText)
    } catch (e) {
      console.error('Failed to parse JSON response:', e)
      return NextResponse.json(
        { error: "Invalid JSON response from Revolut" },
        { status: 500 }
      )
    }

    if (!res.ok) {
      console.error(`Revolut ${environment} API error:`, data)
      return NextResponse.json(
        { 
          error: data.message || `Revolut API error: ${res.status}`,
          details: data
        },
        { status: res.status }
      )
    }

    console.log(`Revolut ${environment} order created successfully:`, data)

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