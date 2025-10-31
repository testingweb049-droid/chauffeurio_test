"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import ContinueButton from "./ContinueButton"
import useFormStore from "@/stores/FormStore"

export default function MyPaymentForm({ price }: { price: string }) {
  const router = useRouter()
  const { formError, setFormData, changeStep, formData } = useFormStore()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [paymentProcessing, setPaymentProcessing] = useState(false)

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

            // ✅ Automatically redirect to order-placed page
            router.replace("/order-placed")
          } else if (data.status === "PENDING" || data.status === "AUTHORIZED") {
            // Payment still processing, check again after 2 seconds
            setTimeout(() => {
              checkPendingPayment()
            }, 2000)
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
    handlePaymentInitiation();
  }, []);

  const handlePaymentInitiation = async () => {
    if (!formData.name.value || !formData.email.value || !formData.phone.value) {
      setError("Please complete all customer details before payment")
      return;
    }

    setLoading(true);
    setError("");

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
        // Redirect to Revolut's default checkout page
        window.location.href = data.checkout_url;
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

  if (paymentProcessing) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-lg font-medium">Processing your payment...</p>
        <p className="text-gray-600 mt-2">Please wait while we confirm your payment</p>
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Loading State */}
      {loading && (
        <div className="w-full flex flex-col items-center justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-lg font-medium">Redirecting to secure payment...</p>
          <p className="text-gray-600 mt-2">Please wait while we connect to Revolut</p>
        </div>
      )}

      {/* Simple Payment Button - Only show if not loading */}
      {!loading && (
        <form onSubmit={handleManualPayment} className="flex flex-col gap-5">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              You will be redirected to Revolut's secure payment page to complete your booking.
            </p>
          </div>

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

          <ContinueButton
            title={
              loading
                ? "Redirecting to Payment..."
                : `Pay Securely - € ${price}`
            }
            loading={loading}
            type="submit"
            step={4}
          />
        </form>
      )}
    </div>
  )
}