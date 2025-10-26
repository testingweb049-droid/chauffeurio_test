import heroImg from "@/assets/homeImages/hero-img.jpg";
import vec1 from "@/assets/homeImages/vec1.jpg";
import vec2 from "@/assets/homeImages/vec2.jpg";
import vec3 from "@/assets/homeImages/vec3.jpg";
import vec4 from "@/assets/homeImages/vec4.jpg";
import FleetBg from "@/assets/bmw-city.jpeg";
import { Facebook, Linkedin, Twitter, Youtube, Instagram, MapPin, Phone, Mail } from "lucide-react";

// Vehicles...
import BMW from "@/assets/vehicles/bmw.jpg";
import MERC from "@/assets/vehicles/merc.jpg";
import Skoda from "@/assets/vehicles/skoda.jpg";
import Tesla from "@/assets/vehicles/tesla.jpg";
import Toyota from "@/assets/vehicles/toyota.jpeg";
import XLVAN from "@/assets/vehicles/xlvan.jpg";

// Vehicles for services section...
import Img1 from "@/assets/homeImages/img1.jpeg";
import Img2 from "@/assets/homeImages/img2.jpg";
import Img3 from "@/assets/homeImages/img3.jpg";
import Img4 from "@/assets/homeImages/img4.webp";
import Img5 from "@/assets/homeImages/img5.jpg";
import Img6 from "@/assets/homeImages/img6.jpg";

// About us page...
import BgImg from "@/assets/bmw.png"
import TeslaImg from "@/assets/homeImages/about-us-tesla.webp"

// Why Choose us images...
import { Headset, Clock2, Blend, UserRound, Rocket , Car} from 'lucide-react';


