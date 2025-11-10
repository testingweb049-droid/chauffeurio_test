"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function useReferrer() {
  const pathname = usePathname();
  const lastRouteRef = useRef<string | null>(null);

  const [referrer, setReferrer] = useState<string | null>(null);
  const [isExternal, setIsExternal] = useState(false);
  const [referrerPage, setReferrerPage] = useState<string | null>(null); // friendly name

  useEffect(() => {
    let previous = lastRouteRef.current;

    if (!previous) {
      // First load
      const docRef = document.referrer;
      if (docRef) {
        setReferrer(docRef);
        const external = !docRef.includes(window.location.origin);
        setIsExternal(external);

        if (external) {
          // Check if it’s Stripe
          if (docRef.includes("stripe.com")) setReferrerPage("stripe");
          else setReferrerPage("external");
        } else {
          // Internal but first load (rare)
          const url = new URL(docRef);
          setReferrerPage(url.pathname);
        }
      } else {
        setReferrer(null);
        setIsExternal(false);
        setReferrerPage(null);
      }
    } else {
      // Internal navigation
      setReferrer(previous);
      setIsExternal(false);
      setReferrerPage(previous); // previous pathname
    }

    lastRouteRef.current = pathname;
  }, [pathname]);

  return { referrer, isExternal, referrerPage };
}
