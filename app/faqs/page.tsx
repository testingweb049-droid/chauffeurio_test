'use client';

import React from "react";
import HeroSection2 from "@/component/sections/HeroSection2";
import FaqsCard from "@/component/card/FaqsCards";
import { ClientSideStrings } from "@/component/translations/ClientSideTranslations";
import SEO from "@/component/SEO";

export default function FaqsPage() {
  const { faqPage } = ClientSideStrings(); // { title, questions }

  // Flat list of questions for FaqsCard
  const faqsForCard = faqPage?.questions ? [...faqPage.questions] : [];

  return (
    <div>
      <SEO />
      <HeroSection2
        bgImage="/e8413d5a6c22ee75ffa12886e488ceddcb609400.jpg"
        text={faqPage?.title ?? "FAQS"}
      />
      <div className="max-w-7xl m-auto md:py-16 py-8">
        <FaqsCard faqs={faqsForCard} />
      </div>
    </div>
  );
}