const homePageData = {
  // Hero Section...
  heroSection: {
    heading: "Welcome to Spotlimo",
    subheading: "Your premium transportation solution",
    description:
      "Experience the comfort and luxury of Spotlimo's top-tier services for all your travel needs. Whether it's an airport transfer, point-to-point, or hourly charter, we've got you covered.",
    backgroundImage: heroImg,
    ctaButton: {
      text: "Book Now",
      link: "/booking",
    },
  },

  // Trip Working Section...
  tripWorking: {
    title: "Why Choose Ok Taxis?",
    description: "For those who expect nothing short of perfection in their journey experience, Ok Taxis Chauffeur Service Manchester sets the standard. Here’s why we remain the preferred choice for luxury transport.",
    contents: [
      {
        title: "24/7 Customer Service",
        description:
          "In a city that never sleeps, neither do we. Our support team is always at your service, available to answer queries and manage bookings with expert precision, day or night.",
        backgroundImage: vec1,
      },
      {
        title: "60-Minute Free Waiting Time",
        description:
          "Time is invaluable, and we honor yours by allowing a generous 60-minute waiting period for airport collections. This ensures a stress-free experience, even when flights are delayed, or unforeseen circumstances arise.",
        backgroundImage: vec2,
      },
      {
        title: "Confidentiality Assurance",
        description:
          "Discipline is paramount for high-profile clients and those who value their privacy. We uphold the highest standards of confidentiality so that your personal and professional matters remain entirely private.",
        backgroundImage: vec3,
      },
      {
        title: "Professionally Trained Chauffeurs",
        description:
          "Our chauffeurs deliver a perfect balance of sophistication and reliability. They precisely navigate Manchester streets, offering first-class service in luxurious Mercedes chauffeur cars, ensuring every journey meets the highest standards.",
        backgroundImage: vec4,
      },
    ],
  },

  // Services Section...
servicesSection: {
  title: "Our Services",
  description: "Explore our diverse range of top-notch transportation services, designed to provide comfort, reliability, and luxury for every occasion.",
  services: [
    {
      title: "Airport Transportation",
      image: Img1,
      description: "Experience seamless and punctual airport transfers, ensuring you reach your destination on time and in style. Our service eliminates travel stress and offers unmatched reliability.",
    },
    {
      title: "Chauffeur Services",
      image: Img2,
      description: "Enjoy the ultimate in luxury and convenience with our professional chauffeurs, committed to providing a smooth and comfortable ride for any occasion.",
    },
    {
      title: "Hourly Executive Transportation",
      image: Img3,
      description: "Perfect for business professionals, our flexible hourly transportation service caters to your schedule, offering convenience, privacy, and efficiency throughout your journey.",
    },
    {
      title: "Wedding Limo Services",
      image: Img4,
      description: "Add a touch of elegance to your big day with our luxurious wedding limo services, ensuring a memorable and grand entrance for your special moments.",
    },
    {
      title: "Interview Service",
      image: Img5,
      description: "Arrive at your interview prepared and composed with our reliable and professional transportation service, tailored to help you make a lasting impression.",
    },
    {
      title: "Corporate Limo Transportation",
      image: Img6,
      description: "Elevate your corporate image with our premium limo transportation, designed to impress clients and partners while providing a sophisticated and comfortable travel experience.",
    },
  ],
},


  // Fleets Page...
  ourFleets: {
    serviceName: "OkTaxis",
    title: "Our Fleets",
    bgImg: FleetBg, // Ensure this is the correct import for your background image
    fleet: [
      { name: "Skoda Superb", image: Skoda, class: 'economy' },
      { name: "Toyota Prius", image: Toyota, class: 'economy' },
      { name: "BMW 5 Series", image: BMW, class: 'executive' },
      { name: "Mercedes Benz E-Class", image: MERC, class: 'executive' },
      { name: "Tesla Model S", image: Tesla, class: 'executive_premium' },
      { name: "XL Van", image: XLVAN, class: 'passenger_van' },
    ]
  },

// About Page...
aboutContent: {
  bgImg: BgImg,
  contentImg: TeslaImg,
  title: "About Us",
  whoWeAre: `
    Manchester Airport Taxis (oktaxis.co.uk) began operations in 2018 with 
    the mission to provide competitive and reliable taxi and minibus transfer 
    services for both Manchester and Liverpool John Lennon airports. 
    What started as a small operation with just three drivers has rapidly 
    expanded, thanks to our dedication to offering high-quality service, 
    low-cost fares, and a modern fleet of vehicles.
  `,
  additionalInfo: `
    We take immense pride in delivering exceptional taxi airport transfer 
    services, available day and night, with no surcharges during the night 
    hours. Whether you're a private customer or a business traveler, our 
    fully trained and CRB-approved drivers ensure your journey is smooth, 
    safe, and stress-free.
  `,
  contactDetails: {
    address: "Bailey Lane, Airport, Wythenshawe, Manchester M90 4AN",
    email: "info@oktaxis.co.uk",
    phone: "07788710290",
    whatsapp: "447342193341",
  },
},


  // Testimonials Section
  testimonialsSection: {
    title: "What Our Clients Say",
    testimonials: [
      {
        name: "John Doe",
        feedback:
          "Spotlimo provided an exceptional service for my business trip. Highly recommended!",
        image: "/images/testimonial1.jpg",
      },
      {
        name: "Jane Smith",
        feedback:
          "Comfortable and reliable service. I'll definitely book again!",
        image: "/images/testimonial2.jpg",
      },
    ],
  },

  // Contact Section
  contactFormSection: {
    title: "Contact Us",
    subtitle: "Get in Touch with OkTaxis",
    description: "Whether you're arranging a trip to Manchester or planning travel for a unique occasion, we’re here to assist. Our team guarantees a smooth and luxurious journey customized to your preferences.",
  },

  // Footer...
  footer: {
    title: "OkTaxis",
    description:
      "We take pride in offering premium services, including convenient pick-up and drop-off to your desired destination. Experience safe and luxurious travel with our top-tier chauffeur-driven cars, serving the entire Manchester area.",
    socialLinks: [
      { icon: Facebook, href: "https://www.facebook.com/share/1AoLuwA75A/?mibextid=LQQJ4d", label: "Facebook" },
      // { icon: Linkedin, href: "#", label: "LinkedIn" },
      // { icon: Twitter, href: "#", label: "Twitter" },
      // { icon: Youtube, href: "#", label: "YouTube" },
      { icon: Instagram, href: "https://www.instagram.com/ok_taxis?igsh=MWV2aDJmc3FuYWVxNA==", label: "Instagram" },
    ],
    quickLinks: [
      { href: "/", label: "Home" },
      { href: "/about", label: "About" },
      { href: "/fleet", label: "Fleets" },
      { href: "/driver", label: "Driver" },
      { href: "/contact", label: "Contact" },
    ],
    contact: {
      address: "Bailey Lane, Airport, Wythenshawe",
      phone: "07788710290",
      email: "info@oktaxis.co.uk",
    },
  },
};

