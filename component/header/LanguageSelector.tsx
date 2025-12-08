"use client";

import * as React from "react";
import { MdOutlineArrowDropDown, MdOutlineDone } from "react-icons/md";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { cn } from "@/lib/utils";
import useLang from "../hooks/useLang";
import Flag from 'react-world-flags';  // Import Flag component

export function LanguageSelector() {
  const [open, setOpen] = React.useState(false); // To control dropdown state
  const { lang, selectEng, selectFr, selectEs } = useLang(); // Destructure lang state and functions
console.log(lang,'lang')
  // Handle the language selection and closing of the dropdown
  const handleSelectLanguage = (language: 'eng' | 'fr' | 'es') => {
    console.log(language,'language')
    if (language === 'eng') {
      selectEng();
    } else if (language === 'fr') {
      selectFr();
    } else if (language === 'es') {
      console.log(language,'ess')
      selectEs();
    }
    setOpen(false); // Close the dropdown menu after a selection is made
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center justify-center gap-1 text-xs w-20 cursor-pointer">
          {/* Display flag and selected language */}
          <Flag code={lang === 'eng' ? 'GB' : lang === 'fr' ? 'FR' : 'ES'} className="w-5 h-5" />
          <p className="text-white text-md">{lang.toUpperCase()}</p> {/* Selected language in white */}
          <MdOutlineArrowDropDown className="text-2xl text-white font-bold" />
        </div>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-36 bg-primary text-white">
        <DropdownMenuLabel className="text-white">Select Language</DropdownMenuLabel>
        <div className="my-1 w-full bg-brandGray rounded-full h-[1px]" />
        <div className="w-full flex flex-col divide-y divide-brandGray/50">
          {/* English Option */}
          <div onClick={() => handleSelectLanguage('eng')} className="flex items-center gap-2 py-1 cursor-pointer">
            <MdOutlineDone className={cn(lang === 'eng' ? 'opacity-100 text-white' : 'opacity-0 text-white')} />
            <Flag code="GB" className="w-5 h-5" />
            <p className="text-white">English</p>
          </div>
          
          {/* French Option */}
          <div onClick={() => handleSelectLanguage('fr')} className="flex items-center gap-2 py-1 cursor-pointer">
            <MdOutlineDone className={cn(lang === 'fr' ? 'opacity-100 text-white' : 'opacity-0 text-white')} />
            <Flag code="FR" className="w-5 h-5" />
            <p className="text-white">French</p>
          </div>
          
          {/* Spanish Option */}
          <div onClick={() => handleSelectLanguage('es')} className="flex items-center gap-2 py-1 cursor-pointer">
            <MdOutlineDone className={cn(lang === 'es' ? 'opacity-100 text-white' : 'opacity-0 text-white')} />
            <Flag code="ES" className="w-5 h-5" />
            <p className="text-white">Spanish</p>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
