"use client";

import ContentSection from "@/component/sections/ContentSection";
import FleetHome from "@/component/sections/FleetHome";
import HelpSection from "@/component/sections/HelpSection";
import HeroBottom from "@/component/sections/HeroBottom";
import HeroSection from "@/component/sections/HeroSection";
import ServiceHomeSection from "@/component/sections/ServiceHomeSection";
import Testimonials from "@/component/sections/Testimonials";
import TopDestination from "@/component/sections/TopDestination";
import Vission from "@/component/sections/VisionSection";

export default function Home() {
  const points = [
    {
      title: "Luxury & Premium Fleet:",
      description:
        "Travel in meticulously maintained, high-spec vehicles from leading brands like Mercedes-Benz, ensuring your journey is always comfortable and stylish.",
    },
    {
      title: "24/7 Availability and Support:",
      description:
        "Our commitment to you is around the clock. With our taxis Valencia 24 horas service, you can book and travel anytime, day or night.",
    },
    {
      title: "Professional, Vetted Chauffeurs:",
      description:
        "Our drivers are more than just drivers; they are multilingual, locally knowledgeable professionals dedicated to your safety and satisfaction.",
    },
    {
      title: "Guaranteed Punctuality:",
      description:
        "We respect your time. Punctuality is the cornerstone of our service, especially for critical airport transfers and business appointments.",
    },
    {
      title: "Business & Corporate Trips:",
      description:
        "A reliable and discreet executive taxi service in Valencia for corporate clients. We guarantee punctuality and a quiet, professional environment, allowing you to focus on what matters most.",
    },
  ];

  const contentSections = [
    {
      title: " Comprehensive Chauffeur Solutions for Every Occasion in Valencia and across Spain.",
      description:
        "Whether you need a reliable airport taxi service in Valencia or a sophisticated transport solution for a VIP delegation, we tailor every journey to your specific needs. We manage complex itineraries, multi-stop tours, and special requests with flawless execution, ensuring your plans proceed without a hitch.Experience the true convenience of our VIP intercity private driver services in Spain. ",
      image: "/Rectangle 9.png",
      imagePosition: "right" as const,
    },
    {
      title: "Explore Valencia and Beyond in Style with Executive Chauffeur Travel",
      description:
        " While Valencia is our home, our services extend across the nation. From its historic heart to the stunning beaches of the Costa Blanca and beyond, we provide premium travel to any destination in Spain.(List of Locations) Valencia City Centre • Albufera • Cullera • Gandia • Denia • Jávea • Benidorm • Sagunto • Alicante • Peñíscola • Moraira",
      image: "/Rectangle 9 (1).png",
      imagePosition: "left" as const,
    },
  ];

  return (
    <>
      <HeroSection />
      <HeroBottom />
<ServiceHomeSection
  eyebrow="Welcome to Chauffeurio"
  heading="Our Premium Chauffeur Services in Valencia"
  introLeft="We offer a complete range of bespoke transportation solutions designed to meet the highest standards of quality, safety, and discretion."
  introRight="Experience Spain like never before with our range of tailored transport options. We offer a fleet of high-end vehicles driven by expert chauffeurs who know the local routes inside out. From economy rides for everyday needs to first-class luxury for special occasions, we've got the perfect fit. Looking for affordable private hire in Valencia or executive transport in Seville? Our services ensure you travel in style without worries."
  items={[
    { href: '/airport-transfer', title: 'Airport Transfers',            image: '/Container (1).png' },
    { href: '/hourly-chauffurs',title: 'Hourly Chauffeurs',            image: '/post32-copyright-890x664.jpg.png' },
    { href: '/event-transport', title: 'Event Transportation',         image: '/post32-copyright-890x664.jpg.png' },
    { href: '/tours-excursions', title: 'City Tours and Excursions',    image: '/post36-copyright-890x664.jpg.png' },
    { href: '/business-chauffur', title: 'Business Chauffeur Services',  image: '/post35-copyright-890x664.jpg.png' },
    { href: '/city-to-city',  title: 'Long–Distance City to City',  image: '/Container (2).png' },
  ]}
/>



      <HelpSection
        subtitle="Why Choose Us"
        heading="Why Choose Chauffeurio for Luxury Transport in Valencia"
        description="We offer a complete range of bespoke transportation solutions designed to meet the highest standards of quality, safety, and discretion. Our premium chauffeur services in Valencia are tailored for discerning travelers who value punctuality, professionalism, and comfort. Whether you require seamless airport transfers, flexible hourly bookings, or luxury event transportation, we provide a service that adapts to your needs. Each journey is supported by our modern fleet and expert chauffeurs, ensuring peace of mind and elegance at every stage of travel. From short city rides to long-distance trips across Spain, our goal is to transform travel into an effortless, enjoyable experience. With us, every detail is carefully managed so you can simply relax and enjoy the journey."
        points={points}
      />
    <FleetHome
  eyebrow="OUR FLEETS"
  heading={
    <>
      Our Premium Fleet and
      <br /> Easy Booking in Valencia
    </>
  }
  ctaLabel="View More"
  ctaHref="/fleet"
  items={[
    {
      href: '/fleet/economy',
      title: 'Economy',
      subtitle: 'Skoda Octavia, Toyota Prius or similar',
      image: '/post10-copyright-1-890x664.jpg (3).png',
    },
    {
      href: '/fleet/first-class',
      title: 'First Class',
      subtitle: 'Mercedes S Class, BMW 7, Audi A8, Cadillac Escalade',
      image: '/post10-copyright-1-890x664.jpg (4).png',
    },
    {
      href: '/fleet/business-class',
      title: 'Business Class',
      subtitle: 'Mercedes E Class, BMW 5 Series, Cadillac XTS',
      image: '/post10-copyright-1-890x664.jpg (5).png',
    },
  ]}
/>

     
<ContentSection sections={contentSections} />
 <TopDestination
  eyebrow="OUR TOP DESTINATIONS"
  heading="Explore Valencia's Top Destinations in Style with Executive Chauffeur Travel"
  ctaLabel="View Cities"
  onCtaClick={() => console.log("CTA clicked")}
  items={[
    { id: 1, title: "OCEANOGRÀFIC AQUARIUM", image: "/post10-copyright-1-890x664.jpg.png" },
    { id: 2, title: "LA LONJA DE LA SEDA", image: "/post10-copyright-1-890x664.jpg (1).png" },
    { id: 3, title: "SCIENCE MUSEUM", image: "/post10-copyright-1-890x664.jpg (2).png" },
  ]}
/>
 <Testimonials />

    </>
  );
}
