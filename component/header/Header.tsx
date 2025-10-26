'use client';

import { useState, useEffect, useRef } from "react";
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
  isDropdown?: never; // Prevents dropdown items from having href
  items?: never; // Prevents dropdown items from having sub-items
}

interface NavItemWithDropdown extends NavItemBase {
  isDropdown: true;
  href?: any; // Prevents the top-level dropdown item from having href
  items: { label: string; href: string }[]; // Sub-items for the dropdown
}

type NavItem = NavItemWithHref | NavItemWithDropdown;

export default function Header() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const { header }= ClientSideStrings(); // Fetch translations for the current language

  const handleDropdownToggle = (id: string) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const handleMouseEnter = (id: string) => {
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      setActiveDropdown(id);
    }
  };

  const handleMouseLeave = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      setActiveDropdown(null);
    }
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen((s) => !s);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Define routes that should always have primary background
  const routesWithPrimaryBg = ['/book-ride', '/terms-condition'];
  
  // Set background class: primary for specific routes, otherwise based on scroll
  const bgClass = routesWithPrimaryBg.includes(pathname || '') 
    ? "bg-primary" 
    : (isScrolled ? "bg-primary" : "bg-transparent");

  const navItems: NavItem[] = [
    { id: "home", label: header?.home || "Home", href: "/" },
    { id: "about", label: header?.about || "About Us", href: "/about" },
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
        { label: header?.fleetItems?.businessChauffur || "Business Chauffur", href: "/business-chauffur" },
      ],
    },
    { id: "fleet", label: header?.fleet || "Our Fleet", href: "/fleet" },
    { id: "contact", label: header?.contact || "Contact", href: "/contact" },
  ];

  const isActive = (path: string) => pathname && pathname === path;

  return (
    <header className={`fixed left-0 right-0 top-0 z-50 border-b border-gray-400 ${bgClass}`}>
      <div className="hidden md:block">
        <Topbar />
      </div>

      <div className={`transition-colors duration-300 m-auto max-w-5xl`}>
        <div className="container mx-auto">
          <div className="flex items-start justify-between md:hidden">
            <a href="/" aria-label="Home" className="flex items-center">
              <Image
                src="/logo.png"
                alt="Company Logo"
                width={120}
                height={60}
                className="h-10 w-auto"
                priority
              />
            </a>

            <div className="flex items-center gap-1 py-2">
              {/* <a
                href="https://instagram.com/yourhandle"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-white/90 hover:text-white transition"
              >
                <FaInstagram size={22} />
              </a> */}

              <button onClick={toggleMobileMenu} className="text-white p-2" >
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
                  <div
                    key={item.id}
                    className="relative"
                    onMouseEnter={() => handleMouseEnter(item.id)}
                    onMouseLeave={handleMouseLeave}
                    ref={dropdownRef}
                  >
                    <button
                      onClick={() => handleDropdownToggle(item.id)}
                      className={`text-md font-normal py-2 transition-colors flex items-center ${isActive(item.href) ? 'border-b-2 border-secondary text-secondary' : 'text-white hover:text-white/90'}`}
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
                          className="absolute top-full left-1/2 -translate-x-1/2 bg-white shadow-lg rounded-md mt-2 p-2 min-w-[320px] z-10 text-secondary"
                          variants={dropdownVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
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
                    className={`text-white hover:text-white/90 transition-colors py-4 text-md font-normal ${isActive(item.href) ? 'border-b-2 border-secondary text-secondary' : ''}`}
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
                {/* <span className="text-white/80 text-sm">{mobileMenu?.menu || "Menu"}</span> */}
                <button onClick={toggleMobileMenu} className="text-white p-2" >
                  <HiOutlineX size={24} />
                </button>
              </div>

              <nav className="flex-1">
                {navItems.map((item) =>
                  item.isDropdown ? (
                    <div key={item.id} className="relative mb-4">
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
                          >
                            <ul className="space-y-2 py-2">
                              {item.items?.map((subItem, subIndex) => (
                                <li key={subIndex}>
                                  <a
                                    href={subItem.href}
                                    className="block px-3 py-2 text-white/70 hover:text-white transition-colors"
                                    onClick={toggleMobileMenu}
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
                      onClick={toggleMobileMenu}
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