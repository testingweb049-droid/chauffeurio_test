import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log("Revolut Webhook Received:", JSON.stringify(body, null, 2))

    const { event, order_id, public_id, state, amount, currency } = body

    // Verify webhook signature (important for security)
    const signature = req.headers.get('revolut-signature')
    if (!signature) {
      console.error("Missing Revolut signature")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // TODO: Add signature verification logic here

    if (event === "ORDER_COMPLETED" || state === "COMPLETED") {
      console.log("Payment completed successfully:", {
        order_id,
        public_id,
        amount: amount / 100, // Convert back from minor units
        currency
      })
      
      // TODO: Update your database or form state here
      // Mark payment as successful in your database
      
      // You can also update any temporary storage here
      
    } else if (event === "ORDER_AUTHORISED") {
      console.log("Payment authorised - 3DS may be required:", order_id)
    } else if (event === "ORDER_PAYMENT_DECLINED" || state === "DECLINED") {
      console.log("Payment declined:", order_id)
      // Handle declined payments
    } else if (event === "ORDER_FAILED" || state === "FAILED") {
      console.log("Payment failed:", order_id)
      // Handle failed payments
    } else {
      console.log("Other Revolut event:", event, "State:", state)
    }

    return NextResponse.json({ received: true, status: "processed" })
  } catch (error: any) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}