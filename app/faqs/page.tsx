'use client';

import React from "react";
import HeroSection2 from "@/component/sections/HeroSection2";
import FaqsCard from "@/component/card/FaqsCards";
import { ClientSideStrings } from "@/component/translations/ClientSideTranslations";

export default function FaqsPage() {
  const { faqPage } = ClientSideStrings(); // { title, categories }

  // Clone to satisfy FaqsCard's mutable prop typing
  const faqsForCard =
    (faqPage?.categories ?? []).map(cat => ({
      category: cat.category,
      questions: cat.questions.map(q => ({ ...q }))
    })) || [];

  return (
    <div>
      <HeroSection2 bgImage="hero.jpg" text={faqPage?.title ?? "FAQS"} />
      <div className="max-w-7xl m-auto md:py-16 py-8">
        <FaqsCard faqs={faqsForCard} />
      </div>
    </div>
  );
}
