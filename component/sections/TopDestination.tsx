"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const cardWidth = container.offsetWidth * 0.85; // 85vw per card
      const index = Math.round(scrollLeft / cardWidth);
      setActiveIndex(index);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToIndex = (index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const cardWidth = container.offsetWidth * 0.85;
    container.scrollTo({
      left: cardWidth * index,
      behavior: 'smooth'
    });
  };

  return (
    <section className={`relative bg-primary text-white py-8 px-4 overflow-hidden ${className}`}>
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

        {/* --- Mobile: horizontal scroll --- */}
        <div className="md:hidden -mx-4">
          <div 
            ref={scrollContainerRef}
            className="overflow-x-auto overflow-y-hidden px-4 scrollbar-hide snap-x snap-mandatory"
          >
            <div className="flex gap-4 pb-2">
              {items.map((d) => (
                <div key={d.id} className="flex-shrink-0 w-[85vw] snap-start">
                  <div className="relative h-64 w-full overflow-hidden rounded-lg">
                    <Image
                      src={d.image}
                      alt={d.title}
                      fill
                      sizes="85vw"
                      className="object-cover"
                      priority={false}
                    />
                  </div>
                  <h6 className="mt-4 text-lg font-bold uppercase tracking-wide">{d.title}</h6>
                </div>
              ))}
            </div>
          </div>

          {/* Dots */}
          {items.length > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollToIndex(i)}
                  className={`h-2 rounded-full transition-all ${
                    activeIndex === i ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                  type="button"
                />
              ))}
            </div>
          )}

          {/* Mobile CTA */}
          {ctaLabel ? (
            <div className="mt-8 flex justify-center">
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
              className="group flex items-center gap-2 text-white transition-colors hover:text-yellow-400"
              aria-label={ctaLabel}
            >
              <span className="text-sm font-medium">{ctaLabel}</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        ) : null}
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}