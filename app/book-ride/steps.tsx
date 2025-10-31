"use client";

import useFormStore from "@/stores/FormStore";
import React from "react";
import { ArrowLeft } from "lucide-react";

interface Step {
  id: number;
  title: string;
}

export default function Steps() {
  const { step, changeStep } = useFormStore();

  const steps: Step[] = [
    { id: 1, title: "Transfer Vehicle" },
    { id: 2, title: "Transfer Details" },
    { id: 3, title: "Payment Details" },
  ];

  return (
    <div className="flex flex-col w-full gap-4">
      {/* 🟨 Back Button - Sirf Desktop ke liye */}
      <div className="hidden lg:flex justify-start">
        <button
          onClick={() => changeStep(false, step)}
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold px-4 py-2 rounded-lg border border-gray-300 transition-all shadow-sm hover:shadow-md active:scale-[0.98] w-full justify-center"
          aria-label="Go back"
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center justify-between w-full">
        {steps.map((stepData, index) => (
          <React.Fragment key={stepData.id}>

            <div className="flex items-center gap-2">
              <div
                className={`flex items-center justify-center w-6 h-6 rounded-full border-2 text-sm font-medium transition-colors
                  ${step === stepData.id + 1
                    ? "bg-gray-900 text-white border-gray-900"
                    : step > stepData.id + 1
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-gray-100 text-gray-400 border-gray-300"
                  }`}
              >
                {stepData.id}
              </div>
              <span
                className={`text-sm font-medium max-lg:hidden ${step === stepData.id + 1 ? "text-gray-900" : "text-gray-400"
                  }`}
              >
                {stepData.title}
              </span>
            </div>


            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-[1px] mx-2 ${step > stepData.id ? "bg-gray-300" : "bg-gray-200"
                  }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}