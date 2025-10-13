import Image from 'next/image';
import { Mail, Phone, Facebook, Twitter, Globe, Instagram } from 'lucide-react';

export default function Footer() {
  const quickLinks = [
    { name: 'Home', href: '#' },
    { name: 'About Us', href: '#' },
    { name: 'Our Fleets', href: '#' },
    { name: 'Services', href: '#' },
    { name: 'Contact', href: '#' },
    { name: 'FAQs', href: '#' }
  ];

  const services = [
    { name: 'Airport Transfers', href: '#' },
    { name: 'Hourly Chauffeurs', href: '#' },
    { name: 'Event Transportation', href: '#' },
    { name: 'City Tours and Excursions', href: '#' },
    { name: 'Business Chauffeur Services', href: '#' },
    { name: 'Long-Distance City to City', href: '#' }
  ];

  const footerLinks = [
    { name: 'Terms and Conditions', href: '#' },
    { name: 'Legal Warning', href: '#' },
    { name: 'Privacy Policy', href: '#' },
    { name: 'Cookies Policy', href: '#' }
  ];

  const socialLinks = [
    { icon: <Facebook size={20} />, href: '#', label: 'Facebook' },
    { icon: <Twitter size={20} />, href: '#', label: 'Twitter' },
    { icon: <Globe size={20} />, href: '#', label: 'Website' },
    { icon: <Instagram size={20} />, href: '#', label: 'Instagram' }
  ];

  return (
    <footer className="bg-[#0a3d4f] text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Info */}
          <div className="space-y-4">
            <div className="">
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
            </div>
            <div className="space-y-2 text-gray-300 text-sm">
              <p>Valencia—</p>
              <p>Operating Hours: Mon–Sun, 24 Hours</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-yellow-400 transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              {services.map((service, index) => (
                <li key={index}>
                  <a
                    href={service.href}
                    className="text-gray-300 hover:text-yellow-400 transition-colors text-sm"
                  >
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Payment & Contact */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Payment Accepted</h3>
              <div className="flex gap-2">
                <div className="bg-white rounded px-2 py-1">
                  <span className="text-blue-600 font-bold text-xs">VISA</span>
                </div>
                <div className="bg-white rounded px-2 py-1">
                  <span className="text-orange-500 font-bold text-xs">MC</span>
                </div>
                <div className="bg-white rounded px-2 py-1">
                  <span className="text-blue-400 font-bold text-xs">AMEX</span>
                </div>
                <div className="bg-white rounded px-2 py-1">
                  <span className="text-blue-600 font-bold text-xs">PP</span>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <a
                href="mailto:info@Chauffeurio.com"
                className="flex items-center gap-2 text-gray-300 hover:text-yellow-400 transition-colors text-sm"
              >
                <Mail size={16} />
                <span>info@Chauffeurio.com</span>
              </a>
              <a
                href="tel:+34614014277"
                className="flex items-center gap-2 text-gray-300 hover:text-yellow-400 transition-colors text-sm"
              >
                <Phone size={16} />
                <span>+34 614 014 277</span>
              </a>
            </div>

            {/* Social Links */}
            <div className="flex gap-2">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="bg-yellow-400 text-[#0a3d4f] rounded-lg p-2 hover:bg-yellow-500 transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>© 2025. All rights reserved.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              {footerLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="hover:text-yellow-400 transition-colors"
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