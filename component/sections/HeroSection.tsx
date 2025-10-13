"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, useReducedMotion, type Variants, type TargetAndTransition } from "framer-motion";

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

  useEffect(() => {
    if (typeof window === "undefined") return;
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
    <section className="relative md:flex md:min-h-[100svh] md:items-center bg-cover bg-center pt-24 px-0 md:px-20">
      <div
        className="absolute inset-0 bg-cover bg-center md:hidden"
        style={{ backgroundImage: "url('/hero.jpg')" }}
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-cover bg-center hidden md:block"
        style={{ backgroundImage: "url('/hero.jpg')" }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-primary/50 bg-opacity-50" aria-hidden />
    </section>
  );
}
