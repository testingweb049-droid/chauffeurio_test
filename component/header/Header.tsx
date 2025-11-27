'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { HiMenu, HiOutlineX } from "react-icons/hi";
import { FaInstagram } from "react-icons/fa";
import { usePathname } from "next/navigation";
import Topbar from "./Topbar";
import { ClientSideStrings } from "../translations/ClientSideTranslations";

// Define types for translation data
interface FleetItem {
  airportTransfer: string;
  hourlyChauffeurs: string;
  eventTransport: string;
  toursExcursions: string;
  cityToCity: string;
  businessChauffur: string;
}

interface Header {
  home: string;
  about: string;
  fleet: string;
  services: string;
  contact: string;
  fleetItems: FleetItem;
}

interface SocialMedia {
  instagram: string;
}

interface MobileMenu {
  menu: string;
  closeMenu: string;
}

interface Translations {
  header: Header;
  socialMedia: SocialMedia;
  mobileMenu: MobileMenu;
}

const dropdownVariants: Variants = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.15, ease: "easeIn" } },
};

const sidebarVariants: Variants = {
  initial: { x: "100%" },
  animate: { x: "0%", transition: { duration: 0.3, ease: "easeOut" } },
  exit: { x: "100%", transition: { duration: 0.3, ease: "easeIn" } },
};

interface NavItemBase {
  id: string;
  label: string;
}

interface NavItemWithHref extends NavItemBase {
  href: string;
  isDropdown?: never;
  items?: never;
}

interface NavItemWithDropdown extends NavItemBase {
  isDropdown: true;
  href?: any;
  items: { label: string; href: string }[];
}

type NavItem = NavItemWithHref | NavItemWithDropdown;

