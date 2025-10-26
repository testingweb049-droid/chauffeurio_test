'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { Check } from 'lucide-react';

interface OfferItem {
  id: number;
  icon: string;
  title: string;
  description: string;
}

const defaultOffers: OfferItem[] = [
  {
    id: 1,
    icon: '/minute.svg',
    title: '30 Minutes Free Wait Time',
    description: 'Enjoy a stress-free 30-minute grace period on all bookings.',
  },
  {
    id: 2,
    icon: '/free.svg',
    title: 'Free Cancellation Up to 48 Hours',
    description: 'Cancel up to 48 hours in advance at no charge.',
  },
  {
    id: 3,
    icon: '/flight.svg',
    title: 'Flight Tracking',
    description: "We track your flight to ensure on-time pickup, even with delays.",
  },
  {
    id: 4,
    icon: '/pilot.svg',
    title: 'Multilingual and Professional Chauffeurs',
    description: "Courteous chauffeurs fluent in multiple languages.",
  },
  {
    id: 5,
    icon: '/pricing.svg',
    title: 'Transparent Pricing',
    description: "No hidden fees—clear, upfront pricing always.",
  },
  {
    id: 6,
    icon: '/meet.svg',
    title: 'Meet and Greet',
    description: 'Your driver welcomes you inside with a name sign and assistance.',
  },
];

const hourlyChauffeurOffers: OfferItem[] = [
  {
    id: 1,
    icon: '/24-hours-support 1.svg',
    title: 'Customized Scheduling',
    description: 'Hire by the hour with total itinerary flexibility.',
  },
  {
    id: 2,
    icon: '/pilot.svg',
    title: 'Professional Multilingual Chauffeurs',
    description: 'Fluent, well-trained chauffeurs for international clients.',
  },
  {
    id: 3,
    icon: '/free.svg',
    title: 'Premium Amenities',
    description: 'Wi-Fi, water, tissues, and chargers in every ride.',
  },
  {
    id: 4,
    icon: '/hourglass 1.svg',
    title: 'Punctuality Guarantee',
    description: "We're always on time, with wait-and-return options.",
  },
  {
    id: 5,
    icon: '/pricing.svg',
    title: 'Transparent & Affordable Pricing',
    description: 'Clear hourly rates with no hidden charges.',
  },
  {
    id: 6,
    icon: '/car 1.svg',
    title: 'Eco-Friendly Fleet',
    description: 'Travel greener with hybrid and electric cars.',
  },
];

const chauffeurServicesOffers: OfferItem[] = [
  {
    id: 1,
    icon: '/chauffeur/seat 1.svg',
    title: 'Business-Class Comfort Every Journey',
    description: 'Luxurious interiors for stylish and relaxed travel.',
  },
  {
    id: 2,
    icon: '/chauffeur/electric-car 1.svg',
    title: 'Quiet, Spotless Vehicles for Productivity',
    description: 'Peaceful cabins ideal for work or rest.',
  },
  {
    id: 3,
    icon: '/chauffeur/customer-satisfaction (1) 1.svg',
    title: 'Expertise in VIP Transport',
    description: 'Discreet, elite service for high-profile clients.',
  },
  {
    id: 4,
    icon: '/chauffeur/privacy 1.svg',
    title: 'Privacy Glass and Professional Service',
    description: 'Tinted windows and respectful chauffeurs ensure privacy.',
  },
  {
    id: 5,
    icon: '/chauffeur/direct-debit 1.svg',
    title: 'Corporate Accounts with Direct Billing',
    description: 'Simplified billing for seamless business travel.',
  },
  {
    id: 6,
    icon: '/chauffeur/24-hours-support 1 (1).svg',
    title: '24/7 Availability for Flights and Meetings',
    description: 'Round-the-clock service, always on standby.',
  },
];

const eventWeddingOffers: OfferItem[] = [
  {
    id: 1,
    icon: '/event-wedding/car-wash.svg',
    title: 'Elegant Wedding Cars with Ribbons',
    description: 'Stylish cars with ribbons for your big day.',
  },
  {
    id: 2,
    icon: '/event-wedding/chauffeur.svg',
    title: 'Expert Chauffeurs for Special Occasions',
    description: 'Polished drivers trained for events and weddings.',
  },
  {
    id: 3,
    icon: '/event-wedding/red-carpet.svg',
    title: 'Red Carpet Arrival',
    description: 'Step out in style with our red carpet service.',
  },
  {
    id: 4,
    icon: '/event-wedding/guest.svg',
    title: 'Vehicles for Guests, Family, and VIPs',
    description: 'Comfortable rides for all your special guests.',
  },
  {
    id: 5,
    icon: '/event-wedding/all-inclusive.svg',
    title: 'Tailored Packages for Every Budget',
    description: 'Custom packages to suit your needs and budget.',
  },
  {
    id: 6,
    icon: '/event-wedding/champagne-glass.svg',
    title: 'Ideal for Parties, Proms, and Ceremonies',
    description: 'Make every celebration memorable with premium rides.',
  },
];

