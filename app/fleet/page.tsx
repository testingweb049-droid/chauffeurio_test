import FleetCards from "@/component/card/FleetCards";
import HeroSection2 from "@/component/sections/HeroSection2";

// Define the complete fleets data according to requirements
const fleets = [
  {
    category: "ECONOMY",
    displayName: "Economy",
    vehicles: [
      { name: "Toyoya Corolla hybrid", imageUrl: "/Rectangle 21.png" },
      { name: "Ford Mondeo", imageUrl: "/Rectangle 21.png" },
      { name: "Volkswagen Passat", imageUrl: "/Rectangle 21.png" },
      { name: "Skoda Octavia, or superior", imageUrl: "/Rectangle 21.png" }
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
    category: "BUSINESS_SEDAN",
    displayName: "Business Sedan",
    vehicles: [
      { name: "Mercedes E Class or superior", imageUrl: "/Rectangle 21 (2).png" }
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
    category: "ECONOMY_VAN",
    displayName: "Economy Van",
    vehicles: [
      { name: "Mercedes Vito", imageUrl: "/Rectangle 21 (11).png" },
      { name: "Volkswagen Caravelle", imageUrl: "/Rectangle 21 (11).png" },
      { name: "Ford Transit Custom or superior", imageUrl: "/Rectangle 21 (11).png" }
    ],
    passengers: 8,
    luggage: 8,
    hasChargingPort: true,
    pricing: {
      perKm: 2.0,
      hourly: 50,
      airport: 50
    }
  },
  {
    category: "FIRST_CLASS_VAN",
    displayName: "First Class Van",
    vehicles: [
      { name: "Mercedes V Class or similar", imageUrl: "/Rectangle 21 (14).png" }
    ],
    passengers: 7,
    luggage: 7,
    hasChargingPort: true,
    pricing: {
      perKm: 2.5,
      hourly: 60,
      airport: 60
    }
  },
  {
    category: "MINIBUS_12",
    displayName: "Minibus 12",
    vehicles: [
      { name: "Mercedes sprinter or similar (or two vans)", imageUrl: "/Rectangle 21 (15).png" }
    ],
    passengers: 12,
    luggage: 12,
    hasChargingPort: true,
    pricing: {
      perKm: 3.5,
      hourly: 80,
      airport: 85
    }
  },
  {
    category: "MINIBUS_16",
    displayName: "Minibus 16",
    vehicles: [
      { name: "Mercedes sprinter or similar (or two vans)", imageUrl: "/Rectangle 21 (18).png" }
    ],
    passengers: 16,
    luggage: 16,
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
            {/* <div className="mt-3 text-[11px] tracking-widest uppercase text-gray-700 space-x-3">
              <span className="font-semibold">All</span>
              <span className="text-gray-400">/ Economy</span>
              <span className="text-gray-400">/ Business Sedan</span>
              <span className="text-gray-400">/ Economy Van</span>
              <span className="text-gray-400">/ First Class Van</span>
              <span className="text-gray-400">/ Minibus</span>
            </div> */}
          </div>

          {/* 6 Cards - One for each category */}
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {fleets.map((category) => (
              <FleetCards
                key={category.category}
                category={category.displayName}
                vehicles={category.vehicles}
                imageUrl={category.vehicles[0]?.imageUrl} // Use first vehicle image
                passengers={category.passengers}
                luggage={category.luggage}
                hasChargingPort={category.hasChargingPort}
                viewDetailsHref={`/fleet/${category.category.toLowerCase().replace(/_/g, '-')}`}
                bookNowHref={`/book?category=${category.category.toLowerCase().replace(/_/g, '-')}`}
                pricing={category.pricing}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}