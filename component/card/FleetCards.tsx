import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Users, Briefcase, Zap, Car, Euro } from "lucide-react";

type Vehicle = {
  name: string;
  imageUrl: string;
};

type Pricing = {
  perKm: number;
  hourly: number;
  airport: number;
};

type FleetCardProps = {
  category: string;
  vehicles: Vehicle[];
  imageUrl: string;
  imageAlt?: string;
  passengers?: number;
  luggage?: number;
  hasChargingPort?: boolean;
  viewDetailsLabel?: string;
  bookNowLabel?: string;
  viewDetailsHref: string;
  bookNowHref: string;
  pricing?: Pricing;
  className?: string;
};

export default function FleetCards({
  category,
  vehicles,
  imageUrl,
  imageAlt = "Vehicle",
  passengers,
  luggage,
  hasChargingPort,
  viewDetailsLabel = "VIEW DETAILS",
  bookNowLabel = "BOOK NOW",
  viewDetailsHref,
  bookNowHref,
  pricing,
  className = "",
}: FleetCardProps) {
  return (
    <article className={`w-full border border-gray-200 overflow-hidden bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 ${className}`}>
      {/* Category Header */}
      <div className="bg-primary text-white py-4 px-6 text-center">
        <h6 className="text-xl font-bold uppercase tracking-wide">{category}</h6>
       
      </div>

      {/* Main Vehicle Image */}
      <div className="bg-white flex items-center justify-center p-6">
        <div className="relative w-full h-48">
          <Image 
            src={imageUrl} 
            alt={imageAlt || `${category} vehicle`} 
            fill 
            className="object-contain" 
            sizes="(max-width: 640px) 100vw, 384px"
            priority={false}
          />
        </div>
      </div>

      {/* Vehicle Models List */}
      <div className="px-6 py-4 bg-gray-50 border-t border-b border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Car className="h-4 w-4" />
          Available Models:
        </h4>
      <div className="grid grid-cols-3 gap-4">
  {vehicles.slice(0, 3).map((vehicle, index) => (
    <div key={index} className="flex items-center justify-center text-sm">
      <div className="text-gray-600">{vehicle.name}</div>
    </div>
  ))}
</div>
      </div>

      {/* Features Section */}
      <div className="px-6 py-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          {typeof passengers === "number" && (
            <div className="flex items-center gap-2 text-gray-700">
              <div className="flex items-center justify-center w-6 h-6 bg-primary/10 rounded-full">
                <Users className="h-3 w-3 text-primary" />
              </div>
              <span className="text-xs font-medium">{passengers} Passengers</span>
            </div>
          )}
          {typeof luggage === "number" && (
            <div className="flex items-center gap-2 text-gray-700">
              <div className="flex items-center justify-center w-6 h-6 bg-primary/10 rounded-full">
                <Briefcase className="h-3 w-3 text-primary" />
              </div>
              <span className="text-xs font-medium">{luggage} Luggage</span>
            </div>
          )}
          {/* {hasChargingPort && (
            <div className="flex items-center gap-2 text-gray-700">
              <div className="flex items-center justify-center w-6 h-6 bg-primary/10 rounded-full">
                <Zap className="h-3 w-3 text-primary" />
              </div>
              <span className="text-xs font-medium">Charging Port</span>
            </div>
          )} */}
        </div>
      </div>

   

      {/* Action Buttons */}
      <div className="px-6 py-4">
        <div className="flex flex-col gap-2">
          
          <Link 
            href="/" 
            className="w-full bg-primary text-white text-sm font-semibold h-10 px-4 flex items-center justify-center hover:bg-primary/90 transition-colors rounded-lg"
          >
            {bookNowLabel}
          </Link>
        </div>
      </div>
    </article>
  );
}