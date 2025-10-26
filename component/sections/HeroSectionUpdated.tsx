import React from "react";
import Image from "next/image";
import HeroForm from "./HeroForm";
import YearsImage from "@/assets/new-form/10years.png";
import { ClientSideStrings } from "../translations/ClientSideTranslations";

const HeroSectionUpdated: React.FC = () => {
  const { home } = ClientSideStrings();
  const hero = home?.hero ?? { eyebrow: "", titleLines: [] as string[] };

  return (
    <div className="relative">
      {/* Background image */}
      <Image
        src="/hero.jpg"
        height={400}
        width={400}
        alt="Background"
        className="absolute w-full h-[500px] lg:h-full left-0 right-0 object-cover"
        priority
      />

      {/* Overlay */}
      <div className="relative bg-black/40 w-full max-lg:rounded-b-3xl">
        <div className="grid lg:grid-cols-2 gap-10 items-center pt-16 lg:py-48 lg:px-5 w-full max-w-screen-2xl mx-auto px-0 lg:px-4">
          
          {/* LEFT SIDE — Text content */}
          <div className="flex flex-col gap-4 md:gap-6 justify-center text-left text-white px-4 lg:px-0">
            <Image
              src={YearsImage}
              height={200}
              width={200}
              alt="10 years"
              className="w-16 lg:w-40 object-contain hidden md:block"
            />

            <h6 className="uppercase tracking-[0.2em] font-bold text-[#FFFBF6] text-xl ">
              {hero.eyebrow}
            </h6>

            <h1 className="font-semibold text-2xl md:text-3xl lg:text-4xl ">
              {hero.titleLines.map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </h1>
          </div>

          {/* RIGHT SIDE — Hero Form */}
          <div className="flex justify-end items-center w-full">
            <div className="w-full lg:max-w-md lg:rounded-2xl lg:shadow-lg">
              {/* Mobile: Full width form with no rounded corners and no shadow */}
              {/* Desktop: Normal form with rounded corners and shadow */}
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