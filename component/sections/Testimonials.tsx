"use client";

import { useState, useEffect } from "react";
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

  const allItems: TItem[] = (t?.items ?? []).map((i: TItem) => ({ ...i }));
  const badges: TBadge[] = (t?.badges ?? []).map((b: TBadge) => ({ ...b }));

  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w >= 1280) setItemsToShow(4);
      else if (w >= 1024) setItemsToShow(3);
      else if (w >= 768) setItemsToShow(2);
      else setItemsToShow(1);
      setCurrentIndex(0);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalSlides = Math.max(1, Math.ceil((allItems.length || 1) / itemsToShow));
  const startIdx = currentIndex * itemsToShow;
  const visible = allItems.slice(startIdx, startIdx + itemsToShow);

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
<div className="hidden md:block">


          <div className="flex flex-wrap gap-4  ">
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
        </div>

        <div className="relative">
          <div className="mb-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visible.map((it) => (
              <article
                key={it.id}
                className="rounded-lg border bg-white p-6 transition-all duration-300 hover:shadow-lg"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {it.avatarUrl ? (
                      <img
                        src={it.avatarUrl}
                        alt={it.name}
                        className="h-12 w-12 rounded-full object-cover ring-1 ring-gray-200"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-lg font-semibold text-gray-700">
                        {it.name?.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-1">
                        <h4 className="text-sm font-semibold text-gray-900">{it.name}</h4>
                        {it.verified && <CheckCircle className="h-4 w-4 text-green-500" />}
                      </div>
                      {it.city ? (
                        <p className="text-xs text-gray-500">{it.city}</p>
                      ) : (
                        <p className="text-xs text-gray-500">&nbsp;</p>
                      )}
                    </div>
                  </div>
                </div>

                <p className="min-h-[84px] text-sm leading-relaxed text-gray-600">{it.comment}</p>

                <div className="mt-4 flex items-center justify-between">
                  <Stars count={it.rating} size="h-3 w-3" />
                  <span className="text-xs text-gray-500">{it.date}</span>
                </div>
              </article>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-2 w-2 rounded-full transition-all ${
                  currentIndex === i ? "w-8 bg-gray-800" : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
