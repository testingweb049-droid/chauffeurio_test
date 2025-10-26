'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ReactNode, useRef, useState, useEffect, useCallback, memo } from 'react';
import { ArrowRight } from 'lucide-react';

export type FleetCard = {
  href?: string;
  title: string | ReactNode;
  subtitle?: string | ReactNode;
  image: string;
  alt?: string;
};

interface FleetHomeProps {
  eyebrow?: string | ReactNode;
  heading: string | ReactNode;
  items: FleetCard[];
  ctaLabel?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
  className?: string;
}

// Memoized CTA Component
const CtaButton = memo(({ 
  label, 
  href, 
  onClick, 
  isMobile = false 
}: { 
  label: string; 
  href?: string; 
  onClick?: () => void; 
  isMobile?: boolean;
}) => {
  const baseClasses = "group inline-flex items-center gap-1 transition-colors";
  const desktopClasses = "hidden md:inline-flex text-white/90 hover:text-white";
  const mobileClasses = "text-black hover:text-primary";
  const classes = `${baseClasses} ${isMobile ? mobileClasses : desktopClasses}`;

  const content = (
    <>
      <span className="text-sm font-medium">{label}</span>
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button onClick={onClick} className={classes} type="button">
        {content}
      </button>
    );
  }

  return null;
});

CtaButton.displayName = 'CtaButton';

// Memoized Card Component
const FleetCardComponent = memo(({ card }: { card: FleetCard }) => {
  const alt = card.alt || (typeof card.title === 'string' ? card.title : 'Fleet');
  
  const cardContent = (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <div className="relative h-72 w-full overflow-hidden bg-white">
        <Image
          src={card.image}
          alt={alt}
          fill
          sizes="(max-width:768px) 85vw, (max-width:1024px) 50vw, 33vw"
          className="object-contain p-6 transition-transform duration-300 group-hover:scale-105"
          priority={false}
        />
      </div>
      <div className="p-4">
        <h3 className="text-[17px] font-semibold transition-colors group-hover:text-primary">
          {card.title}
        </h3>
        {card.subtitle && (
          <p className="mt-1 text-[11px] uppercase tracking-wide text-gray-600">
            {card.subtitle}
          </p>
        )}
      </div>
    </div>
  );

  if (card.href) {
    return (
      <Link
        href={card.href}
        className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 rounded-xl"
      >
        {cardContent}
      </Link>
    );
  }

  return <div className="group">{cardContent}</div>;
});

FleetCardComponent.displayName = 'FleetCard';

// Memoized Pagination Dots
const PaginationDots = memo(({ 
  count, 
  activeIndex, 
  onDotClick 
}: { 
  count: number; 
  activeIndex: number; 
  onDotClick: (index: number) => void;
}) => {
  if (count <= 1) return null;

  return (
    <div className="mt-6 flex items-center justify-center gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          onClick={() => onDotClick(i)}
          aria-label={`Go to fleet slide ${i + 1}`}
          aria-current={activeIndex === i ? 'true' : 'false'}
          className={`h-2 rounded-full transition-all ${
            activeIndex === i ? 'w-6 bg-black' : 'w-2 bg-gray-400'
          }`}
          type="button"
        />
      ))}
    </div>
  );
});

PaginationDots.displayName = 'PaginationDots';

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

  // Optimized scroll handler with debouncing
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const scrollLeft = container.scrollLeft;
        const cardWidth = container.offsetWidth * 0.85;
        const index = Math.round(scrollLeft / cardWidth);
        setActiveIndex(index);
      }, 50);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  const scrollToIndex = useCallback((index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const cardWidth = container.offsetWidth * 0.85;
    container.scrollTo({
      left: cardWidth * index,
      behavior: 'smooth'
    });
  }, []);

  const showCta = Boolean(ctaLabel && (ctaHref || onCtaClick));

  return (
    <section
      className={`relative bg-white text-black py-8 md:py-18 px-4 overflow-hidden ${className}`}
    >
      {/* Background Glows */}
      <div className="pointer-events-none absolute -top-10 -right-10 h-[28rem] w-[28rem] rounded-full bg-gradient-to-bl from-gray-100/50 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-[28rem] w-[28rem] rounded-full bg-gradient-to-tr from-gray-100/50 to-transparent blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div className="flex-1">
            {eyebrow && (
              <h4 className="mb-2 text-xs uppercase tracking-wider text-secondary font-semibold">
                {eyebrow}
              </h4>
            )}
            <h2 className="max-w-4xl text-3xl font-extrabold leading-tight text-gray-900 md:text-5xl">
              {heading}

              
            </h2>
          </div>
          {showCta && (
            <CtaButton label={ctaLabel!} href={ctaHref} onClick={onCtaClick} />
          )}
        </div>

       
        <div className="md:hidden">
          <div 
            ref={scrollContainerRef}
            className="overflow-x-auto overflow-y-hidden -mx-4 px-4 scrollbar-hide snap-x snap-mandatory"
          >
            <div className="flex gap-4 pb-2">
              {items.map((card, i) => (
                <div key={i} className="flex-shrink-0 w-[85vw] snap-start">
                  <FleetCardComponent card={card} />
                </div>
              ))}
            </div>
          </div>

          <PaginationDots 
            count={items.length} 
            activeIndex={activeIndex} 
            onDotClick={scrollToIndex} 
          />

          {/* Mobile CTA */}
          {showCta && (
            <div className="mt-6 flex justify-center">
              <CtaButton 
                label={ctaLabel!} 
                href={ctaHref} 
                onClick={onCtaClick} 
                isMobile 
              />
            </div>
          )}
        </div>

        {/* Desktop: Grid */}
        <div className="hidden md:grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((card, i) => (
            <FleetCardComponent key={i} card={card} />
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