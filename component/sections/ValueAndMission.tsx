'use client';

import React from 'react';

type Stat = {
  value: string;   // e.g. "10,000+"
  label: string;   // e.g. "Happy Customer"
};

interface ValueAndMissionProps {
  eyebrow?: string;
  heading: string;
  stats: Stat[];                   // expect 4 items
  missionTitle: string;
  missionText: string;
  visionTitle: string;
  visionText: string;
}

export default function ValueAndMission({
  eyebrow = '',
  heading,
  stats,
  missionTitle,
  missionText,
  visionTitle,
  visionText,
}: ValueAndMissionProps) {
  return (
    <section className="relative bg-primary text-white px-4 overflow-hidden py-8 md:py-16">
      {/* soft decorative glows */}
      <div className="pointer-events-none absolute -top-24 right-0 w-[28rem] h-[28rem] rounded-full bg-gradient-to-bl from-white/20 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-0 w-[28rem] h-[28rem] rounded-full bg-gradient-to-tr from-white/20 to-transparent blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Eyebrow + Heading */}
        <div className="text-center mb-8 md:mb-12">
          {eyebrow ? (
            <h4 className="text-secondary text-left md:text-center uppercase mb-2 tracking-wide">{eyebrow}</h4>
          ) : null}
          <h1 className="text-3xl md:text-5xl text-left md:text-center font-bold leading-tight">{heading}</h1>
        </div>

        {/* ================= DESKTOP / TABLET ================= */}
        <div className="hidden md:block">
          {/* Gold stats bar — slight overlap */}
          <div className="mx-auto max-w-6xl relative z-20 translate-y-5">
            <div className="bg-secondary text-primary rounded-xl px-10 py-8 shadow-sm">
              <div className="grid grid-cols-2 md:grid-cols-4">
                {stats.map((s, i) => (
                  <div
                    key={i}
                    className={`flex flex-col items-center text-center ${
                      i < stats.length - 1 ? 'md:border-r md:border-primary/30' : ''
                    } px-4`}
                  >
                    <div className="text-4xl font-semibold tracking-tight">{s.value}</div>
                    <div className="mt-1 text-lg opacity-90 text-[#303B40]">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* White card below */}
          <div className="-mt-5 relative z-10">
            <div className="bg-white text-[#303B40] rounded-xl shadow-md px-12 pt-16 pb-12">
              <div className="grid grid-cols-2 gap-12">
                <div className="pr-8 border-r border-gray-200">
                  <h3 className="text-3xl font-semibold text-center mb-6">{missionTitle}</h3>
                  <p className="text-[#5F5D5A] leading-relaxed">{missionText}</p>
                </div>
                <div className="pl-8">
                  <h3 className="text-3xl font-semibold text-center mb-6">{visionTitle}</h3>
                  <p className="text-[#5F5D5A] leading-relaxed">{visionText}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= MOBILE (matches your screenshot) ================= */}
        <div className="md:hidden">
          {/* Mission */}
          <div className="text-center">
            <h3 className="text-2xl font-semibold mb-4">{missionTitle}</h3>
            <p className="text-[#B1B1B1] leading-relaxed">{missionText}</p>
          </div>

          {/* Thin divider line */}
          <div className="my-6">
            <hr className="border-white/30" />
          </div>

          {/* Vision */}
          <div className="text-center">
            <h3 className="text-2xl font-semibold mb-4">{visionTitle}</h3>
            <p className="text-[#B1B1B1] leading-relaxed">{visionText}</p>
          </div>

          {/* Full-bleed gold stats footer */}
          <div className="mt-8 -mx-4"> {/* -mx-4 cancels section padding for edge-to-edge bar */}
            <div className="bg-secondary text-primary md:px-6 px-2 py-6">
              <div className="grid grid-cols-4 gap-y-6 ">
                {stats.map((s, i) => (
                  <div key={i} className="flex flex-col">
                    <div className="md:text-2xl text-md font-semibold tracking-tight">{s.value}</div>
                    <div className="mt-1 md:text-sm text-[10px] opacity-90 text-[#303B40]">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* ===================================================== */}
      </div>
    </section>
  );
}
