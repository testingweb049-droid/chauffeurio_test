"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

export interface Destination {
  id: number | string;
  title: string;
  image: string; // public path or URL
}

interface TopDestinationProps {
  eyebrow?: string;                  // e.g. "OUR TOP DESTINATIONS"
  heading: string;                   // can be string or ReactNode
  ctaLabel?: string;                 // e.g. "View Cities"
  items: Destination[];              // cards to show
  onCtaClick?: () => void;           // optional handler for CTA button
  className?: string;                // optional wrapper class
}

export default function TopDestination({
  eyebrow = "OUR TOP DESTINATIONS",
  heading,
  ctaLabel = "View Cities",
  items,
  onCtaClick,
  className = "",
}: TopDestinationProps) {
  const [current, setCurrent] = useState(0);

  // Swipe handling (mobile)
  const startX = useRef<number | null>(null);
  const deltaX = useRef(0);

  const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

  const prev = () => setCurrent((i) => (i === 0 ? items.length - 1 : i - 1));
  const next = () => setCurrent((i) => (i === items.length - 1 ? 0 : i + 1));

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    deltaX.current = 0;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (startX.current == null) return;
    deltaX.current = e.touches[0].clientX - startX.current;
  };

  const onTouchEnd = () => {
    const threshold = 50; // px
    if (deltaX.current > threshold) prev();
    else if (deltaX.current < -threshold) next();
    startX.current = null;
    deltaX.current = 0;
  };

  return (
    <section className={`relative bg-primary text-white py-16 px-4 overflow-hidden ${className}`}>
      {/* corner glow: top-right & bottom-left */}
      <div className="pointer-events-none absolute -top-10 -right-10 h-[28rem] w-[28rem] rounded-full bg-gradient-to-bl from-white/15 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-[28rem] w-[28rem] rounded-full bg-gradient-to-tr from-white/15 to-transparent blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10 flex items-start justify-between">
          <div>
            <h4 className="mb-3 text-sm uppercase tracking-wider text-secondary">{eyebrow}</h4>
            <h1 className="max-w-4xl text-4xl font-extrabold leading-tight md:text-5xl">{heading}</h1>
          </div>

          {ctaLabel ? (
            <button
              type="button"
              onClick={onCtaClick}
              className="group hidden items-center gap-2 text-white transition-colors hover:text-yellow-400 md:flex"
              aria-label={ctaLabel}
            >
              <span className="text-sm font-medium">{ctaLabel}</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          ) : null}
        </div>

        {/* --- Mobile carousel (sm & down) --- */}
        <div className="md:hidden">
          <div className="relative">
            {/* Slides wrapper */}
            <div
              className="relative w-full overflow-hidden"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${current * 100}%)` }}
              >
                {items.map((d) => (
                  <div key={d.id} className="w-full shrink-0">
                    <div className="relative h-64 w-full overflow-hidden rounded-lg">
                      <Image
                        src={d.image}
                        alt={d.title}
                        fill
                        sizes="100vw"
                        className="object-cover"
                        priority={false}
                      />
                    </div>
                    <h6 className="mt-4 text-lg font-bold uppercase tracking-wide">{d.title}</h6>
                  </div>
                ))}
              </div>

              {/* Prev/Next buttons */}
              {items.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 backdrop-blur-sm hover:bg-white/30"
                    aria-label="Previous"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 backdrop-blur-sm hover:bg-white/30"
                    aria-label="Next"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            {/* Dots */}
            {items.length > 1 && (
              <div className="mt-4 flex items-center justify-center gap-2">
                {items.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(clamp(i, 0, items.length - 1))}
                    className={`h-2 rounded-full transition-all ${
                      current === i ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                    type="button"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Mobile CTA */}
          {ctaLabel ? (
            <div className="mt-8 flex justify-center ">
              <button
                type="button"
                onClick={onCtaClick}
                className="group flex items-center gap-2 text-white transition-colors hover:text-yellow-400"
                aria-label={ctaLabel}
              >
                <span className="text-sm font-medium">{ctaLabel}</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          ) : null}
        </div>

        {/* --- Desktop grid (md+) --- */}
        <div className="mb-8 hidden grid-cols-1 gap-8 md:grid md:grid-cols-2 lg:grid-cols-3">
          {items.map((d) => (
            <div key={d.id} className="group">
              <div className="relative h-64 w-full overflow-hidden rounded-lg">
                <Image
                  src={d.image}
                  alt={d.title}
                  fill
                  sizes="(max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority={false}
                />
              </div>
              <h6 className="mt-4 text-lg font-bold uppercase tracking-wide">{d.title}</h6>
            </div>
          ))}
        </div>

        {/* Desktop CTA */}
        {ctaLabel ? (
          <div className="mt-8 hidden justify-center md:flex">
            <button
              type="button"
              onClick={onCtaClick}
              className="group hidden items-center gap-2 text-white transition-colors hover:text-yellow-400 md:flex"
              aria-label={ctaLabel}
            >
              <span className="text-sm font-medium">{ctaLabel}</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
