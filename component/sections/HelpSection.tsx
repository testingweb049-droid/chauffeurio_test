import { FaAnchor } from 'react-icons/fa'; // Icon library for anchor icon

interface HelpSectionProps {
  heading: string;
  description: string;
  points: { title: string; description: string }[];
}

export default function HelpSection({
  heading,
  description,
  points,
}: HelpSectionProps) {
  return (
    <section className="max-w-7xl mx-auto md:py-16 py-6 px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 ">
        <div className="w-full flex flex-col justify-center gap-4">
            <h4 className='text-secondary'>Sub title</h4>
          <h1 className="md:leading-12">{heading}</h1>
          <p className="text-[#5F5D5A]">{description}</p>
        </div>

        {/* Right Section: Points List */}
        <div className="w-full">
          <div className="flex flex-col gap-6">
            {points.map((point, index) => (
              <div key={index} className="flex items-start md:space-x-12 space-x-4">
                {/* Icon */}
                <div className="p-3 bg-secondary text-primary rounded-full">
                  <FaAnchor size={24} />
                </div>
                
                {/* Point Content */}
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
