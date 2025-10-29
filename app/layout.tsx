import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto } from "next/font/google";
import "./globals.css";
import Header from "@/component/header/Header";
import Footer from "@/component/footer/Footer";
import LanguageProvider from "@/component/context/LanguageContext";

const roboto = Roboto({
  weight: ["100", "300", "400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
});

// GENERAL SITE METADATA - Applies to all pages unless overridden
export const metadata: Metadata = {
  title: {
    default: "Chauffeurio | Premium Chauffeur & Car Services in Valencia, Spain",
    template: "%s | Chauffeurio Spain"
  },
  description: "Chauffeurio offers premium chauffeur services, airport transfers, executive travel, and luxury transportation in Valencia, Spain. 24/7 reliable service with professional drivers.",
  keywords: "chauffeur services, airport transfer valencia, luxury car service spain, executive travel, vip transportation valencia",
  authors: [{ name: "Chauffeurio" }],
  creator: "Chauffeurio",
  publisher: "Chauffeurio",
  metadataBase: new URL('https://chauffeurio.com'),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://chauffeurio.com",
    siteName: "Chauffeurio",
    title: "Chauffeurio | Premium Chauffeur Services in Valencia, Spain",
    description: "Premium chauffeur services and airport transfers in Valencia, Spain",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Chauffeurio - Premium Chauffeur Services Valencia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chauffeurio | Premium Chauffeur Services in Valencia",
    description: "Premium chauffeur services and airport transfers in Valencia, Spain",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${roboto.variable} antialiased`}>
        <LanguageProvider>
          <Header/>
          <main>
            {children}
          </main>
          <Footer/>
        </LanguageProvider>
      </body>
    </html>
  );
}