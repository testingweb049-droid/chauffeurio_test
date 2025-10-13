'use client';

import { useState } from "react";
import { Plus } from "lucide-react"; // Use the Plus icon from lucide-react for the expand icon

interface Faq {
  id: number;
  question: string;
  answer: string;
}

interface FaqsCardProps {
  faqs: Faq[]; // This will accept an array of FAQ objects
}

export default function FaqsCard({ faqs }: FaqsCardProps) {
  // State to manage the expanded FAQ
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpanded = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index); // Toggle the state
  };

  return (
    <div className="space-y-6">
      {faqs.map((faq, index) => (
        <div
          key={faq.id}
          className="bg-white p-4 rounded-lgtransition-all  cursor-pointer"
        >
          {/* Question Section */}
          <div
            className="flex justify-between items-center"
            onClick={() => toggleExpanded(index)} // Toggle the FAQ on click
          >
            <h3 className="text-lg font-semibold text-gray-800">{faq.question}</h3>
            <Plus
              size={20}
              className={`text-gray-500 transition-transform duration-300 ${
                expandedIndex === index ? "rotate-45" : "" // Rotate the plus when expanded
              }`}
            />
          </div>

          {/* Answer Section */}
          {expandedIndex === index && (
            <div className="mt-4 text-gray-600 text-sm transition-all duration-300 ease-in-out">
              <p>{faq.answer}</p>
            </div>
          )}

          {/* Divider Line */}
          <hr className="my-4 border-gray-200" />
        </div>
      ))}
    </div>
  );
}
