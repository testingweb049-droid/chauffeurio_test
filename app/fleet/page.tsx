import FleetCards from "@/component/card/FleetCards";
import HeroSection2 from "@/component/sections/HeroSection2";
import Link from "next/link";

type FleetItem = {
  category: string;
  model: string;
  imageUrl: string;
  passengers: number;
  luggage: number;
  hasChargingPort?: boolean;
  viewDetailsHref: string;
  bookNowHref: string;
};

const FLEET_DATA: FleetItem[] = [
  // ECONOMY
  {
    category: "ECONOMY",
    model: "Skoda Octavia",
    imageUrl: "/Rectangle 21.png",
    passengers: 4,
    luggage: 4,
    hasChargingPort: true,
    viewDetailsHref: "/fleet/skoda-octavia",
    bookNowHref: "/book?car=skoda-octavia",
  },
  {
    category: "ECONOMY",
    model: "Toyota Prius",
    imageUrl: "/Rectangle 21 (1).png",
    passengers: 4,
    luggage: 4,
    hasChargingPort: true,
    viewDetailsHref: "/fleet/toyota-prius",
    bookNowHref: "/book?car=toyota-prius",
  },

  // BUSINESS CLASS
  {
    category: "BUSINESS CLASS",
    model: "Mercedes E-Class",
    imageUrl: "/Rectangle 21 (2).png",
    passengers: 4,
    luggage: 4,
    hasChargingPort: true,
    viewDetailsHref: "/fleet/mercedes-e-class",
    bookNowHref: "/book?car=mercedes-e-class",
  },
  {
    category: "BUSINESS CLASS",
    model: "BMW 5 Series",
    imageUrl: "/Rectangle 21 (3).png",
    passengers: 4,
    luggage: 4,
    hasChargingPort: true,
    viewDetailsHref: "/fleet/bmw-5-series",
    bookNowHref: "/book?car=bmw-5-series",
  },
  {
    category: "BUSINESS CLASS",
    model: "Cadillac CTS",
    imageUrl: "/Rectangle 21 (4).png",
    passengers: 4,
    luggage: 4,
    hasChargingPort: true,
    viewDetailsHref: "/fleet/cadillac-cts",
    bookNowHref: "/book?car=cadillac-cts",
  },

  // FIRST CLASS
  {
    category: "FIRST CLASS",
    model: "Mercedes S-Class",
    imageUrl: "/Rectangle 21 (5).png",
    passengers: 4,
    luggage: 4,
    hasChargingPort: true,
    viewDetailsHref: "/fleet/mercedes-s-class",
    bookNowHref: "/book?car=mercedes-s-class",
  },
  {
    category: "FIRST CLASS",
    model: "BMW 7 Series",
    imageUrl: "/Rectangle 21 (6).png",
    passengers: 4,
    luggage: 4,
    hasChargingPort: true,
    viewDetailsHref: "/fleet/bmw-7-series",
    bookNowHref: "/book?car=bmw-7-series",
  },
  {
    category: "FIRST CLASS",
    model: "Audi A8",
    imageUrl: "/Rectangle 21 (8).png",
    passengers: 4,
    luggage: 4,
    hasChargingPort: true,
    viewDetailsHref: "/fleet/audi-a8",
    bookNowHref: "/book?car=audi-a8",
  },
  {
    category: "FIRST CLASS",
    model: "Cadillac Escalade",
    imageUrl: "/Rectangle 21 (9).png",
    passengers: 6,
    luggage: 6,
    hasChargingPort: true,
    viewDetailsHref: "/fleet/cadillac-escalade",
    bookNowHref: "/book?car=cadillac-escalade",
  },

  // ECONOMY VAN
  {
    category: "ECONOMY VAN",
    model: "Mercedes Vito",
    imageUrl: "/Rectangle 21 (11).png",
    passengers: 7,
    luggage: 6,
    hasChargingPort: true,
    viewDetailsHref: "/fleet/mercedes-vito",
    bookNowHref: "/book?car=mercedes-vito",
  },
  {
    category: "ECONOMY VAN",
    model: "Ford Custom",
    imageUrl: "/Rectangle 21 (12).png",
    passengers: 7,
    luggage: 6,
    hasChargingPort: true,
    viewDetailsHref: "/fleet/ford-custom",
    bookNowHref: "/book?car=ford-custom",
  },
  {
    category: "ECONOMY VAN",
    model: "Chevrolet Excursion",
    imageUrl: "/Rectangle 21 (13).png",
    passengers: 7,
    luggage: 6,
    hasChargingPort: true,
    viewDetailsHref: "/fleet/chevy-excursion",
    bookNowHref: "/book?car=chevy-excursion",
  },

  // PREMIUM VAN
  {
    category: "PREMIUM VAN",
    model: "Mercedes V-Class",
    imageUrl: "/Rectangle 21 (14).png",
    passengers: 7,
    luggage: 6,
    hasChargingPort: true,
    viewDetailsHref: "/fleet/mercedes-v-class",
    bookNowHref: "/book?car=mercedes-v-class",
  },
  {
    category: "PREMIUM VAN",
    model: "Mercedes Sprinter",
    imageUrl: "/Rectangle 21 (15).png",
    passengers: 12,
    luggage: 10,
    hasChargingPort: true,
    viewDetailsHref: "/fleet/mercedes-sprinter",
    bookNowHref: "/book?car=mercedes-sprinter",
  },
  {
    category: "PREMIUM VAN",
    model: "Ford Transit",
    imageUrl: "/Rectangle 21 (16).png",
    passengers: 12,
    luggage: 10,
    hasChargingPort: true,
    viewDetailsHref: "/fleet/ford-transit",
    bookNowHref: "/book?car=ford-transit",
  },
    {
    category: "MINIBUS 12",
    model: "Ford Transit",
    imageUrl: "/Rectangle 21 (17).png",
    passengers: 7,
    luggage: 6,
    hasChargingPort: true,
    viewDetailsHref: "/fleet/mercedes-v-class",
    bookNowHref: "/book?car=mercedes-v-class",
  },
  {
    category: "MINIBUS 16",
    model: "Mercedes Sprinter",
    imageUrl: "/Rectangle 21 (18).png",
    passengers: 12,
    luggage: 10,
    hasChargingPort: true,
    viewDetailsHref: "/fleet/mercedes-sprinter",
    bookNowHref: "/book?car=mercedes-sprinter",
  },
  {
    category: "MINIBUS 16",
    model: "Ford Transit",
    imageUrl: "/Rectangle 21 (16).png",
    passengers: 12,
    luggage: 10,
    hasChargingPort: true,
    viewDetailsHref: "/fleet/ford-transit",
    bookNowHref: "/book?car=ford-transit",
  },
];

