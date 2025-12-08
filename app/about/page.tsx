'use client';

import HelpSection from "@/component/sections/HelpSection";
import HeroSection2 from "@/component/sections/HeroSection2";
import ImageDetailSection from "@/component/sections/ImageDetailSection";
import Testimonials from "@/component/sections/Testimonials";
import ValueAndMission from "@/component/sections/ValueAndMission";
import SEO from "@/component/SEO";
import { ClientSideStrings } from "@/component/translations/ClientSideTranslations";

export default function About() {
  const { about } = ClientSideStrings(); // pulls the locale bundle

  // Clone arrays to avoid readonly → mutable prop errors in TS
  const points = (about?.help?.points ?? []).map(p => ({ ...p }));
  const stats  = (about?.valueMission?.stats ?? []).map(s => ({ ...s }));

  return (
    <>
    <SEO/>
      <HeroSection2 bgImage="/84652a96fd9233308809fcf62694bb2205623ba3.jpg" text={about?.heroTitle} />

      <ImageDetailSection
        title={about?.imageDetail?.title}
        subtitle={about?.imageDetail?.subtitle}
        description={about?.imageDetail?.description}
        imageSrc={about?.imageDetail?.imageSrc}
      />

      <HelpSection
        subtitle={about?.help?.subtitle}
        heading={about?.help?.heading}
        description={about?.help?.description}
        points={points}
      />

      <ValueAndMission
        eyebrow={about?.valueMission?.eyebrow}
        heading={about?.valueMission?.heading ?? ""}
        stats={stats}
        missionTitle={about?.valueMission?.missionTitle ?? ""}
        missionText={about?.valueMission?.missionText ?? ""}
        visionTitle={about?.valueMission?.visionTitle ?? ""}
        visionText={about?.valueMission?.visionText ?? ""}
      />
      <Testimonials/>
    </>
  );
}
