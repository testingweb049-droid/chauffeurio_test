'use client';

import { useState } from "react";
import { Plus } from "lucide-react";

interface Faq {
  id: number;
  question: string;
  answer: string;
}

interface FaqsCardProps {
  faqs?: Faq[]; // flat array now
}

export default function FaqsCard({ faqs }: FaqsCardProps) {
  const questions: Faq[] = faqs ?? [];
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpanded = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {questions.map((faq, index) => (
        <div
          key={faq.id}
          className="bg-white p-4 rounded-lg transition-all cursor-pointer"
        >
          {/* Question Row */}
          <button
            type="button"
            aria-expanded={expandedIndex === index}
            onClick={() => toggleExpanded(index)}
            className="w-full flex justify-between items-center text-left"
          >
            <h3 className="text-lg font-normal text-[#5F5D5A]">{faq.question}</h3>
            <Plus
              size={20}
              className={`text-gray-500 transition-transform duration-300 ${expandedIndex === index ? "rotate-45" : ""
                }`}
            />
          </button>

          {/* Answer */}
          {expandedIndex === index && (
            <div className="mt-4 text-gray-600 text-sm transition-all duration-300 ease-in-out">
              <p className="text-[#5F5D5A]">{faq.answer}</p>
            </div>
          )}

          <hr className="my-2 border-gray-200" />
        </div>
      ))}

      {questions.length === 0 && (
        <div className="px-4 py-8 text-sm text-gray-500">No FAQs found.</div>
      )}
    </div>
  );
}
