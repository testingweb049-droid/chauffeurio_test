"use client";

import React, { useMemo } from "react";
import { Check, DollarSign, Phone } from "lucide-react";
import { ClientSideStrings } from "@/component/translations/ClientSideTranslations";
import { useReducedMotion } from "framer-motion";

type Feature = { icon: React.ReactNode; lines: string[] };

interface HeroBottomProps {
  /** If provided, overrides translation content */
  items?: Feature[];
}

const makeIcon = (i: number) => {
  const common =
    "inline-flex h-8 w-8 md:h-12 md:w-12 items-center justify-center rounded-full border-2 border-gray-700 shrink-0";
  if (i === 1)
    return (
      <span className={common}>
        <DollarSign className="h-4 w-4 md:h-6 md:w-6 text-gray-700" />
      </span>
    );
  if (i === 2)
    return (
      <span className={common}>
        <Phone className="h-4 w-4 md:h-6 md:w-6 text-gray-700" />
      </span>
    );
  return (
    <span className={common}>
      <Check className="h-4 w-4 md:h-6 md:w-6 text-gray-700" />
    </span>
  );
};

const fallbackItems: Feature[] = [
  { icon: makeIcon(0), lines: ["Free cancelation", "Licensed drivers", "Meet & greet"] },
  { icon: makeIcon(1), lines: ["Pay online or in cash", "Fixed prices", "Guaranteed savings"] },
  { icon: makeIcon(2), lines: ["24 hour customer service", "English and Spanish", "365 days of the year"] },
];

export default function HeroBottom({ items }: HeroBottomProps) {
  const { heroBottom } = ClientSideStrings();
  const prefersReducedMotion = useReducedMotion();

  // Build from i18n and clone readonly → mutable
  const i18nItems: Feature[] | null = useMemo(() => {
    if (!heroBottom?.items) return null;
    return heroBottom.items.map(
      (it: { lines: readonly string[] }, idx: number): Feature => ({
        icon: makeIcon(idx),
        lines: [...it.lines],
      })
    );
  }, [heroBottom?.items]);

  const baseItems = useMemo<Feature[]>(
    () => items ?? i18nItems ?? fallbackItems,
    [items, i18nItems]
  );

  // Duplicate for seamless loop: [A,B,C, A,B,C]
  const marqueeItems = useMemo(() => [...baseItems, ...baseItems], [baseItems]);

  return (
    <section className="bg-white">
      <div className="w-full border-y border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-3 md:py-6">
          {/* Mobile: infinite marquee */}
          <div className="relative overflow-hidden md:hidden">
            <div
              className="flex gap-4 will-change-transform"
              style={{
                // keyframes defined below; disable when reduced motion
                animation: prefersReducedMotion ? "none" : "hb-marquee 22s linear infinite",
                width: "max-content",
              }}
              aria-hidden="true"
            >
              {marqueeItems.map((f, i) => (
                <FeatureCard key={`m-${i}`} feature={f} />
              ))}
            </div>
          </div>

          {/* Desktop/Tablet: static grid */}
          <div className="hidden md:grid grid-cols-3 gap-3 md:gap-8">
            {baseItems.map((f, i) => (
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

      {/* Local keyframes for the marquee */}
      <style jsx>{`
        @keyframes hb-marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}

/** A single marquee "card" that won't shrink and keeps consistent spacing */
function FeatureCard({ feature }: { feature: Feature }) {
  return (
    <div className="flex items-start gap-2  py-2 shrink-0 min-w-[240px]">
      {feature.icon}
      <div className="space-y-0.5">
        {feature.lines.map((line, idx) => (
          <h6 key={idx} className="text-[11px] leading-tight text-gray-700">
            {line}
          </h6>
        ))}
      </div>
    </div>
  );
}
