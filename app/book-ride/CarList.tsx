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

/**
 * Vehicle categories with their respective cars and pricing
 */
export const fleets = [
  {
    category: "ECONOMY",
    displayName: "Economy",
    vehicles: [
      { name: "Skoda Octavia", imageUrl: "/Rectangle 21.png" },
      { name: "Toyota Prius", imageUrl: "/Rectangle 21 (1).png" }
    ],
    passengers: 4,
    luggage: 4,
    hasChargingPort: true,
    pricing: {
      perKm: 1.5,
      hourly: 30,
      airport: 35
    }
  },
  {
    category: "BUSINESS CLASS",
    displayName: "Business Class",
    vehicles: [
      { name: "Mercedes E-Class", imageUrl: "/Rectangle 21 (2).png" },
      { name: "BMW 5 Series", imageUrl: "/Rectangle 21 (3).png" },
      { name: "Cadillac XTS", imageUrl: "/Rectangle 21 (4).png" }
    ],
    passengers: 4,
    luggage: 4,
    hasChargingPort: true,
    pricing: {
      perKm: 1.7,
      hourly: 40,
      airport: 50
    }
  },
  {
    category: "FIRST CLASS",
    displayName: "First Class",
    vehicles: [
      { name: "Mercedes S-Class", imageUrl: "/Rectangle 21 (5).png" },
      { name: "BMW 7 Series", imageUrl: "/Rectangle 21 (6).png" },
      { name: "Audi A8", imageUrl: "/Rectangle 21 (8).png" },
      { name: "Cadillac Escalade", imageUrl: "/Rectangle 21 (9).png" }
    ],
    passengers: 4,
    luggage: 4,
    hasChargingPort: true,
    pricing: {
      perKm: 2.5,
      hourly: 55,
      airport: 60
    }
  },
  {
    category: "ECONOMY VAN",
    displayName: "Economy Van",
    vehicles: [
      { name: "Mercedes Vito", imageUrl: "/Rectangle 21 (11).png" },
      { name: "Ford Custom", imageUrl: "/Rectangle 21 (12).png" },
      { name: "Chevrolet Suburban", imageUrl: "/Rectangle 21 (13).png" }
    ],
    passengers: 7,
    luggage: 6,
    hasChargingPort: true,
    pricing: {
      perKm: 2.0,
      hourly: 50,
      airport: 50
    }
  },
  {
    category: "PREMIUM VAN",
    displayName: "Premium Van",
    vehicles: [
      { name: "Mercedes V-Class", imageUrl: "/Rectangle 21 (14).png" },
      { name: "Cadillac Escalade", imageUrl: "/Rectangle 21 (9).png" }
    ],
    passengers: 7,
    luggage: 6,
    hasChargingPort: true,
    pricing: {
      perKm: 2.5,
      hourly: 60,
      airport: 60
    }
  },
  {
    category: "MINIBUS 12",
    displayName: "Minibus 12",
    vehicles: [
      { name: "Mercedes Sprinter", imageUrl: "/Rectangle 21 (15).png" },
      { name: "Ford Transit", imageUrl: "/Rectangle 21 (17).png" }
    ],
    passengers: 12,
    luggage: 10,
    hasChargingPort: true,
    pricing: {
      perKm: 3.5,
      hourly: 80,
      airport: 85
    }
  },
  {
    category: "MINIBUS 16",
    displayName: "Minibus 16",
    vehicles: [
      { name: "Mercedes Sprinter", imageUrl: "/Rectangle 21 (18).png" },
      { name: "Ford Transit", imageUrl: "/Rectangle 21 (16).png" }
    ],
    passengers: 16,
    luggage: 12,
    hasChargingPort: true,
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

  // Calculate price based on booking type
  const calculatePrice = (categoryData: typeof fleets[0]) => {
    let computedPrice = 0;

    if (category === "hourly") {
      // Hourly rate calculation
      const durationValue = Number(formData.duration?.value || 1);
      computedPrice = isFinite(durationValue) 
        ? (durationValue * categoryData.pricing.hourly) 
        : categoryData.pricing.hourly;
    } else if (category === "trip" || !category) {
      // Point-to-point: per kilometer rate
      const totalDistance = Number(formData.distance?.value || 0);
      computedPrice = totalDistance * categoryData.pricing.perKm;
    } else {
      // Airport or any other fixed rate (fallback to airport pricing)
      computedPrice = categoryData.pricing.airport;
    }

    return Number(computedPrice.toFixed(2));
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {fleets.map((categoryData) => {
        const computedPrice = calculatePrice(categoryData);
        const displayPrice = computedPrice.toFixed(2);
        const vehicleNames = categoryData.vehicles.map(v => v.name).join(", ");
        const firstVehicle = categoryData.vehicles[0];

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
                  src={firstVehicle.imageUrl}
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
              <h6 className="text-gray-600 text-xs md:text-sm">
                {vehicleNames}
              </h6>

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
                <div className="text-xl md:text-2xl font-bold text-gray-900">
                  €{displayPrice}
                </div>
                <div className="text-xs lg:text-sm text-red-500 line-through">
                  €{(Number(displayPrice) + Number(displayPrice) * 0.1).toFixed(2)}
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