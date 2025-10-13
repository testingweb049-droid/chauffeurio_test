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
    <section className="bg-gray-50 py-16 px-4">
      <div className="max-w-7xl mx-auto space-y-24">
        {sections.map((section, index) => (
          <div
            key={index}
            className={`flex flex-col md:flex-row items-center gap-8 md:gap-12 ${
              section.imagePosition === 'left' ? 'md:flex-row-reverse' : ''
            }`}
          >
            {/* Text Content */}
            <div className="flex-1 space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
                {section.title}
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                {section.description}
              </p>
            </div>

            {/* Image */}
            <div className="flex-1 relative h-[400px] w-full">
              <Image
                src={section.image}
                alt={section.title}
                height={500}
                width={500}
                className="object-cover rounded-lg shadow-lg"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