const cityToursOffers: OfferItem[] = [
  {
    id: 1,
    icon: '/city-tours/route.svg',
    title: 'Long-Distance Travel Across the UK',
    description: 'Explore the UK in comfort and style.',
  },
  {
    id: 2,
    icon: '/city-tours/pricing (1) 1.svg',
    title: 'Transparent Fixed Pricing',
    description: 'Know your cost upfront with no surprises.',
  },
  {
    id: 3,
    icon: '/city-tours/shield.svg',
    title: 'Safe, Timely, and Smooth Rides',
    description: 'Reliable, smooth journeys every time.',
  },
  {
    id: 4,
    icon: '/city-tours/success.svg',
    title: 'Perfect for Business or Leisure Travel',
    description: 'Great for meetings, getaways, or sightseeing.',
  },
  {
    id: 5,
    icon: '/city-tours/web.svg',
    title: 'Rest Stops on Your Terms',
    description: 'Pause anytime for food, photos, or views.',
  },
  {
    id: 6,
    icon: '/city-tours/people.svg',
    title: 'Comfort for Solo or Group Travel',
    description: 'Spacious vehicles for all group sizes.',
  },
];

const cityCenterOffers: OfferItem[] = [
  {
    id: 1,
    icon: '/city-center/visitor 1.svg',
    title: 'Perfect for Locals and Visitors',
    description: 'Seamless rides for everyday or special trips.',
  },
  {
    id: 2,
    icon: '/city-center/nightlife 1.svg',
    title: 'Nightlife, Dining, and Shopping Covered',
    description: 'Enjoy Manchester’s best spots in comfort.',
  },
  {
    id: 3,
    icon: '/city-center/shield.svg',
    title: 'Fast and Safe City Rides Anytime',
    description: 'Quick, secure rides through busy streets.',
  },
  {
    id: 4,
    icon: '/city-center/chauffeur.svg',
    title: 'Spotless Vehicles, Friendly Chauffeurs',
    description: 'Clean cars and friendly drivers every time.',
  },
  {
    id: 5,
    icon: '/city-center/processing 1.svg',
    title: 'Effortless Booking, Swift Service',
    description: 'Easy online booking and fast response.',
  },
  {
    id: 6,
    icon: '/city-center/hotspot 1.svg',
    title: 'Local Experts with Insider Knowledge',
    description: 'Chauffeurs who know all the local hotspots.',
  },
];

const stadiumTransferOffers: OfferItem[] = [
  {
    id: 1,
    icon: '/stadium/person 2.svg',
    title: 'Timely Pick-Up and Drop-Off at Major Venues',
    description: 'Always on time for games and concerts.',
  },
  {
    id: 2,
    icon: '/stadium/warning (1) 1.svg',
    title: 'Beat Traffic with Smart Routing',
    description: 'Avoid congestion with efficient routes.',
  },
  {
    id: 3,
    icon: '/stadium/clock (1) 1.svg',
    title: 'No Parking Hassles, No Delays',
    description: 'Get dropped at the door—no parking stress.',
  },
  {
    id: 4,
    icon: '/stadium/people 1.svg',
    title: 'Ideal for Families and Group Bookings',
    description: 'Travel together in comfort and style.',
  },
  {
    id: 5,
    icon: '/stadium/nightlife 2.svg',
    title: 'Pre- and Post-Event Convenience',
    description: 'We’ve got you covered before and after events.',
  },
  {
    id: 6,
    icon: '/stadium/customer-satisfaction (1) 1 (1).svg',
    title: 'VIP Hospitality Transfers',
    description: 'Luxury rides for premium ticket holders.',
  },
];


