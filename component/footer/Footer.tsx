"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  Phone,
  Facebook,
  Instagram,
  Dribbble,
  X as XIcon,
} from "lucide-react";
import { ClientSideStrings } from "../translations/ClientSideTranslations";

export default function Footer() {
  const { footer } = ClientSideStrings();

  const quickLinks = [
    { name: footer?.quickLinks?.home || "Home", href: "/" },
    { name: footer?.quickLinks?.aboutUs || "About Us", href: "#about" },
    { name: footer?.quickLinks?.ourFleets || "Our Fleets", href: "#fleets" },
    { name: footer?.quickLinks?.services || "Services", href: "#services" },
    { name: footer?.quickLinks?.contact || "Contact", href: "#contact" },
    { name: footer?.quickLinks?.faqs || "FAQs", href: "/faqs" },
  ];

  const services = [
    { name: footer?.services?.airportTransfers || "Airport Transfers", href: "#airport" },
    { name: footer?.services?.hourlyChauffeurs || "Hourly Chauffeurs", href: "#hourly" },
    { name: footer?.services?.eventTransportation || "Event Transportation", href: "#events" },
    { name: footer?.services?.cityTours || "City Tours and Excursions", href: "#tours" },
    { name: footer?.services?.businessChauffeur || "Business Chauffeur Services", href: "#business" },
    { name: footer?.services?.longDistance || "Long-Distance City to City", href: "#long-distance" },
  ];

  const footerLinks = [
    { name: footer?.footerLinks?.termsConditions || "Terms and Conditions", href: "/terms-condition?section=terms" },
    { name: footer?.footerLinks?.legalWarning || "Legal Warning", href: "/terms-condition?section=legal-warning" },
    { name: footer?.footerLinks?.privacyPolicy || "Privacy Policy", href: "/terms-condition?section=privacy" },
    { name: footer?.footerLinks?.cookiesPolicy || "Cookies Policy", href: "/terms-condition?section=cookies" },
  ];

  return (
    <footer className="bg-primary text-white">
      {/* Main */}
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo + Info */}
          <div className="space-y-5">
            <Link href="/" aria-label="Home" className="inline-flex items-center">
              <Image
                src="/Chauffeurio Logo PNG.png"
                alt="Company Logo"
                width={160}
                height={64}
                className="h-12 w-auto"
                priority
              />
            </Link>

            <div className="space-y-1 text-sm text-gray-300">
              <p className="text-[#d2dde0]">{footer?.location || "Valencia—"}</p>
              <p className="text-[#d2dde0]">{footer?.operatingHours || "Operating Hours: Mon–Sun, 24 Hours"}</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">{footer?.quickLinksTitle || "Quick Links"}</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-300 transition-colors hover:text-yellow-400"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">{footer?.servicesTitle || "Services"}</h3>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.name}>
                  <Link
                    href={service.href}
                    className="text-sm text-gray-300 transition-colors hover:text-yellow-400"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Payments + Contact + Social */}
          <div className="space-y-6">
            <div>
              <h3 className="mb-4 text-lg font-semibold">{footer?.paymentTitle || "Payment Accepted"}</h3>
              <div className="flex flex-wrap items-center gap-2">
                <CardVisa />
                <CardMastercard />
                <CardAmex />
                <CardUnionPay />
              </div>
            </div>

            {/* Contact */}
            <div className="space-y-3">
              <a
                href="mailto:Info@Chauffeurio.com"
                className="flex items-center gap-2 text-sm text-gray-300 transition-colors hover:text-yellow-400"
              >
                <Mail size={16} />
                <span>Info@Chauffeurio.com</span>
              </a>
              <a
                href="tel:+34614014277"
                className="flex items-center gap-2 text-sm text-gray-300 transition-colors hover:text-yellow-400"
              >
                <Phone size={16} />
                <span>+34 614 014 277</span>
              </a>
            </div>

            {/* Social */}
            <div className="flex gap-3">
              <SocialSquare aria="Facebook" href="https://facebook.com">
                <Facebook size={18} />
              </SocialSquare>
              <SocialSquare aria="X" href="https://twitter.com">
                <XIcon size={18} />
              </SocialSquare>
              <SocialSquare aria="Dribbble" href="https://dribbble.com">
                <Dribbble size={18} />
              </SocialSquare>
              <SocialSquare aria="Instagram" href="https://instagram.com">
                <Instagram size={18} />
              </SocialSquare>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-gray-300 md:flex-row">
            <p>{footer?.copyright || "© 2025. All rights reserved."}</p>
            <div className="flex flex-wrap justify-center gap-6">
              {footerLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="transition-colors hover:text-yellow-400"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ---------------- Helpers ---------------- */

function SocialSquare({
  children,
  href,
  aria,
}: {
  children: React.ReactNode;
  href: string;
  aria: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={aria}
      className="
        inline-flex h-10 w-10 items-center justify-center
        rounded-lg bg-[#f2c15b] text-[#0a3d4f]
        transition-colors hover:bg-[#f7cf7c]
      "
    >
      {children}
    </a>
  );
}

/* Payment card brand chips (inline SVGs) */
function CardChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center justify-center rounded-md bg-white px-2 py-1 ring-1 ring-gray-200">
      {children}
    </span>
  );
}

function CardVisa() {
  return (
    <CardChip>
      <svg width="36" height="20" viewBox="0 0 36 20" aria-label="Visa" role="img">
        <rect width="36" height="20" rx="3" fill="#ffffff" />
        <text
          x="18"
          y="13"
          textAnchor="middle"
          fontFamily="ui-sans-serif, system-ui, -apple-system"
          fontWeight="700"
          fontSize="10"
          fill="#1a1f71"
        >
          VISA
        </text>
      </svg>
    </CardChip>
  );
}

function CardMastercard() {
  return (
    <CardChip>
      <svg width="36" height="20" viewBox="0 0 36 20" aria-label="Mastercard" role="img">
        <rect width="36" height="20" rx="3" fill="#ffffff" />
        <circle cx="16" cy="10" r="6" fill="#ff5f00" />
        <circle cx="20" cy="10" r="6" fill="#eb001b" opacity="0.8" />
        <circle cx="12" cy="10" r="6" fill="#f79e1b" opacity="0.85" />
      </svg>
    </CardChip>
  );
}

function CardAmex() {
  return (
    <CardChip>
      <svg width="36" height="20" viewBox="0 0 36 20" aria-label="American Express" role="img">
        <rect width="36" height="20" rx="3" fill="#2e77bb" />
        <text
          x="18"
          y="13"
          textAnchor="middle"
          fontFamily="ui-sans-serif, system-ui, -apple-system"
          fontWeight="800"
          fontSize="7.5"
          fill="#ffffff"
        >
          AMEX
        </text>
      </svg>
    </CardChip>
  );
}

function CardUnionPay() {
  return (
    <CardChip>
      <svg width="36" height="20" viewBox="0 0 36 20" aria-label="UnionPay" role="img">
        <rect width="36" height="20" rx="3" fill="#ffffff" />
        <rect x="4" y="4" width="8" height="12" rx="2" fill="#0073b4" />
        <rect x="12" y="4" width="8" height="12" rx="2" fill="#d41a1f" />
        <rect x="20" y="4" width="12" height="12" rx="2" fill="#1c938a" />
      </svg>
    </CardChip>
  );
}