import Image from "next/image";

interface BlogCardProps {
  title: string;
  description: string;
  image: string;
  date?: string;
  author?: string;
  category?: string;
}

export default function BlogCard({ 
  title, 
  description, 
  image,
  date = "May 20, 2025",
  author = "MyChauffeur",
  category = "Tennis"
}: BlogCardProps) {
  return (
    <div className="rounded-lg shadow-lg overflow-hidden bg-white transition-transform hover:shadow-xl hover:-translate-y-1 duration-300 max-w-md h-full flex flex-col">
      {/* Image Section */}
      <div className="relative overflow-hidden group aspect-[4/3]">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <span className="text-white font-medium">Read more →</span>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-3 gap-2">
          <h3 className="text-xl underline font-bold text-gray-800 line-clamp-2 min-h-[3.5rem]">
            {title}
          </h3>
          <p className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded whitespace-nowrap flex-shrink-0">
            {date}
          </p>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-4 flex-1">
          {description}
        </p>

        {/* Footer */}
        <div className="flex justify-between items-center border-t pt-4">
          <span className="text-sm font-medium text-blue-600 truncate max-w-[50%]">
            {author}
          </span>
          <span className="text-xs uppercase tracking-wider font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded truncate max-w-[40%]">
            {category}
          </span>
        </div>
      </div>
    </div>
  );
}