const Offer: React.FC = () => {
  const pathname = usePathname();

  const offers = useMemo(() => {
    if (pathname === '/services/hourly-chauffeur') return hourlyChauffeurOffers;
    if (pathname === '/services/chauffeur-services') return chauffeurServicesOffers;
    if (pathname === '/services/event-weddings') return eventWeddingOffers;
    if (pathname === '/services/city-tours') return cityToursOffers;
    if (pathname === '/services/city-center') return cityCenterOffers;
    if (pathname === '/services/stadium-transfer') return stadiumTransferOffers;
    return defaultOffers;
  }, [pathname]);


  return (
    <section className="pt-32 mt-32  max-w-7xl mx-auto">
      <Script
        type="application/ld+json"
        id="ok-taxis-offers-schema"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: offers.map((offer) => ({
              '@type': 'Question',
              name: offer.title,
              acceptedAnswer: {
                '@type': 'Answer',
                text: offer.description,
              },
            })),
          }),
        }}
      />
      <div className="mx-4 mb-12">
        <h2 className="text-4xl  md:text-5xl font-bold mb-4 md:mt-7 ">
          {pathname === '/liverpool' ? (
            <>Why Choose <span className="text-brand">OK Taxis</span> for Premier Travel</>
          ) : pathname === '/services/hourly-chauffeur' ? (
            <>Why Choose <span className="text-brand">OKTaxis</span> for Hourly Chauffeur Services in Manchester?</>
          ) : pathname === '/services/stadium-transfer' ? (
            <>Why Choose <span className="text-brand">OKTaxis</span> for Manchester Stadium Transfers and Events?</>
          ) : pathname === '/services/city-tours' ? (
            <>Why Choose <span className="text-brand">OKTaxis</span> for City Tours in Manchester?</>
          ) : pathname === '/services/event-weddings' ? (
            <>Why Choose <span className="text-brand">OKTaxis</span> for Weddings and Special Events in Manchester?</>
          ) : pathname === '/fleet' ? (
            <>What Do We Offer at <span className="text-brand">OKTaxis</span>?</>
          ) : pathname === '/services/airport-transfer' ? (
            <>Why Choose Our<span className="text-brand"> Manchester Airport </span>Chauffeur <span className="text-brand">Service?</span> </>
          ) : (
            <>Why Choose <span className="text-brand">OKTaxis</span> for Chauffeur Services in Manchester and Executive Travel?</>
          )}
        </h2>

        <p className="text-lg text-gray-700 max-w-3xl mt-4">
          {pathname === '/liverpool' ? (
            <div className="space-y-6 text-lg text-gray-700 max-w-3xl mt-4">
              <p>
                Selecting the ideal chauffeur service in <strong>Liverpool</strong> truly elevates your premier travel
                experience, and at <span className="text-brand">OK Taxis</span>, we excel with reliable luxury executive
                services centred on supreme comfort and style. Our professional chauffeurs bring vast experience and
                unwavering punctuality, ensuring effortless arrivals at every destination.
              </p>
              <p>
                We understand the pressures of business trips or special occasions, so our stress-free journeys allow you to
                unwind completely. As Viktor, the dedicated owner with years in the industry, I've witnessed how our excellence
                transforms ordinary rides into memorable ones. Operating from 0B Portway, Wythenshawe, Manchester, we're easily
                reachable at <strong className="text-brand">+44 7788 710290</strong> or <strong>info@oktaxis.co.uk</strong> for prompt assistance.
              </p>
            

              <div className="bg-gray-50 p-6 rounded-2xl shadow-sm">
                <div className="flex flex-col space-y-3">
                  {[
                    "Reliable chauffeurs for punctual pickups.",
                    "Luxury vehicles with comfort features.",
                    "Stress-free journeys tailored to your needs.",
                    "Professional service ensuring safety and discretion."
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start">
                      <span className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-brand text-white mt-1">
                        <Check className="h-4 w-4" />
                      </span>
                      <p className="text-gray-700">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : pathname === '/services/hourly-chauffeur' ? (
            "We elevate your chauffeur by the hour Manchester experience with features focused on flexibility and excellence. Here's what makes us stand out:"
          ) : pathname === '/services/stadium-transfer' ? (
            "Experience seamless and luxurious transport with OKTaxis’ chauffeur services for Manchester airport transfers and event venues. Here’s why we stand out:"
          ) : pathname === '/services/city-tours' ? (
            "Experience luxury and convenience with OKTaxis’ long-distance chauffeur services in Manchester. Perfect for airport transfers, city tours, and beyond, here’s what makes us exceptional:"
          ) : pathname === '/services/event-weddings' && (
            "Experience unparalleled luxury and reliability with OKTaxis’ chauffeur services in Manchester. Tailored for airport transfers, weddings, and special events, here’s what makes us stand out:"
          )}

        </p>

        {pathname === '/fleet' && (
          <>
            <h3 className="text-2xl font-semibold mt-8">
              Key Features of Our Premium Chauffeur Services
            </h3>
            <p className="text-lg text-gray-700 mt-2">
              We've designed our services to prioritize your comfort and peace of mind. Here's what sets OKTaxis apart:
            </p>
          </>
        )}
      </div>





      <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {offers.map(({ id, icon, title, description }) => (
          <div key={id} className="flex flex-col items-start space-x-4">
            <div className="flex-shrink-0 p-4">
              <Image
                src={icon}
                alt={`${title} icon`}
                width={80}
                height={80}
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{title}</h2>
              <p className="mt-2 text-gray-600 text-lg">{description}</p>
            </div>
          </div>
        ))}
      </div>


    </section>
  );
};

export default Offer;
