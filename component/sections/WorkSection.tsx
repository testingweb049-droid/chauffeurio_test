import { JSX } from 'react';

interface Step {
  title: string;
  description: string;
  icon: JSX.Element;
}

interface WorkSectionProps {
  heading: string;
  description?: string;
  steps: Step[];
}

export default function WorkSection({
  heading,
  description,
  steps,
}: WorkSectionProps) {
  return (
    <section className="relative bg-[#0a3d4f] text-white py-16 px-4 overflow-hidden">
      {/* Top Right Gradient */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-white/10 to-transparent rounded-full blur-3xl"></div>
      
      {/* Bottom Left Gradient */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-white/10 to-transparent rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="md:text-center text-left mb-16">
          <p className="text-yellow-400 text-sm uppercase tracking-wider mb-2">HOW WE WORK</p>
          <h2 className="text-4xl md:text-5xl font-bold">{heading}</h2>
          {description && (
            <p className="text-gray-300 mt-4 max-w-2xl mx-auto">{description}</p>
          )}
        </div>

        {/* Desktop View - Horizontal Layout */}
        <div className="hidden md:flex items-start justify-between mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start">
              {/* Step Content */}
              <div className="flex flex-col items-center text-center" style={{ width: '250px' }}>
                {/* Icon Box */}
                <div className="bg-yellow-400 rounded-lg p-5 mb-4 text-[#0a3d4f]">
                  {step.icon}
                </div>
                
                {/* Title */}
                <h3 className="text-lg font-semibold mb-3 min-h-[3rem] flex items-center">
                  {step.title}
                </h3>
                
                {/* Description */}
                <p className="text-sm text-gray-300 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Dotted Line Between Icons */}
              {index < steps.length - 1 && (
                <div className="flex items-start pt-[28px]">
                  <div className="border-t-2 border-dotted border-gray-400 w-12"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile View - Vertical Layout */}
        <div className="md:hidden flex flex-col items-center space-y-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              {/* Step Content */}
              <div className="flex flex-col items-center text-center max-w-xs">
                {/* Icon Box */}
                <div className="bg-yellow-400 rounded-lg p-5 mb-4 text-[#0a3d4f]">
                  {step.icon}
                </div>
                
                {/* Title */}
                <h3 className="text-lg font-semibold mb-3">
                  {step.title}
                </h3>
                
                {/* Description */}
                <p className="text-sm text-gray-300 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Dotted Line Between Steps - Vertical */}
              {index < steps.length - 1 && (
                <div className="flex justify-center my-4">
                  <div className="border-l-2 border-dotted border-gray-400 h-12"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}