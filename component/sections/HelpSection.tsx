import { FaAnchor } from 'react-icons/fa';

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
  return (
    <section className="max-w-7xl mx-auto md:py-16 py-6 px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="w-full flex flex-col justify-start md:gap-8 gap-4">
          {subtitle ? <h4 className="text-secondary">{subtitle}</h4> : null}
          <h1 className="md:leading-12">{heading}</h1>
          <p className="text-[#5F5D5A]">{description}</p>
        </div>

        <div className="w-full">
          <div className="flex flex-col gap-6">
            {points.map((point, index) => (
              <div key={index} className="flex items-start md:space-x-12 space-x-4">
                <div className="p-3 bg-secondary text-primary rounded-full">
                  <FaAnchor size={24} />
                </div>
                <div>
                  <h3 className="">{point.title}</h3>
                  <p className="text-[#5F5D5A] mt-2">{point.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
