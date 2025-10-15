'use client';

import { useState } from "react";
import { Plus } from "lucide-react";

interface Faq {
  id: number;
  question: string;
  answer: string;
}

interface FaqCategory {
  category: string;
  questions: Faq[];
}

interface FaqsCardProps {
  // Allow readonly (from `as const`) and undefined just in case
  faqs?: readonly FaqCategory[];
}

export default function FaqsCard({ faqs }: FaqsCardProps) {
  // If faqs is undefined/null, fall back to empty list
  const categories: FaqCategory[] = (faqs as FaqCategory[]) ?? [];

  // Track expanded question index per category
  const [expandedByCategory, setExpandedByCategory] = useState<Record<number, number | null>>({});

  const toggleExpanded = (categoryIndex: number, questionIndex: number) => {
    setExpandedByCategory((prev) => ({
      ...prev,
      [categoryIndex]: prev[categoryIndex] === questionIndex ? null : questionIndex,
    }));
  };

  return (
    <div className="space-y-8">
      {categories.map((category, categoryIndex) => {
        const questions: Faq[] = category?.questions ?? [];
        const expandedIndex = expandedByCategory[categoryIndex] ?? null;

        return (
          <section key={`${category.category}-${categoryIndex}`}>
            {/* Category Heading */}
            <h2 className="text-xl px-4 font-semibold text-[#303B40] mb-4">
              {category?.category ?? ""}
            </h2>

            {/* Questions */}
            <div className="space-y-3">
              {questions.map((faq, qIndex) => (
                <div
                  key={faq?.id ?? `${categoryIndex}-${qIndex}`}
                  className="bg-white p-4 rounded-lg transition-all cursor-pointer"
                >
                  {/* Question Row */}
                  <button
                    type="button"
                    aria-expanded={expandedIndex === qIndex}
                    onClick={() => toggleExpanded(categoryIndex, qIndex)}
                    className="w-full flex justify-between items-center text-left"
                  >
                    <h3 className="text-lg font-normal text-[#5F5D5A]">
                      {faq?.question ?? ""}
                    </h3>
                    <Plus
                      size={20}
                      className={`text-gray-500 transition-transform duration-300 ${
                        expandedIndex === qIndex ? "rotate-45" : ""
                      }`}
                    />
                  </button>

                  {/* Answer */}
                  {expandedIndex === qIndex && (
                    <div className="mt-4 text-gray-600 text-sm transition-all duration-300 ease-in-out">
                      <p className="text-[#5F5D5A]">{faq?.answer ?? ""}</p>
                    </div>
                  )}

                  <hr className="my-2 border-gray-200" />
                </div>
              ))}

              {/* If a category has no questions */}
              {questions.length === 0 && (
                <div className="px-4 py-6 text-sm text-gray-500">
                  No questions available.
                </div>
              )}
            </div>
          </section>
        );
      })}

      {/* If no categories at all */}
      {categories.length === 0 && (
        <div className="px-4 py-8 text-sm text-gray-500">No FAQs found.</div>
      )}
    </div>
  );
}
