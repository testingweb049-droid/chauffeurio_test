"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import useFormStore from "@/stores/FormStore"
import { Loader2 } from "lucide-react"

export default function MyPaymentForm({ price }: { price: string }) {
  const router = useRouter()
  const { formError, setFormData, formData } = useFormStore()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const amount = Number(price)

  const handlePaymentInitiation = async () => {
    if (!formData.name.value || !formData.email.value || !formData.phone.value) {
      setError("Please complete all customer details before payment")
      return
    }

    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/create-stripe-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          customerDetails: {
            name: formData.name.value,
            email: formData.email.value,
            phone: formData.phone.value,
          },
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.url) {
        setError(data.error || "Failed to create Stripe session")
        setLoading(false)
        return
      }

      // Save order in localStorage
      const orderForStorage = {
        ...formData,
        price: { ...formData.price, value: price },
        orderId: "pending-" + Date.now(), // temporary ID until payment completes
      }
      localStorage.setItem("lastOrder", JSON.stringify(orderForStorage))

      // Redirect to Stripe checkout
      window.location.href = data.url
    } catch (err: any) {
      setError(err.message || "Payment initiation failed")
      setLoading(false)
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
