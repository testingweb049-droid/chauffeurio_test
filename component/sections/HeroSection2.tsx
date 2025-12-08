"use client";

import React from "react";
import { motion } from "framer-motion";
import { StaticImageData } from "next/image";
import Image from "next/image";

interface HeroSection2Props {
  bgImage: StaticImageData | string;
  text: string;
}

export default function HeroSection2({ bgImage, text }: HeroSection2Props) {
  // Check if bgImage is StaticImageData or string
  const isStaticImage = typeof bgImage !== 'string';

  return (
    <section className="relative w-full md:h-[60vh] h-[40vh] overflow-hidden">
      {/* Background Image */}
      {isStaticImage ? (
        // Use Next.js Image for StaticImageData
        <Image
          src={bgImage}
          alt="Hero background"
          fill
          className="object-cover"
          priority
        />
      ) : (
        // Use inline style for string URL
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-primary opacity-50"></div>

      {/* Animated text */}
      <div className="relative z-10 flex items-center justify-center w-full h-full text-center text-white px-4">
        <motion.h1
          className="uppercase text-3xl md:text-5xl font-bold tracking-wide"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1,
            ease: "easeOut",
          }}
        >
          {text}
        </motion.h1>
      </div>
    </section>
  );
}