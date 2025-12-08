// src/components/FleetClasses.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Users, Briefcase } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { fleets } from "@/app/book-ride/CarList";

export default function FleetClasses() {
  const [startIndex, setStartIndex] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const [itemsToShow, setItemsToShow] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1024) setItemsToShow(3);
      else if (width >= 768) setItemsToShow(2);
      else setItemsToShow(1);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Flatten the fleet data to get individual vehicles
  const allVehicles = fleets.flatMap(category => 
    category.vehicles.map(vehicle => ({
      model: vehicle, // vehicle is now a string, not an object
      imageUrl: category.imageUrl, // Use category imageUrl since vehicles are now strings
      passengers: category.passengers,
      luggage: category.luggage,
      hasChargingPort: category.hasChargingPort
    }))
  );

  if (!allVehicles || allVehicles.length === 0) {
    return (
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center py-12 text-gray-600">
            Fleet data is empty — check that `src/data/fleetData.ts` exists and exports `fleets`.
          </div>
        </div>
      </section>
    );
  }

  const getVisibleFleets = () => {
    const visible = [];
    for (let i = 0; i < itemsToShow; i++) {
      const index = (startIndex + i) % allVehicles.length;
      visible.push(allVehicles[index]);
    }
    return visible;
  };

  const handlePrev = () => setStartIndex((p) => (p === 0 ? allVehicles.length - 1 : p - 1));
  const handleNext = () => setStartIndex((p) => (p === allVehicles.length - 1 ? 0 : p + 1));
  const visible = getVisibleFleets();

  return (
    <section className="bg-white py-16" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="mb-8 flex flex-col items-start justify-between md:flex-row md:items-center">
          <div
            className="mb-6 md:mb-0"
            style={{ animation: inView ? "fadeInUp 0.6s ease-out forwards" : "none" }}
          >
            <p className="text-sm uppercase tracking-wider text-gray-500">MEMORABLE JOURNEY</p>
            <h2 className="text-3xl font-bold md:text-4xl">
              Experience <span className="text-brand">Luxury with Our</span> <br className="md:hidden" />
              Chauffeur <span className="text-brand">Services</span>
            </h2>
          </div>

          <div className="flex space-x-2" style={{ animation: inView ? "fadeInRight 0.6s ease-out forwards 0.3s" : "none" }}>
            <button onClick={handlePrev} className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-50" aria-label="Previous fleet">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={handleNext} className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-50" aria-label="Next fleet">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((vehicle, i) => (
            <div key={`${vehicle.model}-${startIndex}-${i}`} className="overflow-hidden rounded-lg bg-white shadow-sm transition-all duration-300 hover:shadow-md" style={{ opacity: 0, animation: inView ? `fadeInUp 0.6s ease-out forwards ${i * 0.1 + 0.3}s` : "none" }}>
              <div className="relative h-64 w-full">
                <Image src={vehicle.imageUrl || "/placeholder.svg"} alt={vehicle.model} fill className="object-cover" />
              </div>

              <div className="p-6">
                <h3 className="mb-2 text-xl font-bold text-gray-900">{vehicle.model}</h3>

                <div className="flex items-center justify-start space-x-6">
                  <div className="flex items-center text-brand">
                    <Users className="mr-2 h-5 w-5" />
                    <span className="text-sm">{vehicle.passengers} passengers</span>
                  </div>

                  <div className="flex items-center text-brand">
                    <Briefcase className="mr-2 h-5 w-5" />
                    <span className="text-sm">{vehicle.luggage} suitcases</span>
                  </div>

                  {vehicle.hasChargingPort && <div className="ml-2 px-2 py-0.5 rounded bg-green-50 text-green-700 text-xs font-medium">Charging Port</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}