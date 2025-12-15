'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';

export interface ServiceCard {
  icon: ReactNode;
  title: string;
  description: string;
}

interface ServiceCardsSectionProps {
  cards: ReadonlyArray<ServiceCard>;
}

export default function ServiceCardsSection({
  cards,
}: ServiceCardsSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (cards.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % cards.length;
        
        // Scroll to the next card
        if (scrollContainerRef.current) {
          const container = scrollContainerRef.current;
          const firstCard = container.querySelector('.mobile-card') as HTMLElement;
          if (firstCard) {
            const cardWidth = firstCard.offsetWidth;
            const gap = 16; // 1rem = 16px
            container.scrollTo({
              left: nextIndex * (cardWidth + gap),
              behavior: 'smooth',
            });
          }
        }
        
        return nextIndex;
      });
    }, 3000); // Auto-slide every 3 seconds

    return () => clearInterval(interval);
  }, [cards.length]);

  return (
    <section className="w-full bg-white text-[#171717]">
      <div className="container mx-auto md:py-16 py-6 px-4">
        {/* Desktop: Grid Layout */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-4 gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-[#F9F9F9] border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 cursor-pointer"
            >
              <div className="flex flex-col items-left text-left">
                <div className="flex-shrink-0  mb-4 w-fit">
                  <div className="text-primary">
                    {card.icon}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h6 className="font-bold text-[#171717] text-base mb-2">
                    {card.title}
                  </h6>
                  <p className="text-[#5F5D5A] text-xs leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: Horizontal Slider */}
        <div 
          ref={scrollContainerRef}
          className="md:hidden flex overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="flex gap-4 min-w-max">
            {cards.map((card, index) => (
              <div
                key={index}
                className="mobile-card flex-shrink-0 w-[calc(100vw-2rem)] max-w-sm bg-[#F9F9F9] border border-gray-200 rounded-2xl p-6 shadow-sm hover:scale-105 transition-transform duration-200 cursor-pointer snap-center"
              >
                <div className="flex flex-col items-left text-left">
                  <div className="flex-shrink-0 mb-4 w-fit">
                    <div className="text-[#D5B753]">
                      {card.icon}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#171717] text-sm mb-2">
                      {card.title}
                    </p>
                    <p className="text-[#5F5D5A] text-xs leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
