"use client";

import React from "react";
import Image from "next/image";
import { GoPeople } from "react-icons/go";
import { PiSuitcase } from "react-icons/pi";
import { cn } from "@/lib/utils";
import useFormStore from "@/stores/FormStore";
import { brandColor } from "@/lib/colors";
import { ArrowRight } from "lucide-react";
import LoadingButton from "./LoadingButton";

// Pricing structure based on your Excel sheets
const pricingRanges = [
  { min: 0, max: 5 },
  { min: 5, max: 10 },
  { min: 10, max: 15 },
  { min: 15, max: 20 },
  { min: 20, max: 30 },
  { min: 30, max: 50 },
  { min: 50, max: 75 },
  { min: 75, max: 100 },
  { min: 100, max: 150 },
  { min: 150, max: 200 },
  { min: 200, max: Infinity }
];

const categoryPricing = {
  ECONOMY: [8.00, 5.25, 4.50, 3.20, 2.80, 2.50, 2.00, 1.80, 1.80, 1.75, 1.70],
  BUSINESS_SEDAN: [14.00, 7.80, 5.50, 4.50, 3.80, 3.00, 2.35, 2.20, 2.12, 1.90, 1.90],
  ECONOMY_VAN: [14.12, 8.00, 4.95, 4.95, 3.90, 3.20, 2.50, 2.40, 2.30, 2.14, 2.00],
  BUSINESS_VAN: [26.80, 15.20, 9.30, 9.30, 7.50, 6.00, 4.75, 4.65, 4.36, 4.00, 3.80],
  MINIBUS_12: [35.32, 20.00, 13.25, 11.50, 9.95, 8.00, 7.23, 6.30, 5.80, 5.34, 5.30],
  MINIBUS_16: [39.60, 22.40, 14.80, 12.90, 11.15, 8.98, 8.10, 7.12, 6.48, 6.00, 5.95]
};

/**
 * Vehicle categories with their respective cars and pricing - Updated according to requirements
 */
export const fleets = [
  {
    category: "ECONOMY",
    displayName: "Economy",
    vehicles: [
      "Toyoya Corolla hybrid",
      "Ford Mondeo", 
      "Volkswagen Passat",
      "Skoda Octavia, or superior"
    ],
    passengers: 4,
    luggage: 4,
    hasChargingPort: true,
    imageUrl: "/Rectangle 21.png",
    pricing: {
      perKm: 1.5, // Fallback price
      hourly: 30,
      airport: 35
    }
  },
  {
    category: "BUSINESS_SEDAN",
    displayName: "Business Sedan",
    vehicles: [
      "Mercedes E Class or superior"
    ],
    passengers: 4,
    luggage: 4,
    hasChargingPort: true,
    imageUrl: "/Rectangle 21 (2).png",
    pricing: {
      perKm: 1.7, // Fallback price
      hourly: 40,
      airport: 50
    }
  },
  {
    category: "ECONOMY_VAN",
    displayName: "Economy Van",
    vehicles: [
      "Mercedes Vito",
      "Volkswagen Caravelle", 
      "Ford Transit Custom or superior"
    ],
    passengers: 8,
    luggage: 8,
    hasChargingPort: true,
    imageUrl: "/Rectangle 21 (11).png",
    pricing: {
      perKm: 2.0, // Fallback price
      hourly: 50,
      airport: 50
    }
  },
  {
    category: "BUSINESS_VAN",
    displayName: "Business Van",
    vehicles: [
      "Mercedes V Class or similar"
    ],
    passengers: 7,
    luggage: 7,
    hasChargingPort: true,
    imageUrl: "/Rectangle 21 (14).png",
    pricing: {
      perKm: 2.5, // Fallback price
      hourly: 60,
      airport: 60
    }
  },
  {
    category: "MINIBUS_12",
    displayName: "Minibus 12",
    vehicles: [
      "Mercedes sprinter or similar (or two vans)"
    ],
    passengers: 12,
    luggage: 12,
    hasChargingPort: true,
    imageUrl: "/Rectangle 21 (15).png",
    pricing: {
      perKm: 3.5, // Fallback price
      hourly: 80,
      airport: 85
    }
  },
  {
    category: "MINIBUS_16",
    displayName: "Minibus 16",
    vehicles: [
      "Mercedes sprinter or similar (or two vans)"
    ],
    passengers: 16,
    luggage: 16,
    hasChargingPort: true,
    imageUrl: "/Rectangle 21 (18).png",
    pricing: {
      perKm: 4.0, // Fallback price
      hourly: 100,
      airport: 100
    }
  }
];

/**
 * CarList component — renders category cards with pricing
 */
