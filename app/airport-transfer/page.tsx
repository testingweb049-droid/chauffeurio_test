'use client';

import { FaCar } from "react-icons/fa";
import HeroSection2 from "@/component/sections/HeroSection2";
import ImageDetailSection from "@/component/sections/ImageDetailSection";
import HelpSection from "@/component/sections/HelpSection";
import WorkSection from "@/component/sections/WorkSection";
import ContentSection from "@/component/sections/ContentSection";
import { ClientSideStrings } from "@/component/translations/ClientSideTranslations";
import SEO from "@/component/SEO";
import heroBackground from '@/assets/new-form/ddd.png'

export default function AirportTransfer() {
  const { airportTransfer } = ClientSideStrings();

  return (
    <>
    <SEO />
      <HeroSection2 bgImage={heroBackground} text={airportTransfer?.title} />

      <ImageDetailSection
        title={airportTransfer?.title}
        subtitle={airportTransfer?.heroSubtitle}
        description={airportTransfer?.description}
        imageSrc="/Container (1).png"
      />

      <HelpSection
        subtitle={airportTransfer?.helpSubtitle}
        heading={airportTransfer?.whyChoose}
        description={airportTransfer?.helpDescription}
        points={airportTransfer?.points ?? []}
      />

      <WorkSection
        eyebrow={airportTransfer?.workEyebrow}
        heading={airportTransfer?.worksectionTitle}
        steps={(airportTransfer?.workSteps ?? []).map(step => ({
          title: step.title,
          description: step.description,
          icon: <FaCar size={40} />
        }))}
      />

      <ContentSection
        sections={(airportTransfer?.contentSections ?? []).map(section => ({
          title: section.title,
          description: section.description,
          image: section.image,
          imagePosition: section.imagePosition as "right" | "left",
        }))}
      />
    </>
  );
}
