"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import useFormStore from "@/stores/FormStore"
import { Loader2 } from "lucide-react"

export default function MyPaymentForm({ price }: { price: string }) {
  const router = useRouter()
  const { formError, setFormData, formData } = useFormStore()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [paymentProcessing, setPaymentProcessing] = useState(false) // stays in logic but not displayed

  const amount = Number(price)
  const isProduction = process.env.NEXT_PUBLIC_APP_ENV === "production"
  const revolutEnvironment = isProduction ? "production" : "sandbox"

  useEffect(() => {
    const checkPendingPayment = async () => {
      const pendingPaymentId = sessionStorage.getItem("pendingRevolutPayment")
      if (pendingPaymentId && !formData.paymentId.value) {
        setPaymentProcessing(true)
        try {
          const response = await fetch(`/api/verify-payment?orderId=${pendingPaymentId}`)
          const data = await response.json()
          if (data.status === "COMPLETED") {
            setFormData("paymentId", pendingPaymentId)
            sessionStorage.removeItem("pendingRevolutPayment")
            router.replace("/order-placed")
          } else if (data.status === "PENDING" || data.status === "AUTHORIZED") {
            setTimeout(() => checkPendingPayment(), 2000)
          }
        } catch (error) {
          console.error("Error verifying payment:", error)
          setPaymentProcessing(false)
        }
      }
    }

    checkPendingPayment()
  }, [formData.paymentId.value, router, setFormData])

  // Auto-initiate payment when component mounts (when showPayment becomes true)
  useEffect(() => {
    handlePaymentInitiation()
  }, [])

  const handlePaymentInitiation = async () => {
    if (!formData.name.value || !formData.email.value || !formData.phone.value) {
      setError("Please complete all customer details before payment")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/create-revolut-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          customerDetails: {
            name: formData.name.value,
            email: formData.email.value,
            phone: formData.phone.value,
          },
          environment: revolutEnvironment,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        setError(data.error || `Payment failed: ${response.status}`)
        setLoading(false)
        return
      }

      // Store order ID and redirect to Revolut checkout
      sessionStorage.setItem("pendingRevolutPayment", data.id)

      if (data.checkout_url) {
        window.location.href = data.checkout_url
      } else {
        setError("No checkout URL received from payment provider")
        setLoading(false)
      }
    } catch (err: any) {
      setError(err.message || "Failed to initiate payment. Please try again.")
      setLoading(false)
      sessionStorage.removeItem("pendingRevolutPayment")
    }
  }

  const handleManualPayment = async (event: React.FormEvent) => {
    event.preventDefault()
    await handlePaymentInitiation()
  }

  if (isNaN(amount) || amount <= 0) {
    return (
      <div className="text-red-500 text-center p-4 border border-red-300 rounded-lg">
        Invalid price amount: €{price}. Please check your booking details.
      </div>
    )
  }

  // ✅ No paymentProcessing UI — all visual feedback handled in the button
  return (
    <div className="w-full flex flex-col gap-6">
      <form onSubmit={handleManualPayment} className="flex flex-col gap-5">
        {formError && (
          <div className="text-red-500 text-center bg-red-50 p-3 rounded-lg border border-red-200">
            {formError}
          </div>
        )}

        {error && (
          <div className="text-red-500 text-center bg-red-50 p-3 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-semibold text-lg transition-all ${loading
            ? "bg-blue-500 text-white opacity-80 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
            }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Redirecting to Payment...
            </>
          ) : (
            <>Pay Securely - € {price}</>
          )}
        </button>
      </form>
    </div>
  )
}
