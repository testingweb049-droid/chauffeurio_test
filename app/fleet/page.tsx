import FleetCards from "@/component/card/FleetCards";
import HeroSection2 from "@/component/sections/HeroSection2";

// Define the complete fleets data directly in this file
const fleets = [
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

export default function Fleet() {
  return (
    <>
      <HeroSection2 bgImage="/hero.jpg" text="Our Fleet" />

      {/* Breadcrumb + header */}
      <section className="px-4 md:px-6 lg:px-10 xl:px-16 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <span className="font-bold text-xl uppercase text-black">Our Fleet</span>

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

          {/* 7 Cards - One for each category */}
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {fleets.map((category, index) => (
              <FleetCards
                key={category.category}
                category={category.displayName}
                vehicles={category.vehicles}
                imageUrl={category.vehicles[0]?.imageUrl} // Use first vehicle image
                passengers={category.passengers}
                luggage={category.luggage}
                hasChargingPort={category.hasChargingPort}
                viewDetailsHref={`/fleet/${category.category.toLowerCase().replace(/\s+/g, '-')}`}
                bookNowHref={`/book?category=${category.category.toLowerCase().replace(/\s+/g, '-')}`}
                pricing={category.pricing}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}