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
        <div className="flex items-center justify-center gap-1 text-xs cursor-pointer hover:opacity-80 transition-opacity">
          {/* Display flag and selected language */}
          <Flag code={lang === 'eng' ? 'GB' : lang === 'fr' ? 'FR' : 'ES'} className="w-4 h-4 md:w-5 md:h-5" />
          <p className="text-white text-sm md:text-md font-medium">{lang.toUpperCase()}</p>
          <MdOutlineArrowDropDown className="text-xl md:text-2xl text-white" />
        </div>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-36 bg-primary text-white !z-[9999] border border-white/20 shadow-xl"
        style={{ zIndex: 9999 }}
      >
        <DropdownMenuLabel className="text-white text-sm font-semibold">Select Language</DropdownMenuLabel>
        <div className="my-1 w-full bg-brandGray rounded-full h-[1px]" />
        <div className="w-full flex flex-col divide-y divide-brandGray/50">
          {/* English Option */}
          <div 
            onClick={() => handleSelectLanguage('eng')} 
            className={cn(
              "flex items-center gap-2 py-2 px-2 cursor-pointer transition-colors",
              lang === 'eng' ? 'bg-white/10' : 'hover:bg-white/5'
            )}
          >
            <MdOutlineDone className={cn("text-lg", lang === 'eng' ? 'opacity-100 text-white' : 'opacity-0')} />
            <Flag code="GB" className="w-4 h-4" />
            <p className="text-white text-sm">English</p>
          </div>
          
          {/* French Option */}
          <div 
            onClick={() => handleSelectLanguage('fr')} 
            className={cn(
              "flex items-center gap-2 py-2 px-2 cursor-pointer transition-colors",
              lang === 'fr' ? 'bg-white/10' : 'hover:bg-white/5'
            )}
          >
            <MdOutlineDone className={cn("text-lg", lang === 'fr' ? 'opacity-100 text-white' : 'opacity-0')} />
            <Flag code="FR" className="w-4 h-4" />
            <p className="text-white text-sm">French</p>
          </div>
          
          {/* Spanish Option */}
          <div 
            onClick={() => handleSelectLanguage('es')} 
            className={cn(
              "flex items-center gap-2 py-2 px-2 cursor-pointer transition-colors",
              lang === 'es' ? 'bg-white/10' : 'hover:bg-white/5'
            )}
          >
            <MdOutlineDone className={cn("text-lg", lang === 'es' ? 'opacity-100 text-white' : 'opacity-0')} />
            <Flag code="ES" className="w-4 h-4" />
            <p className="text-white text-sm">Spanish</p>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
