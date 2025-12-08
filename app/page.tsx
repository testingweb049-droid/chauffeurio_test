"use client";

import ContentSection from "@/component/sections/ContentSection";
import FleetClasses from "@/component/sections/FleetClasses";
import FleetHome from "@/component/sections/FleetHome";
import HelpSection from "@/component/sections/HelpSection";
import HeroBottom from "@/component/sections/HeroBottom";
import HeroSection from "@/component/sections/HeroSection";
import HeroSectionUpdated from "@/component/sections/HeroSectionUpdated";
import ServiceHomeSection from "@/component/sections/ServiceHomeSection";
import Testimonials from "@/component/sections/Testimonials";
import TopDestination from "@/component/sections/TopDestination";
// import Vission from "@/component/sections/VisionSection";
import { ClientSideStrings } from "@/component/translations/ClientSideTranslations";
import InfiniteSlide from "./book-ride/InfiniteSlide";
import SEO from "@/component/SEO";

export default function Home() {
  const { home } = ClientSideStrings(); // ← pull translations

  const fleetHeading =
    Array.isArray(home?.fleet?.headingLines) && home?.fleet?.headingLines.length === 2 ? (
      <>
        {home.fleet.headingLines[0]} <br /> {home.fleet.headingLines[1]}
      </>
    ) : (
      (home?.fleet as any)?.heading || ""
    );

  return (
    <>
    <SEO />
      {/* <HeroSection /> */}
      <HeroSectionUpdated/>
      <HeroBottom />
      {/* <InfiniteSlide/> */}

    <ServiceHomeSection
  eyebrow={home?.serviceSection?.eyebrow ?? ""}
  heading={home?.serviceSection?.heading ?? ""}
  introLeft={home?.serviceSection?.introLeft ?? ""}
  introRight={home?.serviceSection?.introRight ?? ""}
  items={[...(home?.serviceSection?.items ?? [])]} // ← force mutable copy
/>
      <HelpSection
        subtitle={home?.whyUs?.subtitle ?? ""}
        heading={home?.whyUs?.heading ?? ""}
        description={home?.whyUs?.description ?? ""}
        points={home?.whyUs?.points ?? []}
      />

     <FleetHome
  eyebrow={home?.fleet?.eyebrow ?? ""}
  heading={fleetHeading}
  ctaLabel={home?.fleet?.ctaLabel ?? ""}
  ctaHref={home?.fleet?.ctaHref ?? ""}
  items={[...(home?.fleet?.items ?? [])]} // ← force mutable copy
/>
{/* <FleetClasses/> */}

      <ContentSection sections={(home?.contentSections ?? []).map((s) => ({
        title: s.title,
        description: s.description,
        image: s.image,
        imagePosition: (s.imagePosition === "left" ? "left" : "right") as "left" | "right",
      }))} />

     <TopDestination
  eyebrow={home?.destinations?.eyebrow ?? ""}
  heading={home?.destinations?.heading ?? ""}
  ctaLabel={home?.destinations?.ctaLabel ?? ""}
  onCtaClick={() => {}}
  items={[...(home?.destinations?.items ?? [])]} // ← force mutable copy
/>

      <Testimonials />
      {/* <Vission /> */}
    </>
  );
}
