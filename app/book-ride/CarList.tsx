"use client";

import React from "react";
import Image from "next/image";
import { GoPeople } from "react-icons/go";
import { PiSuitcase } from "react-icons/pi";
import { cn } from "@/lib/utils";
import useFormStore from "@/stores/FormStore";
import { brandColor } from "@/lib/colors";
import { ArrowRight, TrendingDown, Award, Flame, Clock } from "lucide-react";
import LoadingButton from "./LoadingButton";

// --- Pricing configuration ---
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
  { min: 200, max: Infinity },
];

const categoryPricing = {
  ECONOMY: [6.5, 4.5, 4.0, 2.9, 2.7, 2.5, 2.0, 1.8, 1.8, 1.75, 1.7],
  BUSINESS_SEDAN: [11.0, 6.8, 5.0, 4.3, 3.8, 3.0, 2.35, 2.2, 2.12, 1.9, 1.9],
  ECONOMY_VAN: [12.5, 7.5, 5.0, 4.95, 3.9, 3.2, 2.5, 2.4, 2.3, 2.14, 2.0],
  BUSINESS_VAN: [23.8, 13.2, 9.3, 9.3, 7.5, 6.0, 4.75, 4.65, 4.36, 4.0, 3.8],
  MINIBUS_12: [30.0, 18.0, 13.25, 11.5, 9.95, 8.0, 7.23, 6.3, 5.8, 5.34, 5.3],
  MINIBUS_16: [39.6, 22.4, 14.8, 12.9, 11.15, 8.98, 8.1, 7.12, 6.48, 6.0, 5.95],
};

const categoryBadges = {
  ECONOMY: {
    text: "Best Value",
    bgColor: "bg-green-500",
    textColor: "text-white",
    icon: TrendingDown,
  },
  BUSINESS_VAN: {
    text: "Top Class",
    bgColor: "bg-gray-700",
    textColor: "text-white",
    icon: Award,
  },
  BUSINESS_SEDAN: {
    text: "Most Popular",
    bgColor: "bg-red-500",
    textColor: "text-white",
    icon: Flame,
  },
};

export const fleets = [
  {
    category: "ECONOMY",
    displayName: "Economy",
    vehicles: ["Toyota Corolla Hybrid", "Or Similar"],
    passengers: 4,
    luggage: 4,
    imageUrl: "/Econamy.webp",
    pricing: { perKm: 1.5, hourly: 30, airport: 35 },
    hasChargingPort: false,
  },
  {
    category: "BUSINESS_SEDAN",
    displayName: "Business Sedan",
    vehicles: ["Mercedes E Class or superior"],
    passengers: 4,
    luggage: 4,
    imageUrl: "/Mercedes-S-Class-cutout.webp",
    pricing: { perKm: 1.7, hourly: 40, airport: 50 },
    hasChargingPort: true,
    priceIncrease: 0.08,
  },
  {
    category: "ECONOMY_VAN",
    displayName: "Economy Van",
    vehicles: ["Mercedes Vito", "Or Similar"],
    passengers: 8,
    luggage: 8,
    imageUrl: "/Economy Van.png",
    pricing: { perKm: 2.0, hourly: 50, airport: 50 },
    hasChargingPort: false,
  },
  {
    category: "BUSINESS_VAN",
    displayName: "First Class Van",
    vehicles: ["Mercedes V Class or similar"],
    passengers: 7,
    luggage: 7,
    imageUrl: "/First Class Van.png",
    pricing: { perKm: 2.5, hourly: 60, airport: 60 },
    hasChargingPort: true,
    priceIncrease: 0.10,
  },
  {
    category: "MINIBUS_12",
    displayName: "Minibus 12 (or two vans)",
    vehicles: ["Mercedes Sprinter or similar"],
    passengers: 12,
    luggage: 12,
    imageUrl: "/Minibus 12.png",
    pricing: { perKm: 3.5, hourly: 80, airport: 85 },
    hasChargingPort: true,
  },
  {
    category: "MINIBUS_16",
    displayName: "Minibus 16 (or two vans)",
    vehicles: ["Mercedes Sprinter or similar"],
    passengers: 16,
    luggage: 16,
    imageUrl: "/Minibus 16.png",
    pricing: { perKm: 4.0, hourly: 100, airport: 100 },
    hasChargingPort: true,
  },
];

