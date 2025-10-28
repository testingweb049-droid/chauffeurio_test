'use client';

import { FaCar } from "react-icons/fa";
import HeroSection2 from "@/component/sections/HeroSection2";
import ImageDetailSection from "@/component/sections/ImageDetailSection";
import HelpSection from "@/component/sections/HelpSection";
import WorkSection from "@/component/sections/WorkSection";
import ContentSection from "@/component/sections/ContentSection";
import { ClientSideStrings } from "@/component/translations/ClientSideTranslations";
import SEO from "@/component/SEO";

export default function TourAndExcursions() {
  const { tour } = ClientSideStrings();

  return (
    <>
    <SEO />
      <HeroSection2 bgImage="/3adc8cbd03fa4372d00a4b351db1cf88e91389e1.jpg" text={tour?.title} />

      <ImageDetailSection
        title={tour?.title}
        subtitle={tour?.heroSubtitle}
        description={tour?.description}
        imageSrc="/post36-copyright-890x664.jpg.png"
      />

      <HelpSection
        subtitle={tour?.helpSubtitle}
        heading={tour?.whyChoose}
        description={tour?.helpDescription}
        points={tour?.points ?? []}
      />

      <WorkSection
        eyebrow={tour?.workEyebrow}
        heading={tour?.worksectionTitle}
        steps={(tour?.workSteps ?? []).map(step => ({
          title: step.title,
          description: step.description,
          icon: <FaCar size={40} />
        }))}
      />

      <ContentSection
        sections={(tour?.contentSections ?? []).map(section => ({
          title: section.title,
          description: section.description,
          image: section.image,
          imagePosition: section.imagePosition as "right" | "left",
        }))}
      />
    </>
  );
}
