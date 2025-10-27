'use client';

import { FaCar } from "react-icons/fa";
import HeroSection2 from "@/component/sections/HeroSection2";
import ImageDetailSection from "@/component/sections/ImageDetailSection";
import HelpSection from "@/component/sections/HelpSection";
import WorkSection from "@/component/sections/WorkSection";
import ContentSection from "@/component/sections/ContentSection";
import { ClientSideStrings } from "@/component/translations/ClientSideTranslations";

export default function HourlyChuffers() {
  const { hourlyChauffeurs } = ClientSideStrings();

  return (
    <>
      <HeroSection2 bgImage="/fe0f8d949fc5f87500499fe8c27ea1f865c3cc8b.jpg" text={hourlyChauffeurs?.title} />

      <ImageDetailSection
        title={hourlyChauffeurs?.title}
        subtitle={hourlyChauffeurs?.heroSubtitle}
        description={hourlyChauffeurs?.description}
        imageSrc="/post32-copyright-890x664.jpg.png"
      />

      <HelpSection
        subtitle={hourlyChauffeurs?.helpSubtitle}
        heading={hourlyChauffeurs?.whyChoose}
        description={hourlyChauffeurs?.helpDescription}
        points={hourlyChauffeurs?.points ?? []}
      />

      <WorkSection
        eyebrow={hourlyChauffeurs?.workEyebrow}
        heading={hourlyChauffeurs?.worksectionTitle}
        steps={(hourlyChauffeurs?.workSteps ?? []).map(step => ({
          title: step.title,
          description: step.description,
          icon: <FaCar size={40} />
        }))}
      />

      <ContentSection
        sections={(hourlyChauffeurs?.contentSections ?? []).map(section => ({
          title: section.title,
          description: section.description,
          image: section.image,
          imagePosition: section.imagePosition as "right" | "left",
        }))}
      />
    </>
  );
}
