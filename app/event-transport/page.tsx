'use client';

import { FaCar } from "react-icons/fa";
import HeroSection2 from "@/component/sections/HeroSection2";
import ImageDetailSection from "@/component/sections/ImageDetailSection";
import HelpSection from "@/component/sections/HelpSection";
import WorkSection from "@/component/sections/WorkSection";
import ContentSection from "@/component/sections/ContentSection";
import { ClientSideStrings } from "@/component/translations/ClientSideTranslations";
import SEO from "@/component/SEO";

export default function EventTransport() {
  const { eventTransport } = ClientSideStrings();

  return (
    <>
    <SEO />
      <HeroSection2 bgImage="/ee5a8e8dbc6cf814d4468277aea201feacd965ed.jpg" text={eventTransport?.title} />

      <ImageDetailSection
        title={eventTransport?.title}
        subtitle={eventTransport?.heroSubtitle}
        description={eventTransport?.description}
        imageSrc="/post32-copyright-890x664.jpg.png"
      />

      <HelpSection
        subtitle={eventTransport?.helpSubtitle}
        heading={eventTransport?.whyChoose}
        description={eventTransport?.helpDescription}
        points={eventTransport?.points ?? []}
      />

      <WorkSection
        eyebrow={eventTransport?.workEyebrow}
        heading={eventTransport?.worksectionTitle}
        steps={(eventTransport?.workSteps ?? []).map(step => ({
          title: step.title,
          description: step.description,
          icon: <FaCar size={40} />
        }))}
      />

      <ContentSection
        sections={(eventTransport?.contentSections ?? []).map(section => ({
          title: section.title,
          description: section.description,
          image: section.image,
          imagePosition: section.imagePosition as "right" | "left",
        }))}
      />
    </>
  );
}
