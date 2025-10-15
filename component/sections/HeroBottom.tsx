"use client";

import React from "react";
import { Check, DollarSign, Phone } from "lucide-react";
import { ClientSideStrings } from "@/component/translations/ClientSideTranslations";

type Feature = { icon: React.ReactNode; lines: string[] };
interface HeroBottomProps {
  /** If provided, overrides translation content */
  items?: Feature[];
}

const makeIcon = (i: number) => {
  const common = "inline-flex h-8 w-8 md:h-12 md:w-12 items-center justify-center rounded-full border-2 border-gray-700 shrink-0";
  if (i === 1) return <span className={common}><DollarSign className="h-4 w-4 md:h-6 md:w-6 text-gray-700" /></span>;
  if (i === 2) return <span className={common}><Phone className="h-4 w-4 md:h-6 md:w-6 text-gray-700" /></span>;
  return <span className={common}><Check className="h-4 w-4 md:h-6 md:w-6 text-gray-700" /></span>;
};

const fallbackItems: Feature[] = [
  { icon: makeIcon(0), lines: ["Free cancelation", "Licensed drivers", "Meet & greet"] },
  { icon: makeIcon(1), lines: ["Pay online or in cash", "Fixed prices", "Guaranteed savings"] },
  { icon: makeIcon(2), lines: ["24 hour customer service", "English and Spanish", "365 days of the year"] }
];

export default function HeroBottom({ items }: HeroBottomProps) {
  const { heroBottom } = ClientSideStrings();

  // Build from translations (and clone to avoid readonly → mutable issues)
  const i18nItems: Feature[] | null = heroBottom?.items
    ? heroBottom.items.map((it: { lines: readonly string[] }, idx: number) => ({
        icon: makeIcon(idx),
        lines: [...it.lines] // clone
      }))
    : null;

  const toRender: Feature[] = items ?? i18nItems ?? fallbackItems;

  return (
    <section className="bg-white">
      <div className="w-full border-y border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-3 md:py-6">
          <div className="grid grid-cols-3 gap-3 md:gap-8">
            {toRender.map((f, i) => (
              <div
                key={i}
                className={`flex items-start gap-2 md:gap-4 md:pl-6 ${i > 0 ? "md:border-l md:border-gray-200" : ""}`}
              >
                {f.icon}
                <div className="space-y-0.5">
                  {f.lines.map((line, idx) => (
                    <h6 key={idx} className="text-[7px] leading-tight text-gray-700 md:text-sm">
                      {line}
                    </h6>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
