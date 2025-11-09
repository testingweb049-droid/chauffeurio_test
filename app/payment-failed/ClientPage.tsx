"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { updateOrderId } from "@/actions/update-order-and-send-email"
import useFormStore from "@/stores/FormStore"
import { getOrderByIdAndSecret } from "@/actions/get-order-by-id-secret"

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { loadOrderIntoForm } = useFormStore()

  useEffect(() => {
    const id = searchParams.get("id")
    const secret = searchParams.get("sss")

    async function handlePaymentUpdate() {
      try {
        if ( !id || !secret) {
          setError("Missing required parameters in the URL.")
          setLoading(false)
          return
        }

        const response = await getOrderByIdAndSecret(id, secret)

        if (response?.error || response?.status !== 200) {
          setError(response.error || "Payment confirmation failed.")
          setLoading(false)
        } else {
            if(response.order){
                loadOrderIntoForm(response.order , 3)
                router.push("/book-ride")
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
          <p className="text-gray-700 text-lg font-medium">Refecthing your data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full min-h-[50vh] flex flex-col items-center justify-center text-center">
        <p className="text-red-600 font-semibold text-lg mb-2">Payment Failed ❌</p>
        <p className="text-gray-600">{error}</p>
      </div>
    )
  }

  return null
}
