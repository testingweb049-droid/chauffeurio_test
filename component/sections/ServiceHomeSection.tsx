'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ReactNode, useState } from 'react';

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
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section
      className={`relative bg-primary text-white py-8 md:py-20 px-4 overflow-hidden ${className}`}
    >
      {/* decorative corner glows */}
      <div className="pointer-events-none absolute -top-10 -right-10 h-[28rem] w-[28rem] rounded-full bg-gradient-to-bl from-white/15 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-[28rem] w-[28rem] rounded-full bg-gradient-to-tr from-white/15 to-transparent blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        {/* Header (two columns on md+, stacked on mobile) */}
        <div className="mb-10 grid grid-cols-1 gap-6 md:mb-12 md:grid-cols-2 md:gap-10">
          <div>
            {/* {eyebrow ? (
              <h4 className="mb-2 text-xs md:text-sm uppercase tracking-wider text-secondary">
                {eyebrow}
              </h4>
            ) : null} */}
            <h1 className="leading-tight">{heading}</h1>
            {/* {introLeft ? (
              <p className="mt-4 leading-relaxed text-[#B2AEA8]">{introLeft}</p>
            ) : null} */}
          </div>
          
          {/* Right Intro with Read More/Less */}
          {introRight ? (
            <div className="relative">
              {/* <p className={`leading-relaxed text-[#B2AEA8] md:block ${isExpanded ? '' : 'line-clamp-3'}`}>
                {introRight}
              </p> */}
              
              {/* Read More/Less Button - Mobile Only */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-3 text-secondary text-sm font-semibold hover:text-yellow-400 transition-colors md:hidden"
              >
                {isExpanded ? 'Read Less' : 'Read More'}
              </button>
            </div>
          ) : (
            <div />
          )}
        </div>

        {/* ======== Mobile: horizontal scrollable ======== */}
        <div className="md:hidden -mx-4">
          <div className="overflow-x-auto overflow-y-hidden px-4 scrollbar-hide">
            <div className="flex gap-4 pb-2">
              {(items ?? []).map((svc) => {
                const alt =
                  svc.alt || (typeof svc.title === 'string' ? svc.title : 'Service');
                return (
                  <Link
                    key={svc.href}
                    href={svc.href}
                    className="group block flex-shrink-0 w-[85vw] focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
                  >
                    <div className="relative h-56 w-full overflow-hidden bg-white/5 rounded-xl">
                      <Image
                        src={svc.image}
                        alt={alt}
                        fill
                        sizes="85vw"
                        className="object-cover object-center"
                        priority={false}
                      />
                      {/* Text overlay on image */}
                      <div className="absolute inset-0 bg-black/40 flex items-end p-4">
                        <h3 className="text-lg font-bold uppercase tracking-wide text-white">
                          {svc.title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
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
                className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
              >
                <div className="relative h-56 w-full overflow-hidden bg-white/5 ">
                  <Image
                    src={svc.image}
                    alt={alt}
                    fill
                    sizes="(max-width:1024px) 50vw, 33vw"
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
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

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
}