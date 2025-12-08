'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ContentSectionProps {
  sections: {
    title: string;
    description: string;
    image: string;
    imagePosition: 'left' | 'right';
  }[];
}

export default function ContentSection({ sections }: ContentSectionProps) {
  const [expandedSections, setExpandedSections] = useState<number[]>([]);

  const toggleSection = (index: number) => {
    setExpandedSections(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <section className="bg-gray-50 md:py-16 py-4 px-4">
      <div className="max-w-7xl mx-auto md:space-y-12 space-y-6">
        {sections.map((section, index) => (
          <div
            key={index}
            className={`flex flex-col md:flex-row items-start md:items-stretch gap-4 md:gap-16 ${
              section.imagePosition === 'left' ? 'md:flex-row-reverse' : ''
            }`}
          >
            {/* Text */}
            <div className="w-full md:flex-1 space-y-6 py-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
                {section.title}
              </h1>
              <div className="relative">
                {/* Mobile: With Read More/Less */}
                <div className="md:hidden">
                  <p className={`text-[#5F5D5A] leading-relaxed text-lg ${expandedSections.includes(index) ? '' : 'line-clamp-3'}`}>
                    {section.description}
                  </p>
                  <button
                    onClick={() => toggleSection(index)}
                    className="mt-3 text-secondary text-sm font-semibold hover:text-yellow-400 transition-colors"
                  >
                    {expandedSections.includes(index) ? 'Read Less' : 'Read More'}
                  </button>
                </div>
                
                {/* Desktop: Full description always visible */}
                <p className="hidden md:block text-[#5F5D5A] leading-relaxed text-lg">
                  {section.description}
                </p>
              </div>
            </div>

            {/* Image */}
            <div className="w-full md:flex-1">
              {/* On mobile: fixed height; on desktop: stretch to text height */}
              <div className="relative h-64 md:h-full w-full overflow-hidden">
                <Image
                  src={section.image}
                  alt={section.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={index === 0}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx global>{`
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
}