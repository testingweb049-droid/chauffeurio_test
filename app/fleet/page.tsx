import FleetCards from "@/component/card/FleetCards";
import HeroSection2 from "@/component/sections/HeroSection2";

// Define the complete fleets data according to requirements
const fleets = [
  {
    category: "ECONOMY",
    displayName: "Economy",
    vehicles: [
      { name: "Toyoya Corolla hybrid", imageUrl: "/Econamy.webp" },
      { name: "Ford Mondeo", imageUrl: "/Econamy.webp" },
      { name: "Volkswagen Passat", imageUrl: "/Econamy.webp" },
      { name: "Skoda Octavia, or superior", imageUrl: "/Econamy.webp" }
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
      { name: "Mercedes E Class or superior", imageUrl: "/Mercedes-S-Class-cutout.webp" }
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
      { name: "Mercedes Vito", imageUrl: "/Economy Van.png" },
      { name: "Volkswagen Caravelle", imageUrl: "/Economy Van.png" },
      { name: "Ford Transit Custom or superior", imageUrl: "/Economy Van.png" }
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
      { name: "Mercedes V Class or similar", imageUrl: "/First Class Van.png" }
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
      { name: "Mercedes sprinter or similar (or two vans)", imageUrl: "/Minibus 12.png" }
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
      { name: "Mercedes sprinter or similar (or two vans)", imageUrl: "/Minibus 16.png" }
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
      <HeroSection2 bgImage="/9b3e2fe554a6c651efdaa05128427c86bb81250b.jpg" text="Our Fleet" />

      {/* Breadcrumb + header */}
      <section className="px-4 md:px-6 lg:px-10 xl:px-16 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <span className="font-bold text-xl uppercase text-black">Our Fleet</span>
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