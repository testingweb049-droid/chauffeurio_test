import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Users, Briefcase, Zap } from "lucide-react";

type FleetCardProps = {
  category: string;
  model: string;
  imageUrl: string;
  imageAlt?: string;
  passengers?: number;
  luggage?: number;
  hasChargingPort?: boolean;
  viewDetailsLabel?: string;
  bookNowLabel?: string;
  viewDetailsHref: string;  // e.g. "/fleet/skoda-octavia"
  bookNowHref: string;      // e.g. "/book?car=skoda-octavia"
  className?: string;
};

export default function FleetCards({
  category,
  model,
  imageUrl,
  imageAlt = "Vehicle",
  passengers,
  luggage,
  hasChargingPort,
  viewDetailsLabel = "VIEW DETAILS",
  bookNowLabel = "BOOK NOW",
  viewDetailsHref,
  bookNowHref,
  className = "",
}: FleetCardProps) {
  return (
    <article className={`w-full max-w-sm  border border-gray-200  overflow-hidden bg-white ${className}`}>
      <div className="bg-white flex items-center justify-center p-6 border-t-[8px] border-secondary">
        <div className="relative w-full" style={{ aspectRatio: "4/2" }}>
          <Image src={imageUrl} alt={imageAlt} fill className="object-cover" sizes="(max-width: 640px) 100vw, 384px" />
        </div>
      </div>

      <div className="bg-[#0A2D3A] text-center py-4 px-4">
        <h6 className="text-lg font-semibold text-white">{category}</h6>
        <h6 className="text-white text-[20px]  mt-1">{model}</h6>
      </div>

      <div className="px-5 py-8 space-y-3">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {typeof passengers === "number" && (
            <div className="flex items-center gap-2 text-gray-700">
              <Users className="h-4 w-4 shrink-0" />
              <p className="text-sm">{passengers} Passengers</p>
            </div>
          )}
          {hasChargingPort && (
            <div className="flex items-center gap-2 text-gray-700">
              <Zap className="h-4 w-4 shrink-0" />
              <p className="text-sm">Charging port</p>
            </div>
          )}
          {typeof luggage === "number" && (
            <div className="flex items-center gap-2 text-gray-700">
              <Briefcase className="h-4 w-4 shrink-0" />
              <p className="text-sm">{luggage} Bags</p>
            </div>
          )}
        </div>
      </div>

      <div className="px-5 pb-5">
        <div className="flex items-center">
          <Link href={viewDetailsHref} className="flex-1 rounded-l-full bg-[#DBDBDB] text-primary text-sm font-medium h-11 px-4 flex items-center justify-center hover:bg-gray-200 transition">
            {viewDetailsLabel}
          </Link>
          <Link href={bookNowHref} className="flex-1 rounded-r-full bg-primary text-white text-sm font-semibold h-11 px-4 flex items-center justify-center hover:opacity-90 transition">
            {bookNowLabel}
          </Link>
        </div>
      </div>
    </article>
  );
}
