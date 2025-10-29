"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import ContinueButton from "./ContinueButton"
import useFormStore from "@/stores/FormStore"
import { CreditCard, Smartphone, Mail } from "lucide-react"
import Script from "next/script"

declare global {
  interface Window {
    RevolutCheckout: any;
  }
}

export default function MyPaymentForm({ price }: { price: string }) {
  const router = useRouter()
  const { formError, setFormData, changeStep, formData } = useFormStore()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<"card" | "apple_pay" | "google_pay">("card")
  const [scriptLoaded, setScriptLoaded] = useState(false)

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
      if (formData.paymentId.value) {
        console.log("Payment already completed, proceeding to confirmation...")
        const isOk = await changeStep(true, 4)
        if (isOk) {
          router.replace("/order-placed")
          router.refresh()
        }
        return
      }

      console.log(`Creating Revolut order for amount: ${amount} with method: ${paymentMethod}`)

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
          paymentMethod: paymentMethod
        }),
      })

      const data = await response.json()
      console.log("Revolut API response:", data)

      if (!response.ok) {
        console.error("Revolut API error:", data)
        setError(data.error || `Payment failed: ${response.status}`)
        setLoading(false)
        return
      }

      // For card payment - use popup (works in sandbox)
      if (paymentMethod === "card" && scriptLoaded && window.RevolutCheckout) {
        try {
          console.log("Opening Revolut payment modal...")
          const RC = window.RevolutCheckout(data.public_id, "sandbox")

          RC.payWithPopup({
            onSuccess() {
              console.log("Payment successful!")
              setFormData("paymentId", data.id)
              setLoading(false)
              changeStep(true, 4).then((isOk) => {
                if (isOk) {
                  router.replace("/order-placed")
                  router.refresh()
                }
              })
            }
            ,
            onError(error: any) {
              console.error("Payment error:", error)
              setError(error.message || "Payment failed")
              setLoading(false)
            },
            onCancel() {
              console.log("Payment cancelled by user")
              setError("Payment was cancelled")
              setLoading(false)
            },
          })
        } catch (err: any) {
          console.error("Revolut popup error:", err)
          setError(err.message || "Failed to open payment window")
          setLoading(false)
        }
        return
      }
      if (data.checkout_url) {
        if (data.id) {
          setFormData("paymentId", data.id)
        }
        window.location.href = data.checkout_url
        return
      }
      if (data.status === "COMPLETED" || data.state === "COMPLETED") {
        setFormData("paymentId", data.id)
        console.log("Payment completed successfully:", data.id)

        const isOk = await changeStep(true, 4)
        if (isOk) {
          router.replace("/order-placed")
          router.refresh()
        }
      } else {
        setError("Payment processing failed. Please try again.")
        setLoading(false)
      }

    } catch (err: any) {
      console.error("Payment error:", err)
      setError(err.message || "Failed to initiate payment. Please try again.")
      setLoading(false)
    }
  }

  return (
    <>
      <Script
        src="https://sandbox-merchant.revolut.com/embed.js"
        onLoad={() => {
          console.log("Revolut script loaded successfully")
          setScriptLoaded(true)
        }}
        onError={() => {
          console.error("Failed to load Revolut script")
          setError("Failed to load payment system")
        }}
      />

      <div className="w-full flex flex-col">
        <form onSubmit={handlePayment} className="flex flex-col gap-5">
          {/* Payment Method Selection */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4 text-primary">Select Payment Method</h3>

            <div className="flex flex-row gap-3 justify-between">
              {/* Card Payment Option */}
              <label className={`flex-1 flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${paymentMethod === "card"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={(e) => setPaymentMethod("card")}
                  className="hidden"
                />
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                  <CreditCard className="w-6 h-6 text-gray-600" />
                </div>
                <span className="font-medium text-sm text-center">Card</span>
              </label>

              {/* Apple Pay Option */}
              <label className={`flex-1 flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${paymentMethod === "apple_pay"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="apple_pay"
                  checked={paymentMethod === "apple_pay"}
                  onChange={(e) => setPaymentMethod("apple_pay")}
                  className="hidden"
                />
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-2">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
                <span className="font-medium text-sm text-center">Apple Pay</span>
              </label>

              {/* Google Pay Option */}
              <label className={`flex-1 flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${paymentMethod === "google_pay"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="google_pay"
                  checked={paymentMethod === "google_pay"}
                  onChange={(e) => setPaymentMethod("google_pay")}
                  className="hidden"
                />
                <div className="w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center mb-2">
                  <Mail className="w-6 h-6 text-gray-700" />
                </div>
                <span className="font-medium text-sm text-center">Google Pay</span>
              </label>
            </div>
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
              formData.paymentId.value
                ? "Processing Payment..."
                : paymentMethod === "card"
                  ? `Pay £${price} Securely`
                  : `Pay £${price}${paymentMethod === "apple_pay" ? " with Apple Pay" : " with Google Pay"}`
            }
            loading={loading}
            type="submit"
            step={4}
          />
        </form>
      </div>
    </>
  )
}