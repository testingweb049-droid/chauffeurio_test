"use client"

import useFormStore from "@/stores/FormStore"
import { ArrowRightLeft } from "lucide-react"
import React from "react"

export default function AddReturn() {
  const { formData, setFormData, setFieldOptions } = useFormStore()

  const basePrice = Number(formData.price?.value || 0)
  const from = formData.fromLocation?.value || ""
  const to = formData.toLocation?.value || ""
  const isReturn = formData.isReturn?.value || false

  const discountedPrice = basePrice - basePrice / 10
  const formattedPrice = discountedPrice.toFixed(2)
  const originalPrice = basePrice.toFixed(2)
  const savings = (basePrice / 10).toFixed(2)

  return (
    <div
      className={`p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center w-full relative rounded-lg transition-all duration-300 ${isReturn ? "bg-green-50 border border-green-200" : "bg-primary/10 border border-primary/20"
        }`}
    >
      {/* Discount badge - Right Side */}
      {!isReturn && (
        <div className="text-xs px-3 py-1 bg-primary text-white absolute -top-2 right-4 rounded-full font-medium shadow-sm z-10">
          Save 10%
        </div>
      )}

      {/* Icon and Content Container */}
      <div className="flex gap-4 items-start w-full sm:w-auto">
        {/* Icon */}
        <div
          className={`shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${isReturn ? "bg-green-500" : "bg-primary"
            }`}
        >
          <ArrowRightLeft size={18} className="text-white sm:w-5 sm:h-5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">
            {isReturn ? "Return Journey Added" : "Complete Your Journey"}
          </h3>

          <div className="text-xs sm:text-sm text-gray-600 mb-2">
            {isReturn ? (
              <>
                Your return trip from <span className="font-medium">{to}</span> to <span className="font-medium">{from}</span> is confirmed
              </>
            ) : (
              <>
                Add return trip from <span className="font-medium">{to}</span> to <span className="font-medium">{from}</span>
              </>
            )}
          </div>

          {/* Price Display */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2">
              {!isReturn && (
                <span className="text-xs sm:text-sm text-gray-500 line-through">
                  €{originalPrice}
                </span>
              )}
              <span className={`font-bold text-base sm:text-lg ${isReturn ? "text-green-600" : "text-primary"
                }`}>
                €{formattedPrice}
              </span>
            </div>

            {!isReturn && (
              <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded">
                Save €{savings}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
        <button
          type="button"
          onClick={() => {
            setFormData("isReturn", !isReturn)
            setFieldOptions("returnDate", isReturn ? false : true)
            setFieldOptions("returnTime", isReturn ? false : true)
          }}
          className={`
            w-full sm:w-auto px-4 sm:px-6 py-2 rounded-lg font-medium transition-all duration-200 border text-sm sm:text-base cursor-pointer
            ${isReturn
              ? "bg-white text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
              : "bg-primary text-white border-primary hover:bg-primary/90 hover:border-primary/90"
            }
          `}
        >
          {isReturn ? "Remove Return" : "Add Return"}
        </button>
      </div>
    </div>
  )
}