export default function Header() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const { header } = ClientSideStrings();

  const handleDropdownToggle = (id: string) => {
    setActiveDropdown((prev) => (prev === id ? null : id));
  };

  // Close mobile menu and clear dropdown when toggling
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => {
      const next = !prev;
      // If we are closing the mobile menu, also reset the active dropdown
      if (!next) setActiveDropdown(null);
      return next;
    });
  };

  // Track scroll position
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown when clicking outside of any dropdown element
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      // if the click is not inside any element that has data-dropdown attribute, close
      if (target && !target.closest("[data-dropdown]")) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Define routes that have background images in their hero sections
  const routesWithBackgroundImages = [
    "/",
    "/about",
    "/airport-transfer",
    "/tours-excursions",
    "/fleet",
    "/city-to-city",
    "/hourly-chauffurs",
    "/event-transport",
    "/business-chauffur",
    "/contact",
    "/faqs",
    "/book-ride",
  ];

  // Determine if current route has background image
  const hasBackgroundImage = routesWithBackgroundImages.includes(pathname || "");

  // Set background class:
  // - If page has background image: transparent when not scrolled, primary when scrolled
  // - If page doesn't have background image: always primary
  const bgClass = hasBackgroundImage
    ? isScrolled
      ? "bg-primary"
      : "bg-transparent"
    : "bg-primary";

  // Text should always be white for visibility against background images and primary color
  const textColorClass = "text-white";
  const hoverTextClass = "hover:text-white/90";
  const iconColorClass = "text-white";
  const borderColorClass = bgClass === "bg-transparent" ? "border-gray-300" : "border-gray-400";

  const navItems: NavItem[] = [
    { id: "home", label: header?.home || "Home", href: "/" },
    {
      id: "services",
      label: header?.services || "Services",
      isDropdown: true,
      items: [
        { label: header?.fleetItems?.airportTransfer || "Airport Transfer", href: "/airport-transfer" },
        { label: header?.fleetItems?.hourlyChauffeurs || "Hourly Chauffeurs", href: "/hourly-chauffurs" },
        { label: header?.fleetItems?.eventTransport || "Event Transport", href: "/event-transport" },
        { label: header?.fleetItems?.toursExcursions || "Tours and Excursions", href: "/tours-excursions" },
        { label: header?.fleetItems?.cityToCity || "City To City", href: "/city-to-city" },
        { label: header?.fleetItems?.businessChauffur || "business chauffeur", href: "/business-chauffur" },
      ],
    },
    { id: "fleet", label: header?.fleet || "Our Fleet", href: "/fleet" },
    { id: "about", label: header?.about || "About Us", href: "/about" },
    { id: "contact", label: header?.contact || "Contact", href: "/contact" },
  ];

  const isActive = (path: string) => pathname && pathname === path;

  // Apply primary color only when background is not transparent
  const headerStyle = bgClass === "bg-primary" 
    ? { backgroundColor: "var(--primary)" } 
    : {};

  return (
    <header 
      className={`fixed left-0 right-0 top-0 z-999 border-b ${borderColorClass} ${bgClass}`}
      style={headerStyle}
    >
      <div className="hidden md:block">
        <Topbar />
      </div>

      <div className={`transition-colors duration-300 m-auto max-w-5xl`}>
        <div className="container mx-auto">
          <div className="flex items-start justify-between md:hidden">
            <a href="/" aria-label="Home" className="flex items-center">
              <Image
                src="/Chauffeurio Logo PNG.png"
                alt="Company Logo"
                width={120}
                height={60}
                className="h-10 w-auto"
                priority
              />
            </a>

            <div className="flex items-center gap-3 py-2">
              {/* Instagram Icon */}
              <a
                href="https://www.instagram.com/chauffeurio?igsh=dW55MWFhY2EybTJz"
                className={`${iconColorClass} text-lg hover:text-yellow-500 transition-colors`}
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <button onClick={toggleMobileMenu} className={`${iconColorClass} p-2`}>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={isMobileMenuOpen ? "close" : "open"}
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isMobileMenuOpen ? <HiOutlineX size={24} /> : <HiMenu size={24} />}
                  </motion.span>
                </AnimatePresence>
              </button>
            </div>
          </div>

          <div className="hidden md:flex items-center justify-between">
            <nav className="flex items-center justify-center gap-8">
              {navItems.map((item) =>
                item.isDropdown ? (
                  <div key={item.id} className="relative" data-dropdown>
                    <button
                      onClick={() => handleDropdownToggle(item.id)}
                      className={`text-md font-normal py-2 transition-colors flex items-center ${isActive((item as any).href) ? 'border-b-2 border-secondary text-secondary' : `${textColorClass} ${hoverTextClass}`}`}
                    >
                      {item.label}
                      <svg
                        className={`w-4 h-4 ml-1 transform transition-transform duration-200 ${activeDropdown === item.id ? "rotate-180" : "rotate-0"}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    <AnimatePresence>
                      {activeDropdown === item.id && (
                        <motion.div
                          className="absolute top-full left-1/2 -translate-x-1/2 bg-white shadow-lg rounded-md mt-2 p-2 min-w-[320px] z-10 text-primary"
                          variants={dropdownVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          data-dropdown
                        >
                          <ul className="space-y-1">
                            {item.items?.map((subItem, index) => (
                              <li key={index}>
                                <a
                                  href={subItem.href}
                                  className="block px-4 py-2 hover:bg-primary hover:text-white rounded-md transition-colors"
                                  onClick={() => setActiveDropdown(null)}
                                >
                                  {subItem.label}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <a
                    key={item.id}
                    href={item.href}
                    className={`${textColorClass} ${hoverTextClass} transition-colors py-4 text-md font-normal ${isActive(item.href) ? 'border-b-2 border-secondary text-secondary' : ''}`}
                  >
                    {item.label}
                  </a>
                )
              )}
            </nav>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-y-0 right-0 z-40 w-3/4 max-w-sm bg-primary/95 shadow-lg md:hidden overflow-y-auto p-6"
            variants={sidebarVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center mb-6">
                <button onClick={toggleMobileMenu} className="text-white p-2">
                  <HiOutlineX size={24} />
                </button>
              </div>

              <nav className="flex-1">
                {navItems.map((item) =>
                  item.isDropdown ? (
                    <div key={item.id} className="relative mb-4" data-dropdown>
                      <button
                        onClick={() => handleDropdownToggle(item.id)}
                        className="text-white font-medium text-lg w-full text-left flex items-center justify-between py-2"
                      >
                        {item.label}
                        <svg
                          className={`w-5 h-5 transition-transform duration-200 ${activeDropdown === item.id ? "rotate-180" : "rotate-0"}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      <AnimatePresence>
                        {activeDropdown === item.id && (
                          <motion.div
                            className="pl-4 mt-2 space-y-2 bg-black/10 rounded-md"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            data-dropdown
                          >
                            <ul className="space-y-2 py-2">
                              {item.items?.map((subItem, subIndex) => (
                                <li key={subIndex}>
                                  <a
                                    href={subItem.href}
                                    className="block px-3 py-2 text-white/70 hover:text-white transition-colors"
                                    onClick={() => {
                                      // close mobile menu and reset dropdown
                                      setIsMobileMenuOpen(false);
                                      setActiveDropdown(null);
                                    }}
                                  >
                                    {subItem.label}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <a
                      key={item.id}
                      href={item.href}
                      className="text-white font-medium text-lg hover:text-white/90 transition-colors block py-2"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setActiveDropdown(null);
                      }}
                    >
                      {item.label}
                    </a>
                  )
                )}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleMobileMenu}
          />
        )}
      </AnimatePresence>
    </header>
  );
}
