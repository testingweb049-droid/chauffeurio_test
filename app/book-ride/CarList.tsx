"use client";

import React from "react";
import Image from "next/image";
import { GoPeople } from "react-icons/go";
import { PiSuitcase } from "react-icons/pi";
import { cn } from "@/lib/utils";
import useFormStore from "@/stores/FormStore";
import { brandColor } from "@/lib/colors";
import { ArrowRight, TrendingDown, Award, Flame } from "lucide-react";
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

// Badge configuration for different categories
const categoryBadges = {
  ECONOMY: {
    text: "Best Value",
    bgColor: "bg-green-500",
    textColor: "text-white",
    icon: TrendingDown
  },
  BUSINESS_VAN: {
    text: "Top Class",
    bgColor: "bg-gray-700",
    textColor: "text-white",
    icon: Award
  },
  BUSINESS_SEDAN: {
    text: "Most Popular",
    bgColor: "bg-red-500",
    textColor: "text-white",
    icon: Flame
  }
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
      "Or Similar",
    ],
    passengers: 4,
    luggage: 4,
    hasChargingPort: true,
    imageUrl: "/Econamy.webp",
    pricing: {
      perKm: 1.5,
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
    imageUrl: "/Mercedes-S-Class-cutout.webp",
    pricing: {
      perKm: 1.7,
      hourly: 40,
      airport: 50
    }
  },
  {
    category: "ECONOMY_VAN",
    displayName: "Economy Van",
    vehicles: [
      "Mercedes Vito",
      "Or Similar"
    ],
    passengers: 8,
    luggage: 8,
    hasChargingPort: true,
    imageUrl: "/Economy Van.png",
    pricing: {
      perKm: 2.0,
      hourly: 50,
      airport: 50
    }
  },
  {
    category: "BUSINESS_VAN",
    displayName: "First Class Van",
    vehicles: [
      "Mercedes V Class or similar"
    ],
    passengers: 7,
    luggage: 7,
    hasChargingPort: true,
    imageUrl: "/First Class Van.png",
    pricing: {
      perKm: 2.5,
      hourly: 60,
      airport: 60
    }
  },
  {
    category: "MINIBUS_12",
    displayName: "Minibus 12 (or two vans)",
    vehicles: [
      "Mercedes sprinter or similar"
    ],
    passengers: 12,
    luggage: 12,
    hasChargingPort: true,
    imageUrl: "/Minibus 16.png",
    pricing: {
      perKm: 3.5,
      hourly: 80,
      airport: 85
    }
  },
  {
    category: "MINIBUS_16",
    displayName: "Minibus 16 (or two vans)",
    vehicles: [
      "Mercedes sprinter or similar"
    ],
    passengers: 16,
    luggage: 16,
    hasChargingPort: true,
    imageUrl: "/Minibus 16.png",
    pricing: {
      perKm: 4.0,
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
      const durationValue = Number(formData.duration?.value || 1);
      computedPrice = isFinite(durationValue)
        ? (durationValue * categoryData.pricing.hourly)
        : categoryData.pricing.hourly;
    } else if (category === "trip" || !category) {
      const totalDistance = Number(formData.distance?.value || 0);

      if (totalDistance > 0) {
        const rangeIndex = pricingRanges.findIndex(range =>
          totalDistance > range.min && totalDistance <= range.max
        );

        if (rangeIndex !== -1) {
          const pricePerKm = categoryPricing[categoryData.category as keyof typeof categoryPricing]?.[rangeIndex];
          if (pricePerKm) {
            computedPrice = totalDistance * pricePerKm;
          } else {
            computedPrice = totalDistance * categoryData.pricing.perKm;
          }
        } else {
          computedPrice = totalDistance * categoryData.pricing.perKm;
        }
      }
    } else {
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
        const badge = categoryBadges[categoryData.category as keyof typeof categoryBadges];
        const BadgeIcon = badge?.icon;

        return (
          <div
            key={categoryData.category}
            className={cn(
              "bg-white border rounded-xl shadow-sm overflow-hidden p-3 relative",
              "hover:shadow-md transition-shadow duration-200",
              categoryData.category === formData.car.value ? "border-brand" : "border-gray-200"
            )}
          >
            {/* Badge */}
            {badge && (
              <div className={cn(
                "absolute top-2 right-2 md:top-3 md:right-3 z-10 flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold",
                badge.bgColor,
                badge.textColor
              )}>
                {BadgeIcon && <BadgeIcon size={12} className="md:w-[14px] md:h-[14px]" />}
                <span className="text-[10px] md:text-xs">{badge.text}</span>
              </div>
            )}

            {/* Mobile Layout (below md) */}
            <div className="md:hidden flex flex-col gap-3">
              {/* Image and Title Row */}
              <div className="flex items-center gap-3">
                <div className="w-20 h-16 relative flex-shrink-0">
                  <Image
                    src={categoryData.imageUrl}
                    alt={categoryData.displayName}
                    fill
                    sizes="80px"
                    className="object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h6 className="text-sm font-semibold text-gray-900 uppercase truncate">
                    {categoryData.displayName}
                  </h6>
                  <div className="flex flex-wrap items-center gap-1 text-[10px] text-gray-600 mt-1">
                    {vehicleNames.slice(0, 2).map((vehicle, index, array) => (
                      <span key={index} className="flex items-center">
                        <span>{vehicle}</span>
                        {index < array.length - 1 && <span>,</span>}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Info Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-gray-700 text-sm">
                  <div className="flex items-center gap-1">
                    <GoPeople size={14} color={brandColor} />
                    <span className="text-xs">{categoryData.passengers}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <PiSuitcase size={14} color={brandColor} />
                    <span className="text-xs">{categoryData.luggage}</span>
                  </div>
                </div>
                <div className="text-lg font-bold text-gray-900">
                  €{displayPrice}
                </div>
              </div>

              {/* Action Button */}
              <div className="w-full">
                {formLoading && formData.car.value === categoryData.category ? (
                  <LoadingButton />
                ) : (
                  <button
                    onClick={() => handleSelect(categoryData, Number(displayPrice))}
                    className="bg-primary hover:bg-[#ffb300] text-white rounded-lg px-4 py-2.5 transition-all w-full flex items-center justify-center gap-2 font-medium text-sm"
                    aria-label={`Select ${categoryData.displayName}`}
                  >
                    <span>Select Vehicle</span>
                    <ArrowRight size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Desktop Layout (md and above) */}
            <div className="hidden md:grid grid-cols-8 gap-3">
              {/* Image */}
              <div className="col-span-2 flex items-center justify-center bg-white">
                <div className="w-full max-w-[140px] h-[100px] relative">
                  <Image
                    src={categoryData.imageUrl}
                    alt={categoryData.displayName}
                    fill
                    sizes="140px"
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Details */}
              <div className="col-span-4 flex flex-col justify-center gap-1">
                <h6 className="text-xl font-semibold text-gray-900 uppercase">
                  {categoryData.displayName}
                </h6>
                <div className="flex flex-wrap items-center gap-1 text-[10px] text-gray-600">
                  {vehicleNames.slice(0, 3).map((vehicle, index, array) => (
                    <span
                      key={index}
                      className="flex items-center max-w-full truncate"
                    >
                      <span>{vehicle}</span>
                      {index < array.length - 1 && <span>,</span>}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-gray-700 text-sm mt-2">
                  <div className="flex items-center gap-1">
                    <GoPeople size={16} color={brandColor} />
                    <span>{categoryData.passengers}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <PiSuitcase size={16} color={brandColor} />
                    <span>{categoryData.luggage}</span>
                  </div>
                </div>

                <div className="flex items-end gap-3 mt-3">
                  <div className="text-2xl font-bold text-gray-900">
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
                    <span>Vehicle</span>
                    <ArrowRight size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Back button */}
      <div
        onClick={() => {
          changeStep(false, 2);
        }}
        className="p-2 rounded-lg border border-gray-500 w-full text-center text-gray-700 font-semibold cursor-pointer hover:bg-gray-50 transition-colors"
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