function CarList() {
  const { formData, category, setFormData, changeStep, formLoading } = useFormStore();

  const handleSelect = (categoryData: typeof fleets[0], price: number) => {
    setFormData("car", categoryData.category, "");
    setFormData("price", price.toString(), "");
    changeStep(true, 2);
  };

  // Calculate price based on distance ranges
  const calculatePrice = (categoryData: typeof fleets[0]) => {
    let computedPrice = 0;

    if (category === "hourly") {
      // Hourly rate calculation
      const durationValue = Number(formData.duration?.value || 1);
      computedPrice = isFinite(durationValue) 
        ? (durationValue * categoryData.pricing.hourly) 
        : categoryData.pricing.hourly;
    } else if (category === "trip" || !category) {
      // Point-to-point: dynamic pricing based on distance ranges
      const totalDistance = Number(formData.distance?.value || 0);
      
      if (totalDistance > 0) {
        // Find the appropriate price range
        const rangeIndex = pricingRanges.findIndex(range => 
          totalDistance > range.min && totalDistance <= range.max
        );
        
        if (rangeIndex !== -1) {
          const pricePerKm = categoryPricing[categoryData.category as keyof typeof categoryPricing]?.[rangeIndex];
          if (pricePerKm) {
            computedPrice = totalDistance * pricePerKm;
          } else {
            // Fallback to perKm pricing if range not found
            computedPrice = totalDistance * categoryData.pricing.perKm;
          }
        } else {
          // Fallback for distances beyond defined ranges
          computedPrice = totalDistance * categoryData.pricing.perKm;
        }
      }
    } else {
      // Airport or any other fixed rate (fallback to airport pricing)
      computedPrice = categoryData.pricing.airport;
    }

    return Number(computedPrice.toFixed(2));
  };

  // Get price per km for display
  const getPricePerKm = (categoryData: typeof fleets[0]) => {
    const totalDistance = Number(formData.distance?.value || 0);
    
    if (totalDistance > 0 && (category === "trip" || !category)) {
      const rangeIndex = pricingRanges.findIndex(range => 
        totalDistance > range.min && totalDistance <= range.max
      );
      
      if (rangeIndex !== -1) {
        const pricePerKm = categoryPricing[categoryData.category as keyof typeof categoryPricing]?.[rangeIndex];
        if (pricePerKm) {
          return `€${pricePerKm.toFixed(2)}/km`;
        }
      }
    }
    
    return `€${categoryData.pricing.perKm.toFixed(2)}/km`;
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {fleets.map((categoryData) => {
        const computedPrice = calculatePrice(categoryData);
        const displayPrice = computedPrice.toFixed(2);
        const pricePerKm = getPricePerKm(categoryData);
        const vehicleNames = categoryData.vehicles;

        return (
          <div
            key={categoryData.category}
            className={cn(
              "grid grid-cols-8 gap-3 bg-white border rounded-xl shadow-sm overflow-hidden p-3",
              "hover:shadow-md transition-shadow duration-200",
              categoryData.category === formData.car.value ? "border-brand" : "border-gray-200"
            )}
          >
            {/* Image */}
            <div className="col-span-2 flex items-center justify-center bg-white">
              <div className="w-full max-w-[140px] h-[100px] relative">
                <Image
                  src={categoryData.imageUrl}
                  alt={categoryData.displayName}
                  fill
                  sizes="(max-width: 640px) 80px, 140px"
                  className="md:object-cover object-contain"
                />
              </div>
            </div>

            {/* Details */}
            <div className="col-span-4 flex flex-col justify-center gap-1">
              <h6 className="text-base md:text-xl font-semibold text-gray-900 uppercase">
                {categoryData.displayName}
              </h6>
              
              {/* Vehicle names in grid layout - max 3 per row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-1 mt-2">
                {vehicleNames.map((vehicle, index) => (
                  <div key={index} className="text-gray-600 text-xs md:text-sm">
                    {vehicle}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-4 text-gray-700 text-sm mt-2">
                <div className="flex items-center gap-1">
                  <GoPeople size={16} color={brandColor} />
                  <span>{categoryData.passengers} persons</span>
                </div>
                <div className="flex items-center gap-1">
                  <PiSuitcase size={16} color={brandColor} />
                  <span>{categoryData.luggage} luggage</span>
                </div>
              </div>

              <div className="flex items-end gap-3 mt-3">
                <div className="text-xl md:text-2xl font-bold text-gray-900">
                  €{displayPrice}
                </div>
               
              </div>
            </div>

            {/* Action */}
            <div className="col-span-2 flex items-end justify-center">
              {formLoading && formData.car.value === categoryData.category ? (
                <LoadingButton />
              ) : (
                <button
                  onClick={() => handleSelect(categoryData, Number(displayPrice))}
                  className="bg-primary hover:bg-[#ffb300] text-white rounded-md px-3 py-2 transition-all w-full flex items-center justify-center gap-2"
                  aria-label={`Select ${categoryData.displayName}`}
                >
                  <span>Select</span>
                  <span className="hidden md:inline">Vehicle</span>
                  <ArrowRight size={18} />
                </button>
              )}
            </div>
          </div>
        );
      })}

      {/* Back button */}
      <div
        onClick={() => {
          changeStep(false, 2);
        }}
        className="p-2 rounded-lg border border-gray-500 w-full text-center text-gray-700 font-semibold cursor-pointer"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") changeStep(false, 2);
        }}
      >
        Back
      </div>
    </div>
  );
}

export default CarList;