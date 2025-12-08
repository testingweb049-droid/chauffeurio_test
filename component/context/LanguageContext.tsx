'use client';
import { createContext, ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface LanguageContextType {
  lang: 'eng' | 'fr' | 'es';
  selectEng: () => void;
  selectFr: () => void;
  selectEs: () => void;
}

export const LanguageContext = createContext<LanguageContextType>({
  lang: 'eng',
  selectEng: () => console.warn("selectEng not implemented"),
  selectFr: () => console.warn("selectFr not implemented"),
  selectEs: () => console.warn("selectEs not implemented"),
});

export default function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<'eng' | 'fr' | 'es'>('eng');
  const router = useRouter();
console.log(lang,'lang')
  // Effect to check the language stored in the cookies on initial load
  useEffect(() => {
    const _lang = Cookies.get('lang');
    if (_lang === 'eng' || _lang === 'fr' || _lang === 'es') {
      setLang(_lang as 'eng' | 'fr' | 'es');
    } else {
      // Set default to English if no valid language in cookies
      Cookies.set('lang', 'eng', { expires: 365, path: '/' });
      setLang('eng');
    }
  }, []);

  // Function to select English
  function selectEng() {
    if (lang !== 'eng') {
      setLang('eng');
      Cookies.set('lang', 'eng', { expires: 365, path: '/' });
      router.refresh(); // Refresh the page or update the context
    }
  }

  // Function to select French
  function selectFr() {
    if (lang !== 'fr') {
      setLang('fr');
      Cookies.set('lang', 'fr', { expires: 365, path: '/' });
      router.refresh(); // Refresh the page or update the context
    }
  }

  // Function to select Spanish
  function selectEs() {
    if (lang !== 'es') {
      setLang('es');
      Cookies.set('lang', 'es', { expires: 365, path: '/' });
      router.refresh(); // Refresh the page or update the context
    }
  }

  return (
    <LanguageContext.Provider value={{ lang, selectEng, selectFr, selectEs }}>
      {children}
    </LanguageContext.Provider>
  );
}