export default function Fleet() {
  return (
    <>
      <HeroSection2 bgImage="/hero.jpg" text="Our Fleet" />

      {/* Breadcrumb + header */}
      <section className="px-4 md:px-6 lg:px-10 xl:px-16 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            {/* <p className="text-xs uppercase tracking-widest text-gray-500"> */}
             <span className="font-bold text-xl uppercase text-black">Our Fleet</span>
            {/* </p> */}

            {/* top filter labels (static like screenshot) */}
            <div className="mt-3 text-[11px] tracking-widest uppercase text-gray-700 space-x-3">
              <span className="font-semibold">All</span>
              <span className="text-gray-400">/ Economy</span>
              <span className="text-gray-400">/ Business Class</span>
              <span className="text-gray-400">/ First Class</span>
              <span className="text-gray-400">/ Premium Van</span>
              <span className="text-gray-400">/ Minibus</span>
            </div>
          </div>

          {/* grid */}
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FLEET_DATA.map((item, idx) => (
              <FleetCards
                key={`${item.model}-${idx}`}
                category={item.category}
                model={item.model}
                imageUrl={item.imageUrl}
                passengers={item.passengers}
                luggage={item.luggage}
                hasChargingPort={item.hasChargingPort}
                viewDetailsHref={item.viewDetailsHref}
                bookNowHref={item.bookNowHref}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
