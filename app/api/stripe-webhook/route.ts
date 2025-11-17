import Stripe from "stripe"
import { NextResponse } from "next/server"
import { client } from "@/lib/db"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover",
})

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature")
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

  const body = await req.text()
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature!, webhookSecret)
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Webhook error" }, { status: 400 })
  }

  switch (event.type) {
    // app/api/stripe-webhook/route.ts
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;
    
      if (orderId) {
        await client.connect();
        await client.query(
          `UPDATE orders SET status = 'paid', payment_id = $1 WHERE id = $2`,
          [session.id, orderId]
        );
        await client.end();
      }
      break;
    
    case "checkout.session.async_payment_failed":
      console.log("Payment failed:", event.data.object)
      // ✅ Handle failed payments
      break
    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
