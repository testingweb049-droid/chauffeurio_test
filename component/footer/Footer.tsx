"use client";

import Image from "next/image";
import {
  Mail,
  Phone,
  Facebook,
  Instagram,
  Dribbble,
  X as XIcon, // lucide-react "X" (Twitter/X)
} from "lucide-react";

export default function Footer() {
  const quickLinks = [
    { name: "Home", href: "#" },
    { name: "About Us", href: "#" },
    { name: "Our Fleets", href: "#" },
    { name: "Services", href: "#" },
    { name: "Contact", href: "#" },
    { name: "FAQs", href: "/faqs" },
  ];

  const services = [
    { name: "Airport Transfers", href: "#" },
    { name: "Hourly Chauffeurs", href: "#" },
    { name: "Event Transportation", href: "#" },
    { name: "City Tours and Excursions", href: "#" },
    { name: "Business Chauffeur Services", href: "#" },
    { name: "Long-Distance City to City", href: "#" },
  ];

  const footerLinks = [
    { name: "Terms and Conditions", href: "#" },
    { name: "Legal Warning", href: "#" },
    { name: "Privacy Policy", href: "#" },
    { name: "Cookies Policy", href: "#" },
  ];

  return (
    <footer className="bg-primary text-white">
      {/* Main */}
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo + Info */}
          <div className="space-y-5">
            <a href="/" aria-label="Home" className="inline-flex items-center">
              <Image
                src="/logo.png"
                alt="Company Logo"
                width={160}
                height={64}
                className="h-12 w-auto"
                priority
              />
            </a>

            <div className="space-y-1 text-sm text-gray-300">
              <p className="text-[#d2dde0]">Valencia—</p>
              <p className="text-[#d2dde0]">Operating Hours: Mon–Sun, 24 Hours</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-300 transition-colors hover:text-yellow-400"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Services</h3>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.name}>
                  <a
                    href={service.href}
                    className="text-sm text-gray-300 transition-colors hover:text-yellow-400"
                  >
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Payments + Contact + Social */}
          <div className="space-y-6">
            <div>
              <h3 className="mb-4 text-lg font-semibold">Payment Accepted</h3>
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
              <SocialSquare aria="Facebook" href="#">
                <Facebook size={18} />
              </SocialSquare>
              <SocialSquare aria="X" href="#">
                <XIcon size={18} />
              </SocialSquare>
              <SocialSquare aria="Dribbble" href="#">
                <Dribbble size={18} />
              </SocialSquare>
              <SocialSquare aria="Instagram" href="#">
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
            <p>© 2025. All rights reserved.</p>
            <div className="flex flex-wrap justify-center gap-6">
              {footerLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="transition-colors hover:text-yellow-400"
                >
                  {link.name}
                </a>
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
