"use client";

import React, { useMemo } from "react";
import { useReducedMotion } from "framer-motion";
import Image from "next/image";

import one from "@/assets/new-form/C.png"
import two from "@/assets/new-form/euro.png"
import three from "@/assets/new-form/3.png"
import four from "@/assets/new-form/l.png"
import five from "@/assets/new-form/5.png"

type Feature = { 
  image: any; 
  text: string;
};

interface HeroBottomProps {
  /** If provided, overrides the static content */
  items?: Feature[];
}

const list: Feature[] = [
  {
    image: one,
    text: 'Competitive Rates'
  },
  {
    image:two,
    text: 'Online Payment'
  },
  {
    image: four,
    text: 'Valencia To Anywhere'
  },
  {
    image: '/ChatGPT Image Oct 26, 2025, 06_54_38 PM.png',
    text: 'Trustworthy'
  },
];

export default function HeroBottom({ items }: HeroBottomProps) {
  const prefersReducedMotion = useReducedMotion();

  // Use provided items or fall back to static list
  const baseItems = useMemo<Feature[]>(
    () => items || list,
    [items]
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
              {marqueeItems.map((item, i) => (
                <FeatureCard key={`m-${i}`} feature={item} />
              ))}
            </div>
          </div>

          {/* Desktop/Tablet: centered grid */}
          <div className="hidden md:flex justify-center items-center">
            <div className="grid grid-cols-4 gap-8 max-w-7xl w-full">
              {baseItems.map((item, i) => (
                <div
                  key={i}
                  className="flex  items-center text-center gap-3"
                >
                  <div className="flex items-center justify-center w-16 h-16">
                    <Image 
                      src={item.image} 
                      alt={item.text} 
                      className="w-full h-full object-contain"
                      width={64}
                      height={64}
                    />
                  </div>
                  <div className="space-y-0.5">
                    <h6 className="text-lg font-bold text-gray-700 leading-tight">
                      {item.text}
                    </h6>
                  </div>
                </div>
              ))}
            </div>
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
    <div className="flex items-center text-center gap-2 py-2 shrink-0">
      <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12">
        <Image 
          src={feature.image} 
          alt={feature.text} 
          className="w-full h-full object-contain"
          width={48}
          height={48}
        />
      </div>
      <div className="space-y-0.5">
        <h6 className="text-xs font-medium text-gray-700 leading-tight">
          {feature.text}
        </h6>
      </div>
    </div>
  );
}