const okTaxisContent = {
  heading: "Reliable Manchester Airport Transfers – OkTaxis",
  description: `
    Travel hassle-free with OkTaxis, your trusted partner for Manchester Airport transfers. We provide punctual, affordable, and professional services tailored to your needs, ensuring comfort and convenience every step of the way.
  `,
  reasons: [
    {
      title: "Transparent Fixed Pricing",
      details: `
        No hidden charges, just competitive fixed rates.
        Know your fare upfront for stress-free budgeting.
      `,
      icon: Blend,
    },
    {
      title: "24/7 Availability",
      details: `
        Round-the-clock service to match your flight schedule.
        Reliable transfers for early departures or late-night arrivals.
      `,
      icon: Clock2,
    },
    {
      title: "Experienced, Friendly Drivers",
      details: `
        Professional drivers with extensive route knowledge.
        Committed to your safety and comfort.
      `,
      icon: UserRound,
    },
    {
      title: "Exclusive Meet-and-Greet Service",
      details: `
        Personalized welcome at the arrivals hall.
        Assistance with luggage for seamless onward travel.
      `,
      icon: Headset,
    },
    {
      title: "Easy Booking System",
      details: `
        Simple online reservations with instant confirmation.
        Dedicated support for inquiries or special requests.
      `,
      icon: Rocket,
    },
    {
      title: "Flexible Travel Options",
      details: `
        Choose from a range of vehicle types to suit your group size.
        Tailored services for business and leisure travel alike.
      `,
      icon: Car,
    },
  ],

  footer: `
    Choose OkTaxis for a smooth Manchester Airport transfer. Experience fixed pricing, reliable service, and top-notch comfort.
    Book now and enjoy stress-free travel.
  `,
};

const faqData = [
  {
    question: "What is the cost of a taxi from Manchester Airport to Heathrow Airport?",
    answer: "The fare for a taxi from Manchester Airport to Heathrow Airport starts at £300. This price includes all charges, such as airport pick-up and drop-off fees. There are no hidden costs."
  },
  {
    question: "What is the cost of a taxi from Manchester Airport to Stansted Airport?",
    answer: "The taxi fare from Manchester Airport to Stansted Airport begins at £313, with all airport-related fees included in the price. No additional charges apply."
  },
  {
    question: "What is the cost of a taxi from Manchester Airport to Gatwick Airport?",
    answer: "A taxi ride from Manchester Airport to Gatwick Airport starts at £353. This rate covers all expenses, including pick-up and drop-off fees at the airport."
  },
  {
    question: "What is the cost of a taxi from Manchester Airport to Central London?",
    answer: "The fare for a taxi from Manchester Airport to Central London starts at £357. There are no additional charges; the fare includes airport-related fees."
  },
  {
    question: "Are there additional charges for late arrivals?",
    answer: "For airport collections, passengers are given a maximum of 45 minutes from the flight's actual landing time to meet their driver. After this period, a waiting time fee of £20 per hour (calculated on a pro-rata basis) is applied. To avoid issues, passengers should account for possible delays, such as immigration processing, and request a later pick-up time if necessary.\n\nImportant Notes:\n- Passengers will not be compensated if they are ready earlier than scheduled and need to wait for the driver.\n- No refunds will be issued to passengers who leave without waiting for their driver and arrange alternate transportation."
  },
  {
    question: "What is the cancellation policy?",
    answer: "Cancellations are fully refundable if notice is given at least 5 hours before the scheduled pick-up time. Cancellations must be made online or via email, with confirmation received from the company. If no confirmation is received, passengers should contact customer service. Refunds are not issued in the following situations:\n- Passengers fail to show up for pre-paid bookings.\n- Cancellations made less than 5 hours before pick-up time."
  },
  {
    question: "Do you offer child car seats?",
    answer: "Child car seats are provided as a complimentary service but cannot be guaranteed for availability or suitability. Passengers are responsible for their usage. According to UK law, children can travel without a car seat in taxis if one is not provided, but only if seated in the rear."
  },
  {
    question: "What is the Meet & Greet service?",
    answer: "This service helps reduce stress by having your driver meet you in the airport arrivals area, holding a sign with your name to welcome you."
  },
  {
    question: "How can I locate my driver at the airport?",
    answer: "Airports usually have designated pick-up and drop-off zones with clear signage. Additionally, the driver will contact you upon your arrival to guide you to the pick-up location."
  },
  {
    question: "Is there a waiting time fee at the airport?",
    answer: "A complimentary 20-minute waiting period is offered in case of flight delays. After this time, a waiting fee of £20 per hour is applied, calculated on a pro-rata basis."
  }
];



export { homePageData, okTaxisContent, faqData };