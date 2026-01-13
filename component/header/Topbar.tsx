import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { LanguageSelector } from './LanguageSelector'; // Import your LanguageSelector component
import { FaPhoneAlt, FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa'; // React Icons for social media and phone

const Topbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup the event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      className={`border-b border-gray-50 transition-all duration-300 ease-in-out ${scrolled ? 'bg-primary' : 'bg-transparent'}`}
    >
      {/* Left Section: Phone Number with Icon */}
      <div className="py-2 flex items-center justify-between max-w-5xl m-auto ">
          
          <a href="tel:+34614014277" className="text-white text-sm pt-1 flex items-center gap-3 hover:text-yellow-500 transition-colors">
            <FaPhoneAlt className="text-white text-md" />+34 614 014 277
          </a>

        {/* Center Section: Logo */}
        <div className="flex items-center justify-center">
         <a href="/">
         <Image
            src="/Chauffeurio Logo PNG.png" // Replace with your actual logo path
            alt="Chauffeur"
            width={120} // Adjust width according to your design
            height={60} // Adjust height according to your design
            className="h-12 md:h-16" // Responsive height
            priority
          /></a>
        </div>

        <div className="flex items-center space-x-6">
          <LanguageSelector />

          {/* Social Media Icons */}
          <div className="flex items-center space-x-4">
            <a
              href="https://facebook.com"
              className="text-white text-lg hover:text-yellow-500 transition-colors"
              aria-label="Facebook"
            >
              <FaFacebook />
            </a>
            <a
              href="https://instagram.com"
              className="text-white text-lg hover:text-yellow-500 transition-colors"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            {/* <a
              href="https://wa.me"
              className="text-white text-lg hover:text-yellow-500 transition-colors"
              aria-label="WhatsApp"
            >
              <FaWhatsapp />
            </a> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
