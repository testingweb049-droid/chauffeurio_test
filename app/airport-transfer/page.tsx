'use client';

import { FaCar, FaClock, FaCloudSun, FaHandshake } from "react-icons/fa";
import HeroSection2 from "@/component/sections/HeroSection2";
import ImageDetailSection from "@/component/sections/ImageDetailSection";
import HelpSection from "@/component/sections/HelpSection";
import WorkSection from "@/component/sections/WorkSection";
import ContentSection from "@/component/sections/ContentSection";
import { ClientSideStrings } from "@/component/translations/ClientSideTranslations";

export default function AirportTransfer() {
  const { airportTransfer } = ClientSideStrings();  // Get translations dynamically

  return (
    <>
      <HeroSection2 bgImage="hero.jpg" text={airportTransfer?.title} />

      <ImageDetailSection
        title={airportTransfer?.title}
        subtitle="Traveling through Valencia should be simple, smooth, and stress-free."
        description={airportTransfer?.description}
        imageSrc="/Container (1).png"
      />

      <HelpSection
        heading={airportTransfer?.whyChoose}
        description={airportTransfer?.helpDescription}
        points={airportTransfer?.points}
      />

      <WorkSection
        heading={airportTransfer?.workSteps[0]?.title}
        description="Simple Booking and Reliable Service"
        steps={airportTransfer?.workSteps.map(step => ({
          title: step?.title,
          description: step?.description,
          icon: <FaCar size={40} />
        }))}
      />

      <ContentSection
        sections={airportTransfer?.contentSections.map(section => ({
          title: section?.title,
          description: section?.description,
          image: section?.image,
          imagePosition: section?.imagePosition as "right" | "left", 
        }))}
      />
    </>
  );
}
