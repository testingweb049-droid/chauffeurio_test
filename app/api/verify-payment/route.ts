import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      )
    }

    // Environment detection
    const isProduction = process.env.NEXT_PUBLIC_APP_ENV === 'production'
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

    // Fetch order details from Revolut
    const response = await fetch(`${revolutApiUrl}/${orderId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${revolutApiKey}`,
        "Content-Type": "application/json",
        "Revolut-Api-Version": "2023-09-01",
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch payment status" },
        { status: response.status }
      )
    }

    const orderData = await response.json()
    
    return NextResponse.json({
      status: orderData.state,
      orderId: orderData.id,
      publicId: orderData.public_id,
      amount: orderData.amount,
      currency: orderData.currency
    })

  } catch (error: any) {
    console.error("Payment verification error:", error)
    return NextResponse.json(
      { error: error.message || "Payment verification failed" },
      { status: 500 }
    )
  }
}