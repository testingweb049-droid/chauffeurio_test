// src/utils/seoConfig.ts
export interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  schemaMarkup?: Record<string, any>;
}

export const seoConfig: Record<string, SEOProps> = {
  '/': {
    title: 'Chauffeurio | Premium Chauffeur Services in Valencia – Airport Transfers, Events & Tours',
    description: 'Experience luxury and comfort with Chauffeurio\'s chauffeur services in Valencia. Offering reliable airport transfers, hourly rides, event transport, and VIP tours. Book your ride 24/7 for business, leisure, and more.',
    canonicalUrl: 'https://chauffeurio.com/',
    schemaMarkup: {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Chauffeurio",
      "url": "https://chauffeurio.com/",
      "logo": "https://chauffeurio.com/logo.png",
      "description": "Reliable airport transfers and executive travel with comfort and style across Valencia and Spain. Expert chauffeurs, luxury vehicles, and bespoke transportation.",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "C/ Dama De Elche 26",
        "addressLocality": "Valencia",
        "postalCode": "46023",
        "addressCountry": "ES"
      },
      "telephone": "+34 910 123 456",
      "openingHours": "24/7",
      "areaServed": ["Valencia", "Alicante", "Spain"],
      "sameAs": [
        "https://facebook.com/",
        "https://instagram.com/",
        "https://twitter.com/"
      ],
      "review": {
        "@type": "Review",
        "author": "Nick Evans",
        "reviewBody": "Absolutely brilliant service! The driver arrived right on time, and the car was immaculate.",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        }
      }
    }
  },
  '/about': {
    title: 'About Chauffeurio | Executive Chauffeur Service & Company Profile Valencia',
    description: 'Learn about Chauffeurio\'s mission, vision, and expertise in premium chauffeur services. Discover our values, professional team, luxury fleet, and commitment to seamless travel in Valencia and beyond.',
    canonicalUrl: 'https://chauffeurio.com/about',
    schemaMarkup: {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "name": "About Chauffeurio",
      "url": "https://chauffeurio.com/about",
      "description": "Learn about Chauffeurio, our company values, our team, and our commitment to delivering executive transport services in Spain.",
      "publisher": {
        "@type": "Organization",
        "name": "Chauffeurio"
      }
    }
  },
  '/airport-transfer': {
    title: 'Airport Transfers Valencia | Meet & Greet, Fixed Rates | Chauffeurio',
    description: 'Enjoy stress-free airport transfers in Valencia with Chauffeurio. Meet & greet service, 24/7 availability, and transparent flat rates. Arrive on time with professional chauffeurs and a modern fleet.',
    canonicalUrl: 'https://chauffeurio.com/airport-transfer',
    schemaMarkup: {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": "Airport Transfer",
      "provider": {
        "@type": "LocalBusiness",
        "name": "Chauffeurio",
        "url": "https://chauffeurio.com/"
      },
      "areaServed": ["Valencia", "Spain"],
      "description": "Premium airport transfer services in Valencia. Meet-and-greet, 24/7 monitoring, professional chauffeurs, no hidden fees, and comfort for all travelers.",
      "offers": {
        "@type": "Offer",
        "priceCurrency": "EUR",
        "availability": "https://schema.org/InStock"
      }
    }
  },
  '/hourly-chauffeurs': {
    title: 'Hourly Chauffeur Services Valencia | Flexible Private Driver Hire | Chauffeurio',
    description: 'Book hourly chauffeur service in Valencia for total flexibility. Professional drivers, premium fleet, and customizable journeys—business or leisure. Reserve by the hour for your convenience.',
    canonicalUrl: 'https://chauffeurio.com/hourly-chauffeurs',
    schemaMarkup: {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": "Hourly Chauffeur Service",
      "provider": { "@type": "LocalBusiness", "name": "Chauffeurio", "url": "https://chauffeurio.com/" },
      "areaServed": ["Valencia", "Spain"],
      "description": "Book Chauffeurio by the hour in Valencia. Flexible, professional, and customizable private transportation for any occasion."
    }
  },
  '/event-transport': {
    title: 'Event Transport Valencia | Wedding, Corporate & Group Transfers | Chauffeurio',
    description: 'Arrive in style with Chauffeurio\'s event transport in Valencia. Perfect for weddings, business events, parties & groups. Reliable, on-time chauffeurs and luxury vehicles for every occasion.',
    canonicalUrl: 'https://chauffeurio.com/event-transport',
    schemaMarkup: {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": "Event Transportation",
      "provider": { "@type": "LocalBusiness", "name": "Chauffeurio", "url": "https://chauffeurio.com/" },
      "areaServed": ["Valencia", "Spain"],
      "description": "Chauffeur-driven transport for weddings, business events, and group travel. Luxury vehicles and reliable service for any occasion."
    }
  },
  '/tours-excursions': {
    title: 'Private Tours & Excursions Valencia | Custom City Sightseeing | Chauffeurio',
    description: 'Explore Valencia\'s top attractions with private chauffeured tours: personalized excursions, expert drivers, and premium vehicles for families, couples, and groups. Discover Spain in comfort and style.',
    canonicalUrl: 'https://chauffeurio.com/tours-excursions',
    schemaMarkup: {
      "@context": "https://schema.org",
      "@type": "TouristTrip",
      "name": "Chauffeurio Tours & Excursions",
      "url": "https://chauffeurio.com/tours-excursions",
      "description": "Private tours and sightseeing excursions in Valencia and Spain with luxury vehicles and expert local chauffeurs.",
      "provider": { "@type": "LocalBusiness", "name": "Chauffeurio" }
    }
  },
  '/city-to-city': {
    title: 'City-to-City Transfers Valencia | Intercity Chauffeur Service Spain | Chauffeurio',
    description: 'Travel city-to-city across Spain with Chauffeurio. Door-to-door chauffeur service, fixed pricing, and ultimate comfort for business or leisure journeys from Valencia and beyond.',
    canonicalUrl: 'https://chauffeurio.com/city-to-city',
    schemaMarkup: {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": "Intercity Chauffeur Transfers",
      "provider": { "@type": "LocalBusiness", "name": "Chauffeurio", "url": "https://chauffeurio.com/" },
      "areaServed": ["Valencia", "Alicante", "Spain"],
      "description": "City-to-city private transfers across Spain. Door-to-door service, safety, and comfort for business and leisure trips."
    }
  },
  '/business-chauffeur': {
    title: 'Business Chauffeur Valencia | Executive Transport & Corporate Travel | Chauffeurio',
    description: 'Executive chauffeur services for business travel in Valencia: professional, discreet, and punctual. Luxury cars, expert drivers—arrive prepared and on time for meetings & events.',
    canonicalUrl: 'https://chauffeurio.com/business-chauffeur',
    schemaMarkup: {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": "Business Chauffeur Service",
      "provider": { "@type": "LocalBusiness", "name": "Chauffeurio", "url": "https://chauffeurio.com/" },
      "areaServed": ["Valencia", "Spain"],
      "description": "Executive chauffeur services for busy professionals. Luxury vehicles, privacy, and punctuality for all your business travel needs."
    }
  },
  '/fleet': {
    title: 'Our Fleet | Luxury & Economy Chauffeur Vehicles Valencia | Chauffeurio',
    description: 'Browse Chauffeurio\'s premium fleet: luxury sedans, vans, and minibuses for every travel need in Valencia. Reliable vehicles, comfort, and versatility for hire.',
    canonicalUrl: 'https://chauffeurio.com/fleet',
    schemaMarkup: {
      "@context": "https://schema.org",
      "@type": "ProductCollection",
      "name": "Chauffeurio Fleet",
      "url": "https://chauffeurio.com/fleet",
      "description": "Explore the full fleet of Chauffeurio: luxury sedans, business vehicles, and minibuses for every kind of travel need in Valencia.",
      "brand": { "@type": "Brand", "name": "Chauffeurio" }
    }
  },
  '/contact': {
    title: 'Contact Chauffeurio | 24/7 Chauffeur Service Assistance Valencia',
    description: 'Contact Chauffeurio for bookings, inquiries, and support. 24/7 customer service for all your chauffeur, transfer, and travel needs in Valencia.',
    canonicalUrl: 'https://chauffeurio.com/contact',
    schemaMarkup: {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "Contact Chauffeurio",
      "url": "https://chauffeurio.com/contact",
      "description": "Get in touch with Chauffeurio for executive chauffeur bookings, travel inquiries, and support in Valencia.",
      "contactOption": ["Customer Service", "Reservation", "Support"]
    }
  },
  '/faqs': {
    title: 'FAQs | Chauffeurio – Chauffeur Service Questions & Booking Info',
    description: 'Find answers to common questions about Chauffeurio\'s chauffeur services, booking process, and policies. Quick help for your Valencia travel, transfers, and support.',
    canonicalUrl: 'https://chauffeurio.com/faqs'
  }
};

export const defaultSEO: SEOProps = {
  title: 'Chauffeurio | Premium Chauffeur Services in Valencia',
  description: 'Experience luxury chauffeur services in Valencia with Chauffeurio. Airport transfers, event transport, and executive travel.',
  canonicalUrl: 'https://chauffeurio.com'
};

export const getSEOConfig = (pathname: string): SEOProps => {
  return seoConfig[pathname] || defaultSEO;
};