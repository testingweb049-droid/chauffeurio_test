import Image from 'next/image';

interface ContentSectionProps {
  sections: {
    title: string;
    description: string;
    image: string;
    imagePosition: 'left' | 'right';
  }[];
}

export default function ContentSection({ sections }: ContentSectionProps) {
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
              <p className="text-[#5F5D5A] leading-relaxed text-lg">
                {section.description}
              </p>
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
    </section>
  );
}
