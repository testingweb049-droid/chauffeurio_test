'use client';

import { FaCar } from "react-icons/fa";
import HeroSection2 from "@/component/sections/HeroSection2";
import ImageDetailSection from "@/component/sections/ImageDetailSection";
import HelpSection from "@/component/sections/HelpSection";
import WorkSection from "@/component/sections/WorkSection";
import ContentSection from "@/component/sections/ContentSection";
import { ClientSideStrings } from "@/component/translations/ClientSideTranslations";

export default function BusinessChffurs() {
  const { businessChhuff } = ClientSideStrings();

  return (
    <>
      <HeroSection2 bgImage="hero.jpg" text={businessChhuff?.title} />

      <ImageDetailSection
        title={businessChhuff?.title}
        subtitle={businessChhuff?.heroSubtitle}
        description={businessChhuff?.description}
        imageSrc="/post35-copyright-890x664.jpg.png"
      />

      <HelpSection
        subtitle={businessChhuff?.helpSubtitle}
        heading={businessChhuff?.whyChoose}
        description={businessChhuff?.helpDescription}
        points={businessChhuff?.points ?? []}
      />

      <WorkSection
        eyebrow={businessChhuff?.workEyebrow}
        heading={businessChhuff?.worksectionTitle}
        steps={(businessChhuff?.workSteps ?? []).map(step => ({
          title: step.title,
          description: step.description,
          icon: <FaCar size={40} />
        }))}
      />

      <ContentSection
        sections={(businessChhuff?.contentSections ?? []).map(section => ({
          title: section.title,
          description: section.description,
          image: section.image,
          imagePosition: section.imagePosition as "right" | "left",
        }))}
      />
    </>
  );
}
