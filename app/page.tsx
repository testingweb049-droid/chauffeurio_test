import FaqsCard from "@/component/card/FaqsCards";
import HeroSection from "@/component/sections/HeroSection";
import Testimonials from "@/component/sections/Testimonials";
import TopDestination from "@/component/sections/TopDestination";
import Vission from "@/component/sections/VisionSection";

export default function Home(){
      const faqsData = [
  {
    id: 1,
    question: "What time details do I need to provide when booking?",
    answer:
      "When booking, please provide your flight details, including the arrival time and terminal. This will ensure your chauffeur can track the flight and be ready when you arrive.",
  },
  {
    id: 2,
    question: "Is it possible to book a return transfer?",
    answer:
      "Yes, we offer both one-way and return transfers. You can book a return transfer when making your initial booking or at a later time.",
  },
  {
    id: 3,
    question: "Can I request specific vehicle types?",
    answer:
      "Absolutely! We have a range of vehicles available to suit your needs. You can request a specific vehicle type when making the booking, or you can inquire with our customer service team for more details.",
  },
];
  return(
    <>
    <HeroSection/>
    <Testimonials/>
    <TopDestination/>


<FaqsCard faqs={faqsData} />
<Vission/>

    </>
  )
}