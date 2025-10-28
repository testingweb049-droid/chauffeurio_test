"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import ContinueButton from "./ContinueButton"
import useFormStore from "@/stores/FormStore"

export default function MyPaymentForm({ price }: { price: string }) {
  const router = useRouter()
  const { formError, setFormData, changeStep, formData } = useFormStore()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const amount = Number(price)

  // Validate price
  if (isNaN(amount) || amount <= 0) {
    return (
      <div className="text-red-500 text-center p-4 border border-red-300 rounded-lg">
        Invalid price amount: £{price}. Please check your booking details.
      </div>
    )
  }

  const handlePayment = async (event: React.FormEvent) => {
    event.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Validate required fields
      if (!formData.name.value || !formData.email.value || !formData.phone.value) {
        setError("Please complete all customer details before payment")
        setLoading(false)
        return
      }

      // If already paid, skip payment flow
      if (formData.paymentId.value) {
        console.log("Payment already completed, proceeding to confirmation...")
        const isOk = await changeStep(true, 4)
        if (isOk) {
          router.replace("/order-placed")
          router.refresh()
        }
        return
      }

      console.log("Creating Revolut order for amount:", amount)

      // Create Revolut payment order
      const response = await fetch("/api/create-revolut-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          amount: amount,
          customerDetails: {
            name: formData.name.value,
            email: formData.email.value,
            phone: formData.phone.value,
          },
        }),
      })

      const data = await response.json()
      console.log("Revolut API response:", data)

      if (!response.ok) {
        console.error("Revolut API error:", data)
        setError(data.error || `Payment failed: ${response.status} ${response.statusText}`)
        setLoading(false)
        return
      }

      if (!data.checkout_url) {
        setError("No checkout URL received from payment provider")
        setLoading(false)
        return
      }

      // Save order ID locally
      setFormData("paymentId", data.id)
      console.log("Saved payment ID:", data.id, "Redirecting to:", data.checkout_url)

      // IMPORTANT: Use window.location.replace for external redirects
      window.location.replace(data.checkout_url)

    } catch (err: any) {
      console.error("Payment error:", err)
      setError(err.message || "Failed to initiate payment. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="w-full flex flex-col">
      <form onSubmit={handlePayment} className="flex flex-col gap-5">
        {/* Terms */}
        <div className="text-xs text-justify text-gray-600 bg-gray-50 p-4 rounded-lg">
          <strong>Please note:</strong> After you have confirmed your reservation you will be sent a full booking
          confirmation. You can amend your journey at any time. Free cancellation within 24 hours.
          All bookings are subject to our Terms and Conditions.
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
          title={formData.paymentId.value ? "Processing Payment..." : `Pay £${price} Securely`}
          loading={loading}
          type="submit"
          step={4}
        />
      </form>
    </div>
  )
}