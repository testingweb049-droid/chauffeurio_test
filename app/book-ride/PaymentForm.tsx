"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import ContinueButton from "./ContinueButton"
import useFormStore from "@/stores/FormStore"
import Script from "next/script"

// Type definitions for wallet payments and price breakdown
interface WalletPaymentsAvailable {
  applePay: boolean;
  googlePay: boolean;
}

interface PriceBreakdown {
  basePrice: number;
  isReturn: boolean;
  returnPrice: number;
  childSeats: number;
  childSeatTotal: number;
  infantSeats: number;
  infantSeatTotal: number;
  boosterSeats: number;
  boosterSeatTotal: number;
  isMeetGreet: boolean;
  meetGreetTotal: number;
  isFlightTrack: boolean;
  flightTrackTotal: number;
  carLabel: string;
  totalPrice: number;
}
declare global {
  interface Window {
    RevolutCheckout: any;
  }
}

export default function MyPaymentForm({ price, priceBreakdown }: { price: string; priceBreakdown?: PriceBreakdown }) {
  const router = useRouter()
  const { formError, setFormData, changeStep, formData } = useFormStore()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<"card" | "apple_pay" | "google_pay">("card")
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [paymentProcessing, setPaymentProcessing] = useState(false)

  const amount = Number(price)

  const isProduction = process.env.NEXT_PUBLIC_APP_ENV === "production"
  const revolutScriptUrl = isProduction
    ? process.env.NEXT_PUBLIC_REVOLUT_PRODUCTION_SCRIPT || "https://merchant.revolut.com/embed.js"
    : process.env.NEXT_PUBLIC_REVOLUT_SANDBOX_SCRIPT || "https://sandbox-merchant.revolut.com/embed.js"

  const revolutEnvironment = isProduction ? "production" : "sandbox"

  // Check if Apple Pay/Google Pay are available
  const [walletPaymentsAvailable, setWalletPaymentsAvailable] = useState<WalletPaymentsAvailable>({
    applePay: false,
    googlePay: false
  })

  // Currency symbol
  const CURRENCY = '€';
  const format = (n: number) => n.toFixed(2);

  useEffect(() => {
    // Check for Apple Pay availability
    const checkApplePay = () => {
      if (typeof window !== 'undefined' && window.ApplePaySession) {
        try {
          const isAvailable = window.ApplePaySession.canMakePayments();
          setWalletPaymentsAvailable(prev => ({ ...prev, applePay: isAvailable }));
        } catch (error) {
          console.warn('Apple Pay check failed:', error);
          setWalletPaymentsAvailable(prev => ({ ...prev, applePay: false }));
        }
      }
    };

    // Check for Google Pay availability
    const checkGooglePay = () => {
      if (typeof window !== 'undefined') {
        const isAvailable = !!(window.google &&
          window.google.payments &&
          window.google.payments.api &&
          window.PaymentRequest);
        setWalletPaymentsAvailable(prev => ({ ...prev, googlePay: isAvailable }));
      }
    };

    checkApplePay();
    checkGooglePay();
  }, [])

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
            const isOk = await changeStep(true, 4)
            if (isOk) router.replace("/order-placed")
          }
        } catch (error) {
          console.error("Error verifying payment:", error)
        } finally {
          setPaymentProcessing(false)
        }
      }
    }
    checkPendingPayment()
  }, [formData.paymentId.value, router, setFormData, changeStep])

  if (isNaN(amount) || amount <= 0) {
    return (
      <div className="text-red-500 text-center p-4 border border-red-300 rounded-lg">
        Invalid price amount: €{price}. Please check your booking details.
      </div>
    )
  }

  const handlePayment = async (event: React.FormEvent) => {
    event.preventDefault()
    setError("")
    setLoading(true)
    try {
      if (!formData.name.value || !formData.email.value || !formData.phone.value) {
        setError("Please complete all customer details before payment")
        setLoading(false)
        return
      }

      if (formData.paymentId.value) {
        const isOk = await changeStep(true, 4)
        if (isOk) router.replace("/order-placed")
        return
      }

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
          paymentMethod,
          environment: revolutEnvironment,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        setError(data.error || `Payment failed: ${response.status}`)
        setLoading(false)
        return
      }

      sessionStorage.setItem("pendingRevolutPayment", data.id)

      if (scriptLoaded && window.RevolutCheckout) {
        const RC = window.RevolutCheckout(data.public_id, revolutEnvironment)

        // Configure payment methods based on selection
        const paymentOptions: {
          onSuccess: () => void;
          onError: (err: any) => void;
          onCancel: () => void;
          applePay?: boolean;
          googlePay?: boolean;
        } = {
          onSuccess() {
            setLoading(false)
            setPaymentProcessing(true)
            const pollPaymentStatus = async () => {
              try {
                const verifyResponse = await fetch(`/api/verify-payment?orderId=${data.id}`)
                const verifyData = await verifyResponse.json()
                if (verifyData.status === "COMPLETED") {
                  setFormData("paymentId", data.id)
                  sessionStorage.removeItem("pendingRevolutPayment")
                  const isOk = await changeStep(true, 4)
                  if (isOk) router.replace("/order-placed")
                } else setTimeout(pollPaymentStatus, 2000)
              } catch {
                setTimeout(pollPaymentStatus, 2000)
              }
            }
            pollPaymentStatus()
          },
          onError(err: any) {
            setError(err.message || "Payment failed")
            setLoading(false)
            setPaymentProcessing(false)
            sessionStorage.removeItem("pendingRevolutPayment")
          },
          onCancel() {
            setError("Payment was cancelled")
            setLoading(false)
            setPaymentProcessing(false)
            sessionStorage.removeItem("pendingRevolutPayment")
          },
        }

        // Add payment method specific configurations
        if (paymentMethod === "apple_pay") {
          paymentOptions.applePay = true
        } else if (paymentMethod === "google_pay") {
          paymentOptions.googlePay = true
        }

        RC.payWithPopup(paymentOptions)
        return
      }
      setError("Payment system not ready. Please try again.")
      setLoading(false)
      sessionStorage.removeItem("pendingRevolutPayment")
    } catch (err: any) {
      setError(err.message || "Failed to initiate payment. Please try again.")
      setLoading(false)
      sessionStorage.removeItem("pendingRevolutPayment")
    }
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
    <>
      <Script
        src={revolutScriptUrl}
        onLoad={() => setScriptLoaded(true)}
        onError={() => setError("Failed to load payment system")}
      />

      <div className="w-full flex flex-col gap-6">
        {/* Price Breakdown Section */}
        {priceBreakdown && (
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div className="flex flex-col gap-5 w-full">
              <div className="font-bold text-lg text-gray-900">Price Breakdown</div>

              <div className="flex flex-col gap-3 w-full">
                {/* Base Price */}
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm text-gray-600">{priceBreakdown.carLabel}</div>
                  <div className="text-sm text-gray-600">
                    {CURRENCY} {format(priceBreakdown.basePrice)}
                  </div>
                </div>

                {/* Child Seats */}
                {priceBreakdown.childSeats > 0 && (
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-sm text-gray-600">
                      Child Seat{priceBreakdown.childSeats > 1 ? 's' : ''} (x{priceBreakdown.childSeats})
                    </div>
                    <div className="text-sm text-gray-600">
                      {CURRENCY} {format(priceBreakdown.childSeatTotal)}
                    </div>
                  </div>
                )}

                {/* Infant Seats */}
                {priceBreakdown.infantSeats > 0 && (
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-sm text-gray-600">
                      Infant Seat{priceBreakdown.infantSeats > 1 ? 's' : ''} (x{priceBreakdown.infantSeats})
                    </div>
                    <div className="text-sm text-gray-600">
                      {CURRENCY} {format(priceBreakdown.infantSeatTotal)}
                    </div>
                  </div>
                )}

                {/* Booster Seats */}
                {priceBreakdown.boosterSeats > 0 && (
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-sm text-gray-600">
                      Booster Seat{priceBreakdown.boosterSeats > 1 ? 's' : ''} (x{priceBreakdown.boosterSeats})
                    </div>
                    <div className="text-sm text-gray-600">
                      {CURRENCY} {format(priceBreakdown.boosterSeatTotal)}
                    </div>
                  </div>
                )}

                {/* Meet & Greet */}
                {priceBreakdown.isMeetGreet && (
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-sm text-gray-600">Meet & Greet</div>
                    <div className="text-sm text-gray-600">
                      {CURRENCY} {format(priceBreakdown.meetGreetTotal)}
                    </div>
                  </div>
                )}

                {/* Flight Track */}
                {priceBreakdown.isFlightTrack && (
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-sm text-gray-600">Flight Track</div>
                    <div className="text-sm text-gray-600">
                      {CURRENCY} {format(priceBreakdown.flightTrackTotal)}
                    </div>
                  </div>
                )}

                {/* Return Transfer */}
                {priceBreakdown.isReturn && (
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-sm text-gray-600">Return Transfer</div>
                    <div className="text-sm text-gray-600">
                      {CURRENCY} {format(priceBreakdown.returnPrice)}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between gap-2 pt-4 mt-4 border-t-2 border-black border-dashed text-xl font-bold text-black">
              <div>Total:</div>
              <div>
                {CURRENCY} {format(priceBreakdown.totalPrice)}
              </div>
            </div>
          </div>
        )}

        {/* Payment Form Section */}
        <form onSubmit={handlePayment} className="flex flex-col gap-5">
          {/* Payment Method Selection */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4 text-primary">Select Payment Method</h3>

            <div className="flex flex-row gap-3 justify-between">
              {/* Card */}
              <label
                className={`flex-1 flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${paymentMethod === "card"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                  className="hidden"
                />
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6 text-gray-700"
                  >
                    <rect x="2" y="5" width="20" height="14" rx="2" ry="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                  </svg>
                </div>
                <span className="font-medium text-sm text-center text-primary">Card</span>
              </label>

              {/* Apple Pay */}
              <label
                className={`flex-1 flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${paymentMethod === "apple_pay"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  } ${!walletPaymentsAvailable.applePay ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="apple_pay"
                  checked={paymentMethod === "apple_pay"}
                  onChange={() => walletPaymentsAvailable.applePay && setPaymentMethod("apple_pay")}
                  disabled={!walletPaymentsAvailable.applePay}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" height="24" width="30" viewBox="-76.79115 -52.55 665.5233 315.3">
                    <path d="M93.541 27.1c-6 7.1-15.6 12.7-25.2 11.9-1.2-9.6 3.5-19.8 9-26.1 6-7.3 16.5-12.5 25-12.9 1 10-2.9 19.8-8.8 27.1m8.7 13.8c-13.9-.8-25.8 7.9-32.4 7.9-6.7 0-16.8-7.5-27.8-7.3-14.3.2-27.6 8.3-34.9 21.2-15 25.8-3.9 64 10.6 85 7.1 10.4 15.6 21.8 26.8 21.4 10.6-.4 14.8-6.9 27.6-6.9 12.9 0 16.6 6.9 27.8 6.7 11.6-.2 18.9-10.4 26-20.8 8.1-11.8 11.4-23.3 11.6-23.9-.2-.2-22.4-8.7-22.6-34.3-.2-21.4 17.5-31.6 18.3-32.2-10-14.8-25.6-16.4-31-16.8m80.3-29v155.9h24.2v-53.3h33.5c30.6 0 52.1-21 52.1-51.4s-21.1-51.2-51.3-51.2zm24.2 20.4h27.9c21 0 33 11.2 33 30.9s-12 31-33.1 31h-27.8zm129.8 136.7c15.2 0 29.3-7.7 35.7-19.9h.5v18.7h22.4V90.2c0-22.5-18-37-45.7-37-25.7 0-44.7 14.7-45.4 34.9h21.8c1.8-9.6 10.7-15.9 22.9-15.9 14.8 0 23.1 6.9 23.1 19.6v8.6l-30.2 1.8c-28.1 1.7-43.3 13.2-43.3 33.2 0 20.2 15.7 33.6 38.2 33.6zm6.5-18.5c-12.9 0-21.1-6.2-21.1-15.7 0-9.8 7.9-15.5 23-16.4l26.9-1.7v8.8c0 14.6-12.4 25-28.8 25zm82 59.7c23.6 0 34.7-9 44.4-36.3l42.5-119.2h-24.6l-28.5 92.1h-.5l-28.5-92.1h-25.3l41 113.5-2.2 6.9c-3.7 11.7-9.7 16.2-20.4 16.2-1.9 0-5.6-.2-7.1-.4v18.7c1.4.4 7.4.6 9.2.6z" />
                  </svg>
                </div>
                <span className="font-medium text-sm text-center text-primary">Apple Pay</span>
                {!walletPaymentsAvailable.applePay && (
                  <span className="text-xs text-gray-500 mt-1">Not available</span>
                )}
              </label>

              {/* Google Pay */}
              <label
                className={`flex-1 flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${paymentMethod === "google_pay"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  } ${!walletPaymentsAvailable.googlePay ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="google_pay"
                  checked={paymentMethod === "google_pay"}
                  onChange={() => walletPaymentsAvailable.googlePay && setPaymentMethod("google_pay")}
                  disabled={!walletPaymentsAvailable.googlePay}
                  className="hidden"
                />
                <div className="w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" height="24" width="30" viewBox="-65.39955 -43.28375 566.7961 259.7025">
                    <path fill="#5f6368" d="M206.197 84.585v50.75h-16.1V10.005h42.7a38.61 38.61 0 0127.65 10.85 34.88 34.88 0 0111.55 26.45 34.72 34.72 0 01-11.55 26.6q-11.2 10.68-27.65 10.67h-26.6zm0-59.15v43.75h27a21.28 21.28 0 0015.93-6.48 21.36 21.36 0 000-30.63 21 21 0 00-15.93-6.65h-27zm102.9 21.35q17.85 0 28.18 9.54 10.33 9.54 10.32 26.16v52.85h-15.4v-11.9h-.7q-10 14.7-26.6 14.7-14.17 0-23.71-8.4a26.82 26.82 0 01-9.54-21q0-13.31 10.06-21.17 10.06-7.86 26.86-7.88 14.34 0 23.62 5.25v-3.68a18.33 18.33 0 00-6.65-14.25 22.8 22.8 0 00-15.54-5.87q-13.49 0-21.35 11.38l-14.18-8.93q11.7-16.8 34.63-16.8zm-20.83 62.3a12.86 12.86 0 005.34 10.5 19.64 19.64 0 0012.51 4.2 25.67 25.67 0 0018.11-7.52q8-7.53 8-17.67-7.53-6-21-6-9.81 0-16.36 4.73c-4.41 3.2-6.6 7.09-6.6 11.76zm147.73-59.5l-53.76 123.55h-16.62l19.95-43.23-35.35-80.32h17.5l25.55 61.6h.35l24.85-61.6z" />
                    <path fill="#4285f4" d="M141.137 73.645a85.79 85.79 0 00-1.24-14.64h-67.9v27.73h38.89a33.33 33.33 0 01-14.38 21.88v18h23.21c13.59-12.53 21.42-31.06 21.42-52.97z" />
                    <path fill="#34a853" d="M71.997 144.005c19.43 0 35.79-6.38 47.72-17.38l-23.21-18c-6.46 4.38-14.78 6.88-24.51 6.88-18.78 0-34.72-12.66-40.42-29.72H7.667v18.55a72 72 0 0064.33 39.67z" />
                    <path fill="#fbbc04" d="M31.577 85.785a43.14 43.14 0 010-27.56v-18.55H7.667a72 72 0 000 64.66z" />
                    <path fill="#ea4335" d="M71.997 28.505a39.09 39.09 0 0127.62 10.8l20.55-20.55A69.18 69.18 0 0071.997.005a72 72 0 00-64.33 39.67l23.91 18.55c5.7-17.06 21.64-29.72 40.42-29.72z" />
                  </svg>
                </div>
                <span className="font-medium text-sm text-center text-primary">Google Pay</span>
                {!walletPaymentsAvailable.googlePay && (
                  <span className="text-xs text-gray-500 mt-1">Not available</span>
                )}
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
                  ? `Pay € ${price} Securely With Card`
                  : `Pay € ${price}${paymentMethod === "apple_pay" ? " with Apple Pay" : " with Google Pay"
                  }`
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