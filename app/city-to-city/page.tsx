'use client';

import { FaCar } from "react-icons/fa";
import HeroSection2 from "@/component/sections/HeroSection2";
import ImageDetailSection from "@/component/sections/ImageDetailSection";
import HelpSection from "@/component/sections/HelpSection";
import WorkSection from "@/component/sections/WorkSection";
import ContentSection from "@/component/sections/ContentSection";
import { ClientSideStrings } from "@/component/translations/ClientSideTranslations";
import SEO from "@/component/SEO";

export default function CityToCity() {
  const { citytocity } = ClientSideStrings();

  return (
    <>
    <SEO />
      <HeroSection2 bgImage="/4d0647dd70dc271856ddae5c30eec62f9bcc0f86.jpg" text={citytocity?.title} />

      <ImageDetailSection
        title={citytocity?.title}
        subtitle={citytocity?.heroSubtitle}
        description={citytocity?.description}
        imageSrc="/Container (2).png"
      />

      <HelpSection
        subtitle={citytocity?.helpSubtitle}
        heading={citytocity?.whyChoose}
        description={citytocity?.helpDescription}
        points={citytocity?.points ?? []}
      />

      <WorkSection
        eyebrow={citytocity?.workEyebrow}
        heading={citytocity?.worksectionTitle}
        steps={(citytocity?.workSteps ?? []).map(step => ({
          title: step.title,
          description: step.description,
          icon: <FaCar size={40} />
        }))}
      />

      <ContentSection
        sections={(citytocity?.contentSections ?? []).map(section => ({
          title: section.title,
          description: section.description,
          image: section.image,
          imagePosition: section.imagePosition as "right" | "left",
        }))}
      />
    </>
  );
}