function CarList() {
  const { formData, category, setFormData, changeStep, formLoading } = useFormStore();
  console.log("formData", formData);

  const passengers = Number(formData.passengers?.value) || 1;
  const bags = Number(formData.bags?.value) || 0;

  // Check if booking is within 24 hours
  const isWithin24Hours = () => {
    const selectedDate = formData.date?.value;
    const selectedTime = formData.time?.value;

    if (!selectedDate) return false;

    const now = new Date();
    const bookingDateTime = new Date(selectedDate);

    // Add time if available
    if (selectedTime) {
      const [hours, minutes] = selectedTime.split(':');
      bookingDateTime.setHours(parseInt(hours), parseInt(minutes));
    }

    const diffInHours = (bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    return diffInHours >= 0 && diffInHours <= 24;
  };

  const has24HourSurge = isWithin24Hours();

  const filteredFleets = fleets.filter(car =>
    car.passengers >= passengers && car.luggage >= bags
  );

  const handleSelect = (categoryData: typeof fleets[0], finalPrice: number) => {
    setFormData("car", categoryData.category, "");
    setFormData("price", finalPrice.toString(), "");
    changeStep(true, 2);
  };

  const calculatePrice = (categoryData: typeof fleets[0]) => {
    let computedPrice = 0;
    if (category === "hourly") {
      const durationValue = Number(formData.duration?.value || 1);
      computedPrice = durationValue * categoryData.pricing.hourly;
    } else if (category === "trip" || !category) {
      const totalDistance = Number(formData.distance?.value || 0);
      if (totalDistance > 0) {
        const rangeIndex = pricingRanges.findIndex(
          (range) => totalDistance > range.min && totalDistance <= range.max
        );
        const pricePerKm =
          categoryPricing[categoryData.category as keyof typeof categoryPricing]?.[rangeIndex] ||
          categoryData.pricing.perKm;
        computedPrice = totalDistance * pricePerKm;
      }
    } else {
      computedPrice = categoryData.pricing.airport;
    }

    const originalPrice = Number(computedPrice.toFixed(2));
    const priceIncrease = (categoryData as any).priceIncrease || 0;
    const increasedPrice =
      priceIncrease > 0 ? Number((computedPrice * (1 + priceIncrease)).toFixed(2)) : originalPrice;

    // Apply 10% increase if within 24 hours
    const finalPrice = has24HourSurge ? originalPrice * 1.1 : originalPrice;
    const finalIncreasedPrice = has24HourSurge ? increasedPrice * 1.1 : increasedPrice;

    return {
      original: Number(finalPrice.toFixed(2)),
      increased: Number(finalIncreasedPrice.toFixed(2)),
      basePrice: originalPrice,
      surgeApplied: has24HourSurge
    };

  };

  const hasPriceIncrease = (category: string) => {
    return category === "BUSINESS_SEDAN" || category === "BUSINESS_VAN";
  };

  if (filteredFleets.length === 0) {
    return (
      <div className="w-full text-center py-8">
        <div className="text-gray-500 text-lg mb-4">
          No vehicles available for {passengers} passengers and {bags} bags
        </div>
        <div className="text-sm text-gray-400">
          Please adjust your passenger or bag count and try again
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4 overflow-x-hidden">
      {filteredFleets.map((categoryData) => {
        const priceData = calculatePrice(categoryData);
        const originalPrice = priceData.original.toFixed(2);
        const increasedPrice = priceData.increased.toFixed(2);
        const badge = categoryBadges[categoryData.category as keyof typeof categoryBadges];
        const BadgeIcon = badge?.icon;
        const shouldShowIncreasedPrice = hasPriceIncrease(categoryData.category);

        return (
          <div
            key={categoryData.category}
            className={cn(
              "bg-white border rounded-xl shadow-sm overflow-hidden p-3 relative",
              "hover:shadow-md transition-shadow duration-200",
              categoryData.category === formData.car.value ? "border-brand" : "border-gray-200"
            )}
          >
            {badge && (
              <div
                className={cn(
                  "absolute top-2 right-2 md:top-3 md:right-3 z-10 hidden md:flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold",
                  badge.bgColor,
                  badge.textColor
                )}
              >
                {BadgeIcon && <BadgeIcon size={12} className="md:w-3.5 md:h-3.5" />}
                <span className="text-[10px] md:text-xs">{badge.text}</span>
              </div>
            )}

            {/* Mobile Layout */}
            <div className="md:hidden flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-24 h-20 relative shrink-0 overflow-hidden rounded-md">
                  <Image
                    src={categoryData.imageUrl}
                    alt={categoryData.displayName}
                    fill
                    sizes="100px"
                    className="object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h6 className="text-base font-semibold text-gray-900 uppercase truncate">
                      {categoryData.displayName}
                    </h6>
                    {badge && (
                      <div
                        className={cn(
                          "flex md:hidden items-center gap-1 px-1 py-0.5 rounded text-[10px] font-semibold",
                          badge.bgColor,
                          badge.textColor
                        )}
                      >
                        {BadgeIcon && <BadgeIcon size={10} />}
                        <span>{badge.text}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-1 text-xs text-gray-700 mt-1">
                    {categoryData.vehicles.map((v, i, arr) => (
                      <span key={i}>
                        {v}
                        {i < arr.length - 1 && ","}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-gray-700 text-sm">
                  <div className="flex items-center gap-1">
                    <GoPeople size={16} color={brandColor} />
                    <span>{categoryData.passengers}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <PiSuitcase size={16} color={brandColor} />
                    <span>{categoryData.luggage}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {shouldShowIncreasedPrice ? (
                    <>
                      <div className="text-lg font-bold text-red-600">€{originalPrice}</div>
                      <div className="text-base text-gray-500 line-through">€{increasedPrice}</div>
                    </>
                  ) : (
                    <div className="text-xl font-bold text-gray-900">€{originalPrice}</div>
                  )}
                </div>
              </div>

              <div className="w-full">
                {formLoading && formData.car.value === categoryData.category ? (
                  <LoadingButton />
                ) : (
                  <button
                      onClick={() => handleSelect(categoryData, priceData.original)}
                      className="bg-primary hover:bg-[#ffb300] text-white rounded-lg px-4 py-2 transition-all w-full flex items-center justify-center gap-2 font-semibold text-base"
                    aria-label={`Select ${categoryData.displayName}`}
                  >
                    <span>Select Vehicle</span>
                      <ArrowRight size={18} />
                  </button>
                )}
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:grid grid-cols-8 gap-3">
              <div className="col-span-2 flex items-center justify-center">
                <div className="w-full max-w-[140px] h-[100px] relative overflow-hidden rounded-md">
                  <Image
                    src={categoryData.imageUrl}
                    alt={categoryData.displayName}
                    fill
                    sizes="140px"
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="col-span-4 flex flex-col justify-center gap-1">
                <h6 className="text-xl font-semibold text-gray-900 uppercase">
                  {categoryData.displayName}
                </h6>
                <div className="flex flex-wrap items-center gap-1 text-base text-gray-600">
                  {categoryData.vehicles.map((v, i, arr) => (
                    <span key={i}>
                      {v}
                      {i < arr.length - 1 && ","}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-gray-700 text-sm mt-2">
                  <div className="flex items-center gap-1">
                    <GoPeople size={18} color={brandColor} />
                    <span>{categoryData.passengers}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <PiSuitcase size={18} color={brandColor} />
                    <span>{categoryData.luggage}</span>
                  </div>
                </div>

                <div className="flex items-end gap-3 mt-3">
                  {shouldShowIncreasedPrice ? (
                    <div className="flex items-center gap-3">
                      <div className="text-2xl font-bold text-red-600">€{originalPrice}</div>
                      <div className="text-xl text-gray-500 line-through">€{increasedPrice}</div>
                    </div>
                  ) : (
                    <div className="text-2xl font-bold text-gray-900">€{originalPrice}</div>
                  )}
                </div>
              </div>

              <div className="col-span-2 flex items-end justify-center">
                {formLoading && formData.car.value === categoryData.category ? (
                  <LoadingButton />
                ) : (
                  <button
                      onClick={() => handleSelect(categoryData, priceData.original)}
                      className="bg-primary hover:bg-[#ffb300] text-white rounded-md py-2 transition-all w-full flex items-center justify-center gap-2 font-medium text-base"
                    aria-label={`Select ${categoryData.displayName}`}
                  >
                      <span>Select Vehicle</span>
                    <ArrowRight size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default CarList;