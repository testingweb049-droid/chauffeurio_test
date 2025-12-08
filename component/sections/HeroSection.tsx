"use client";

import { useEffect, useMemo, useState } from "react";
import { useReducedMotion, type Variants, type TargetAndTransition } from "framer-motion";
import HeroContent from "./HeroContent";
import BookingBar from "./BookingBar";
import { ClientSideStrings } from "@/component/translations/ClientSideTranslations";

function buildVariants(
  sideDesktop: "left" | "right",
  sideMobile: "up" | "down",
  isMdUp: boolean,
  prefersReducedMotion: boolean,
  delay: number
): Variants {
  const hidden: TargetAndTransition = prefersReducedMotion
    ? { opacity: 0 }
    : isMdUp
    ? sideDesktop === "left"
      ? { opacity: 0, x: -60 }
      : { opacity: 0, x: 60 }
    : sideMobile === "up"
    ? { opacity: 0, y: -40 }
    : { opacity: 0, y: 40 };

  const show: TargetAndTransition = prefersReducedMotion
    ? { opacity: 1, transition: { duration: 0.2 } }
    : {
        opacity: 1,
        x: 0,
        y: 0,
        transition: { type: "spring", stiffness: 60, damping: 14, delay },
      };

  return { hidden, show };
}

export default function HeroSection() {
  const [isMdUp, setIsMdUp] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // ⬇️ get strings
  const { home } = ClientSideStrings();
  const hero = home?.hero ?? { eyebrow: "", titleLines: [] as string[] };

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsMdUp(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  const leftVariants = useMemo(
    () => buildVariants("left", "up", isMdUp, !!prefersReducedMotion, 0.05),
    [isMdUp, prefersReducedMotion]
  );

  const rightVariants = useMemo(
    () => buildVariants("right", "down", isMdUp, !!prefersReducedMotion, 0.15),
    [isMdUp, prefersReducedMotion]
  );

  return (
    <section className="relative md:flex md:min-h-[100svh] md:items-center bg-cover bg-center md:pt-40 pt-20 px-0 md:px-20">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/hero.jpg')" }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-[#0A2D3A]/60" aria-hidden />

      {/* Content container */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-2 md:px-5">
        <div className="grid gap-8 md:gap-32">
          <div>
             <HeroContent
              variants={leftVariants}
              eyebrow={hero.eyebrow}
              titleLines={[...hero.titleLines]}  
            />
          </div>

          {/* Booking bar */}
          <div className="max-w-6xl pb-2">
            <BookingBar
              variants={rightVariants}
              onSubmit={(data) => {
                console.log("booking form:", data);
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
