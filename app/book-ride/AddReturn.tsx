"use client"

import useFormStore from "@/stores/FormStore"
import { ArrowRightLeft, CheckCircle } from "lucide-react"
import React from "react"

export default function AddReturn() {
  const { formData, setFormData, setFieldOptions } = useFormStore()

  const basePrice = Number(formData.price?.value || 0)
  const from = formData.fromLocation?.value || ""
  const to = formData.toLocation?.value || ""
  const isReturn = formData.isReturn?.value || false

  const discountedPrice = basePrice - basePrice / 10
  const formattedPrice = discountedPrice.toFixed(2)
  const savings = (basePrice / 10).toFixed(2)

  const handleToggle = () => {
    setFormData("isReturn", !isReturn)
    setFieldOptions("returnDate", !isReturn)
    setFieldOptions("returnTime", !isReturn)
  }

  return (
    <div className="w-full">
      {/* Professional Toggle */}
      <div
        className={`p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer relative ${isReturn
          ? 'bg-primary/10 border-primary shadow-sm'
          : 'bg-gray-50 border-gray-200 hover:border-gray-300'
          }`}
        onClick={handleToggle}
      >
        {/* Discount Badge - Top Right */}
        {!isReturn && (
          <div className="absolute -top-2 -right-2">
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
              {/* <span>🎉</span> */}
              <span>10% OFF</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Toggle Switch with better styling */}
            <div className={`w-12 h-6 rounded-full transition-all duration-300 relative ${isReturn ? 'bg-primary' : 'bg-gray-300'
              }`}>
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-md ${isReturn ? 'left-7' : 'left-1'
                }`} />
            </div>

            {/* Content */}
            <div className="flex items-center gap-3">
              <ArrowRightLeft size={20} className={isReturn ? 'text-primary' : 'text-gray-500'} />
              <div>
                <div className={`font-semibold ${isReturn ? 'text-primary' : 'text-gray-900'}`}>
                  {isReturn ? 'Return Transfer Included' : 'Include Return Transfer'}
                </div>
                <div className="text-sm text-gray-600">
                  {isReturn
                    ? 'Your return journey is confirmed'
                    : `Save €${savings} with return trip`
                  }
                </div>
              </div>
            </div>
          </div>

          {/* Price & Savings */}
          <div className="text-right">
            <div className={`font-bold text-lg ${isReturn ? 'text-primary' : 'text-gray-900'}`}>
              €{formattedPrice}
            </div>
            {!isReturn && (
              <div className="text-xs text-green-700 font-medium mt-1">
                Save €{savings}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Route Details when Active */}
      {isReturn && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-green-700">
            <CheckCircle size={16} className="text-green-600" />
            <span>
              <strong>Return Route:</strong> {to} → {from}
            </span>
          </div>
          <div className="text-xs text-green-600 mt-1">
            Your return transfer has been added to the booking
          </div>
        </div>
      )}
    </div>
  )
}