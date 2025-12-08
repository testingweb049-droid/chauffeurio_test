"use client";

import { motion, type Variants } from "framer-motion";

type HeroContentProps = {
  eyebrow?: string;
  titleLines: string[]; // each line becomes a new line (like the screenshot)
  variants?: Variants;  // passed from parent for coordinated animation
};

export default function HeroContent({ eyebrow, titleLines, variants }: HeroContentProps) {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="show"
      className="relative z-10 text-white max-w-4xl"
    >
      {eyebrow ? (
        <h6 className="uppercase tracking-[0.2em] font-bold text-[#FFFBF6] text-xl md:mb-4 mb-0">
          {eyebrow}
        </h6>
      ) : null}

      <h1 className="font-bold leading-tight md:block hidden">
        {titleLines.map((line, i) => (
          <span
            key={i}
            className="block text-3xl md:text-5xl lg:text-6xl xl:text-7xl"
          >
            {line}
          </span>
        ))}
      </h1>
    </motion.div>
  );
}
