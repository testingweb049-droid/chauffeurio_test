"use client";

import { usePathname } from "next/navigation";
import Header from "@/component/header/Header";
import Footer from "@/component/footer/Footer";

export function AdminRouteWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}

