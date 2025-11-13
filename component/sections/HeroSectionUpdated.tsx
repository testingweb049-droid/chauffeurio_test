import React from "react";
import Image from "next/image";
import HeroForm from "./HeroForm";
import YearsImage from "@/assets/new-form/10years.png";
import { ClientSideStrings } from "../translations/ClientSideTranslations";
import heroBackground from '@/assets/new-form/ddd.png';

const HeroSectionUpdated: React.FC = () => {
  const { home } = ClientSideStrings();
  const hero = home?.hero ?? { eyebrow: "", titleLines: [] as string[] };

  return (
    <div className="relative">
      {/* Desktop Background */}
      <div className="hidden md:block absolute inset-0 w-full h-full z-50">
        <Image
          src={heroBackground}
          alt="Car rental service background"
          fill
          className="object-cover"
          priority
          quality={100}
          placeholder="blur"
        />
        {/* Dark Overlay for Mobile */}
        <div className="absolute inset-0 bg-black/40 z-10"></div>
      </div>

      {/* Mobile Background - Only top portion */}
      <div className="block md:hidden absolute top-0 left-0 w-full h-[60vh] z-50">
        <Image
          src="/HeroImage.png"
          alt="Car rental service background mobile"
          fill
          className="object-cover object-top"
          priority
          quality={85}
          sizes="100vw"
        />
        {/* Dark Overlay for Mobile */}
        <div className="absolute inset-0 bg-black/40 z-10"></div>
      </div>

      {/* Overlay */}
      <div className="relative bg-primary w-full pb-4">
        <div className="grid lg:grid-cols-2 gap-10 items-center pt-32 md:pt-52 pb-0 md:pb-10 w-full max-w-screen-2xl mx-auto px-0 lg:px-4">

          {/* LEFT SIDE — Text content */}
          <div className="flex flex-col gap-4 md:gap-6 justify-center text-left text-white px-4 lg:px-0">
            <Image
              src={YearsImage}
              height={200}
              width={200}
              alt="10 years"
              className="w-16 lg:w-40 object-contain hidden md:block"
            />

            <h2 className="font-semibold md:font-bold text-[#FFFBF6] md:text-5xl! text-lg z-50">
              {hero.eyebrow}
            </h2>

            <h1 className="md:font-semibold! text-base! md:text-3xl! z-50 font-light!">
              {hero.titleLines.map((line, i) => (
                <span key={i}>
                  {line}
                </span>
              ))}
            </h1>
          </div>

          {/* RIGHT SIDE — Hero Form */}
          <div className="flex justify-end items-center z-50">
            <div className="w-full lg:max-w-lg lg:rounded-2xl lg:shadow-lg">
              <div className="lg:bg-transparent">
                <HeroForm />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HeroSectionUpdated;