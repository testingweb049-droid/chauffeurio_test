"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { updateOrderId } from "@/actions/update-order-and-send-email"
import useFormStore from "@/stores/FormStore"

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { loadOrderIntoForm } = useFormStore()

  useEffect(() => {
    const session_id = searchParams.get("session_id")
    const id = searchParams.get("id")
    const secret = searchParams.get("sss")

    console.log("session_id ",session_id)
    console.log("order_id ",id)
    console.log("secret ",secret)

    async function handlePaymentUpdate() {
      try {
        if (!session_id || !id || !secret) {
          setError("Missing required parameters in the URL.")
          setLoading(false)
          return
        }

        const response = await updateOrderId(id, secret, session_id)

        if (response?.error || response?.status !== 201) {
          setError(response.error || "Payment confirmation failed.")
          setLoading(false)
        } else {
            if(response.order){
                loadOrderIntoForm(response.order)
                router.push("/order-placed")
            }
        }
      } catch (err) {
        console.error("Payment success error:", err)
        setError("Something went wrong while verifying your payment.")
        setLoading(false)
      }
    }

    handlePaymentUpdate()
  }, [searchParams, router])


  if (loading) {
    return (
      <div className="w-full min-h-[50vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
          <p className="text-gray-700 text-lg font-medium">Verifying your payment...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full min-h-[80vh] flex flex-col items-center justify-center text-center">
        <p className="text-red-600 font-semibold text-lg mb-2">Order Failed ❌</p>
        <p className="text-gray-600">{error}</p>
      </div>
    )
  }

  return null
}
