"use client";

import { useState, useEffect, useRef } from "react";
import { CheckCircle } from "lucide-react";
import { ClientSideStrings } from "@/component/translations/ClientSideTranslations";

type TItem = {
  id: number;
  name: string;
  verified: boolean;
  date: string;         // e.g. "Apr 5, 2024"
  rating: number;       // 1..5
  comment: string;
  city?: string;        // optional: "Chicago, IL"
  avatarUrl?: string;   // optional: "https://..."
};

type TBadge = { source: string; score: string; reviews: string };

export default function Testimonials() {
  const { testimonials: t } = ClientSideStrings();

  // Dummy avatar URLs
  const dummyAvatars = [
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=150&h=150&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face"
  ];

  // Add avatar URLs to items
  const allItems: TItem[] = (t?.items ?? []).map((i: TItem, index: number) => ({ 
    ...i, 
    avatarUrl: dummyAvatars[index % dummyAvatars.length] // Cycle through dummy avatars
  }));

  const badges: TBadge[] = (t?.badges ?? []).map((b: TBadge) => ({ ...b }));

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isMobile) return;
    
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const cardWidth = container.offsetWidth * 0.9; // 90vw per card
      const index = Math.round(scrollLeft / cardWidth);
      setActiveIndex(index);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  const scrollToIndex = (index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const cardWidth = container.offsetWidth * 0.9;
    container.scrollTo({
      left: cardWidth * index,
      behavior: 'smooth'
    });
  };

  const Stars = ({ count = 5, size = "h-3 w-3" }: { count?: number; size?: string }) => (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className={`${size} fill-yellow-400 text-yellow-400`} viewBox="0 0 24 24">
          <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );

  const BadgeIcon = ({ source }: { source: string }) => {
    const s = source.toLowerCase();
    if (s.includes("google"))
      return <span className="inline-block h-5 w-5 rounded-full bg-white ring-1 ring-gray-200"> </span>;
    if (s.includes("facebook"))
      return <span className="inline-block h-5 w-5 rounded-full bg-blue-600"> </span>;
    if (s.includes("tripadvisor"))
      return <span className="inline-block h-5 w-5 rounded-full bg-green-600"> </span>;
    return <span className="inline-block h-5 w-5 rounded-full bg-gray-800"> </span>;
  };

  // Separated mapping functions
  const renderDesktopTestimonials = () => (
    <div className="hidden md:grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {allItems.map((item) => (
        <TestimonialCard key={item.id} item={item} />
      ))}
    </div>
  );

  const renderMobileTestimonials = () => (
    <div className="md:hidden -mx-4">
      <div 
        ref={scrollContainerRef}
        className="overflow-x-auto overflow-y-hidden px-4 scrollbar-hide snap-x snap-mandatory"
      >
        <div className="flex gap-4 pb-2">
          {allItems.map((item) => (
            <div key={item.id} className="flex-shrink-0 w-[90vw] snap-start">
              <TestimonialCard item={item} />
            </div>
          ))}
        </div>
      </div>

      {/* Dots for mobile */}
      {allItems.length > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {allItems.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToIndex(i)}
              className={`h-2 rounded-full transition-all ${
                activeIndex === i ? "w-8 bg-gray-800" : "w-2 bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );

  const renderBadges = () => (
    <div className="hidden md:hidden">
      <div className="flex flex-wrap gap-4">
        {badges.map((b, i) => (
          <div key={i} className="min-w-[160px] p-4 ring-1 ring-gray-200">
            <div className="mb-1 flex items-center gap-2">
              <BadgeIcon source={b.source} />
              <span className="text-sm font-semibold text-gray-900">{b.source}</span>
            </div>
            <div className="mb-1 flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900">{b.score}</span>
              <Stars />
            </div>
            <p className="text-xs text-gray-500">{b.reviews}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const TestimonialCard = ({ item }: { item: TItem }) => (
    <article className="rounded-lg border bg-white p-6 transition-all duration-300 hover:shadow-lg">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          {item.avatarUrl ? (
            <img
              src={item.avatarUrl}
              alt={item.name}
              className="h-12 w-12 rounded-full object-cover ring-1 ring-gray-200"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-lg font-semibold text-gray-700">
              {item.name?.charAt(0)}
            </div>
          )}
          <div>
            <div className="flex items-center gap-1">
              <h4 className="text-sm font-semibold text-gray-900">{item.name}</h4>
              {item.verified && <CheckCircle className="h-4 w-4 text-green-500" />}
            </div>
            {item.city ? (
              <p className="text-xs text-gray-500">{item.city}</p>
            ) : (
              <p className="text-xs text-gray-500">&nbsp;</p>
            )}
          </div>
        </div>
      </div>

      <p className="min-h-[84px] text-sm leading-relaxed text-gray-600">{item.comment}</p>

      <div className="mt-4 flex items-center justify-between">
        <Stars count={item.rating} size="h-3 w-3" />
        <span className="text-xs text-gray-500">{item.date}</span>
      </div>
    </article>
  );

  return (
    <section className="bg-gray-50 md:py-16 py-8">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-3">
          <h4 className="uppercase tracking-wider text-secondary font-semibold">{t?.eyebrow}</h4>
        </div>

        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <h1 className="max-w-2xl text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            {t?.title}
          </h1>
          
          {renderBadges()}
        </div>

        <div className="relative">
          {renderMobileTestimonials()}
          {renderDesktopTestimonials()}
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