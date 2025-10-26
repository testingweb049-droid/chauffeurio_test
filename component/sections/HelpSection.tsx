'use client';

import { FaAnchor } from 'react-icons/fa';
import { useState } from 'react';

interface HelpPoint {
  title: string;
  description: string;
}

interface HelpSectionProps {
  heading: string;
  description: string;
  subtitle?: string;
  points: ReadonlyArray<HelpPoint>;
}

export default function HelpSection({
  heading,
  description,
  subtitle,
  points,
}: HelpSectionProps) {
  const [isMainExpanded, setIsMainExpanded] = useState(false);
  const [expandedPoints, setExpandedPoints] = useState<number[]>([]);

  const togglePoint = (index: number) => {
    setExpandedPoints(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <section className="max-w-7xl mx-auto md:py-16 py-6 px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="w-full flex flex-col justify-start md:gap-8 gap-4">
          {subtitle ? <h4 className="text-secondary">{subtitle}</h4> : null}
          <h1 className="md:leading-12">{heading}</h1>
          
          {/* Main Description with Read More - Mobile Only */}
          <div className="relative">
            {/* Mobile: With Read More/Less */}
            <div className="sm:hidden">
              <p className={`text-[#5F5D5A] ${isMainExpanded ? '' : 'line-clamp-3'}`}>
                {description}
              </p>
              <button
                onClick={() => setIsMainExpanded(!isMainExpanded)}
                className="mt-2 text-secondary text-sm font-semibold hover:text-yellow-400 transition-colors"
              >
                {isMainExpanded ? 'Read Less' : 'Read More'}
              </button>
            </div>
            
            {/* Desktop: Full description always visible */}
            <p className="hidden sm:block text-[#5F5D5A]">
              {description}
            </p>
          </div>
        </div>

        {/* Mobile: Horizontal Scroll, Desktop: Normal Grid */}
        <div className="w-full">
          {/* Desktop View - Full descriptions always visible */}
          <div className="hidden sm:flex flex-col gap-6">
            {points.map((point, index) => (
              <div key={index} className="flex items-start md:space-x-12 space-x-4">
                <div className="p-3 bg-secondary text-primary rounded-full">
                  <FaAnchor size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold">{point.title}</h3>
                  <p className="text-[#5F5D5A] mt-2">
                    {point.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile: Horizontal Scroll View with Read More */}
          <div className="sm:hidden flex overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
            <div className="flex gap-4 min-w-max">
              {points.map((point, index) => (
                <div 
                  key={index} 
                  className="flex-shrink-0 w-64 bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                >
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-secondary text-primary rounded-full flex-shrink-0">
                      <FaAnchor size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-sm truncate">{point.title}</h3>
                      <div className="relative">
                        <p className={`text-[#5F5D5A] text-xs mt-1 ${expandedPoints.includes(index) ? '' : 'line-clamp-3'}`}>
                          {point.description}
                        </p>
                        <button
                          onClick={() => togglePoint(index)}
                          className="mt-1 text-secondary text-xs font-semibold hover:text-yellow-400 transition-colors"
                        >
                          {expandedPoints.includes(index) ? 'Read Less' : 'Read More'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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