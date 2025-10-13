import Image from "next/image";

interface ImageDetailSectionProps {
  title: string;
  subtitle: string;
  description: string;
  imageSrc: string;
}

export default function ImageDetailSection({
  title,
  subtitle,
  description,
  imageSrc,
}: ImageDetailSectionProps) {
  return (
    <div className="max-w-7xl mx-auto relative md:py-14 py-4 bg-primary md:bg-transparent">
      <div className="flex flex-col md:flex-row items-center ">
        {/* Left Section: Content */}
        <div className="w-full md:w-1/2 bg-primary md:pr-20 p-4 md:p-12 flex flex-col gap-3 relative z-10">
          <h4 className="text-secondary font-semibold uppercase ">{title}</h4>
          <h1 className="leading-12 text-white ">{subtitle}</h1>
          <p className="mt-4 text-[#B2AEA8] leading-relaxed">{description}</p>
        </div>

        {/* Right Section: Image - Overlapping left section */}
        <div className="w-full md:w-1/2 relative z-20 mt-0 md:mt-0 md:-ml-16 p-4">
          <div className="h-[40vh] md:h-[55vh] w-full">
            <Image
              src={imageSrc}
              alt="Image description"
              width={600}
              height={500}
              className="object-cover w-full h-full "
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}