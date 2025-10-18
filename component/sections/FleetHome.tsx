'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ReactNode, useRef, useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

export type FleetCard = {
  /** Optional link for the card */
  href?: string;
  /** Main title, e.g. "Economy" */
  title: string | ReactNode;
  /** Small line under the title, e.g. model list */
  subtitle?: string | ReactNode;
  /** Car image (public path or absolute URL) */
  image: string;
  /** Accessibility alt text; falls back to title if omitted */
  alt?: string;
};

interface FleetHomeProps {
  /** Eyebrow label (e.g. "Our Fleets") */
  eyebrow?: string | ReactNode;
  /** Big heading */
  heading: string | ReactNode;
  /** Cards data */
  items: FleetCard[];
  /** Optional "View More" text (hidden if empty) */
  ctaLabel?: string;
  /** Either pass a URL… */
  ctaHref?: string;
  /** …or a click handler */
  onCtaClick?: () => void;
  /** Extra class on the root section */
  className?: string;
}

export default function FleetHome({
  eyebrow,
  heading,
  items,
  ctaLabel = 'View More',
  ctaHref,
  onCtaClick,
  className = '',
}: FleetHomeProps) {
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

  const Cta = () =>
    ctaLabel ? (
      ctaHref ? (
        <Link
          href={ctaHref}
          className="group hidden md:inline-flex items-center gap-1 text-white/90 hover:text-white transition-colors"
        >
          <span className="text-sm font-medium">{ctaLabel}</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      ) : onCtaClick ? (
        <button
          onClick={onCtaClick}
          className="group hidden md:inline-flex items-center gap-1 text-white/90 hover:text-white transition-colors"
          type="button"
        >
          <span className="text-sm font-medium">{ctaLabel}</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      ) : null
    ) : null;

  const Card = ({ card }: { card: FleetCard }) => {
    const alt =
      card.alt || (typeof card.title === 'string' ? card.title : 'Fleet');
    const body = (
      <>
        <div className="relative h-72 w-full overflow-hidden bg-white">
          <Image
            src={card.image}
            alt={alt}
            fill
            sizes="(max-width:768px) 85vw, (max-width:1024px) 50vw, 33vw"
            className="object-contain p-6"
            priority={false}
          />
        </div>
        <h3 className="mt-3 text-[17px] font-semibold">{card.title}</h3>
        {card.subtitle ? (
          <p className="mt-1 text-[11px] uppercase tracking-wide text-white/70">
            {card.subtitle}
          </p>
        ) : null}
      </>
    );

    return card.href ? (
      <Link
        href={card.href}
        className="group block rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
      >
        {body}
      </Link>
    ) : (
      <div className="block">{body}</div>
    );
  };

  return (
    <section
      className={`relative bg-primary text-white py-8 md:py-18 px-4 overflow-hidden ${className}`}
    >
      {/* soft corner glows */}
      <div className="pointer-events-none absolute -top-10 -right-10 h-[28rem] w-[28rem] rounded-full bg-gradient-to-bl from-white/15 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-[28rem] w-[28rem] rounded-full bg-gradient-to-tr from-white/15 to-transparent blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            {eyebrow ? (
              <h4 className="mb-2 text-xs uppercase tracking-wider text-secondary">
                {eyebrow}
              </h4>
            ) : null}
            <h1 className="max-w-4xl text-3xl font-extrabold leading-tight md:text-5xl">
              {heading}
            </h1>
          </div>
          <Cta />
        </div>

        {/* Mobile: horizontal scroll */}
        <div className="md:hidden -mx-4">
          <div 
            ref={scrollContainerRef}
            className="overflow-x-auto overflow-y-hidden px-4 scrollbar-hide snap-x snap-mandatory"
          >
            <div className="flex gap-4 pb-2">
              {(items ?? []).map((card, i) => (
                <div key={i} className="flex-shrink-0 w-[85vw] snap-start">
                  <Card card={card} />
                </div>
              ))}
            </div>
          </div>

          {/* dots */}
          {items.length > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollToIndex(i)}
                  aria-label={`Go to fleet slide ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    activeIndex === i ? 'w-6 bg-white' : 'w-2 bg-white/60'
                  }`}
                  type="button"
                />
              ))}
            </div>
          )}

          {/* Mobile CTA */}
          {ctaLabel && (ctaHref || onCtaClick) ? (
            <div className="mt-6 flex justify-center md:hidden">
              {ctaHref ? (
                <Link
                  href={ctaHref}
                  className="group inline-flex items-center gap-1 text-white/90 hover:text-white transition-colors"
                >
                  <span className="text-sm font-medium">{ctaLabel}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              ) : onCtaClick ? (
                <button
                  onClick={onCtaClick}
                  className="group inline-flex items-center gap-1 text-white/90 hover:text-white transition-colors"
                  type="button"
                >
                  <span className="text-sm font-medium">{ctaLabel}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              ) : null}
            </div>
          ) : null}
        </div>

        {/* Desktop: 3-column grid */}
        <div className="hidden md:grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(items ?? []).map((card, i) => (
            <Card key={i} card={card} />
          ))}
        </div>
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