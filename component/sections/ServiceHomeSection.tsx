'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ReactNode, useEffect, useState } from 'react';

export type ServiceItem = {
  href: string;
  title: string | ReactNode;
  image: string;
  alt?: string;
};

interface ServiceHomeSectionProps {
  eyebrow?: string | ReactNode;
  heading: string | ReactNode;
  introLeft?: string | ReactNode;
  introRight?: string | ReactNode;
  items: ServiceItem[];
  className?: string;
}

export default function ServiceHomeSection({
  eyebrow,
  heading,
  introLeft,
  introRight,
  items,
  className = '',
}: ServiceHomeSectionProps) {
  // --- mobile slider state ---
  const [current, setCurrent] = useState(0);

  // constrain index if items prop changes
  useEffect(() => {
    if (current > (items?.length ?? 1) - 1) setCurrent(0);
  }, [items, current]);

  const goTo = (i: number) => setCurrent(i);

  return (
    <section
      className={`relative bg-primary text-white py-16 md:py-20 px-4 overflow-hidden ${className}`}
    >
      {/* decorative corner glows */}
      <div className="pointer-events-none absolute -top-10 -right-10 h-[28rem] w-[28rem] rounded-full bg-gradient-to-bl from-white/15 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-[28rem] w-[28rem] rounded-full bg-gradient-to-tr from-white/15 to-transparent blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header (two columns on md+, stacked on mobile) */}
        <div className="mb-10 grid grid-cols-1 gap-6 md:mb-12 md:grid-cols-2 md:gap-10">
          <div>
            {eyebrow ? (
              <h4 className="mb-2 text-xs md:text-sm uppercase tracking-wider text-secondary">
                {eyebrow}
              </h4>
            ) : null}
            <h1 className="leading-tight">{heading}</h1>
            {introLeft ? (
              <p className="mt-4 leading-relaxed text-[#B2AEA8]">{introLeft}</p>
            ) : null}
          </div>
          {introRight ? (
            <p className="leading-relaxed text-[#B2AEA8]">{introRight}</p>
          ) : (
            <div />
          )}
        </div>

        {/* ======== Mobile: slider (one card at a time) ======== */}
        <div className="md:hidden">
          <div className="relative overflow-hidden rounded-xl">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {(items ?? []).map((svc) => {
                const alt =
                  svc.alt || (typeof svc.title === 'string' ? svc.title : 'Service');
                return (
                  <div key={svc.href} className="min-w-full px-1">
                    <Link
                      href={svc.href}
                      className="group block  focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
                    >
                      <div className="relative h-56 w-full overflow-hidden bg-white/5">
                        <Image
                          src={svc.image}
                          alt={alt}
                          fill
                          sizes="100vw"
                          className="object-cover"
                          priority={false}
                        />
                      </div>
                      
                      <h3 className="mt-4 text-lg font-bold uppercase tracking-wide">
                        {svc.title}
                      </h3>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          {/* dots */}
          <div className="mt-4 flex items-center justify-center gap-2">
            {(items ?? []).map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all ${
                  current === i ? 'w-6 bg-white' : 'w-2 bg-white/60'
                }`}
              />
            ))}
          </div>
        </div>

        {/* ======== Tablet/Desktop: grid ======== */}
        <div className="hidden md:grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(items ?? []).map((svc) => {
            const alt =
              svc.alt || (typeof svc.title === 'string' ? svc.title : 'Service');
            return (
              <Link
                key={svc.href}
                href={svc.href}
                className="group block  focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
              >
                <div className="relative h-56 w-full overflow-hidden bg-white/5">
                  <Image
                    src={svc.image}
                    alt={alt}
                    fill
                    sizes="(max-width:1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    priority={false}
                  />
                </div>
                <h6 className="mt-4 text-lg font-bold uppercase tracking-wide">
                  {svc.title}
                </h6>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
