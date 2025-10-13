"use client";

import React from "react";

interface HeroSection2Props {
  bgImage: string;
  text: string;
}

export default function HeroSection2({ bgImage, text }: HeroSection2Props) {
  return (
    <section
      className="relative w-full md:h-[70vh] h-[40vh] bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-primary opacity-50"></div>
      <div className="relative z-10 flex items-center justify-center w-full h-full text-center text-white px-4">
        <h1 >{text}</h1>
      </div>
    </section>
  );
}
