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
      <div className="hidden md:block w-full h-full">
        <Image
          src={heroBackground}
          alt="Car rental service background"
          fill
          className="object-cover"
          priority 
          quality={100}
          placeholder="blur"
        />
      </div>

      {/* Mobile Background */}
      <div className="block md:hidden">
        <Image
          src="/HeroImage.png"
          alt="Car rental service background mobile"
          fill
          className="object-cover"
          priority
          quality={85}
          sizes="100vw"
        />
      </div>

      {/* Overlay */}
      <div className="relative bg-black/40 w-full max-lg:rounded-b-3xl">
        <div className="grid lg:grid-cols-2 gap-10 items-center pt-52 pb-10 w-full max-w-screen-2xl mx-auto px-0 lg:px-4">

          {/* LEFT SIDE — Text content */}
          <div className="flex flex-col gap-4 md:gap-6 justify-center text-left text-white px-4 lg:px-0">
            <Image
              src={YearsImage}
              height={200}
              width={200}
              alt="10 years"
              className="w-16 lg:w-40 object-contain hidden md:block"
            />

            <h2 className="font-semibold md:font-bold text-[#FFFBF6] md:text-xl text-lg pt-6 ">
              {hero.eyebrow}
            </h2>

            <h1 className="font-semibold text-2xl md:text-3xl lg:text-4xl  ">
              {hero.titleLines.map((line, i) => (
                <span key={i}>
                  {line}
                </span>
              ))}
            </h1>
          </div>

          {/* RIGHT SIDE — Hero Form */}
          <div className="flex justify-end items-center w-full">
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
