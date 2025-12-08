"use client";

import useFormStore from "@/stores/FormStore";
import React from "react";
import { ArrowLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface Step {
  id: number;
  title: string;
  path: string;
}

export default function Steps() {
  const pathname = usePathname();
  const router = useRouter();
  const { formData } = useFormStore();

  const steps: Step[] = [
    { id: 1, title: "Select Vehicle", path: "/book-ride/select-vehicle" },
    { id: 2, title: "Passenger Details", path: "/book-ride/passenger-details" },
  ];

  // Determine current step based on pathname
  const getCurrentStep = () => {
    if (pathname?.includes("/passenger-details")) return 2;
    if (pathname?.includes("/select-vehicle")) return 1;
    return 0;
  };

  const currentStep = getCurrentStep();

  // Check if a step is completed
  const isStepCompleted = (stepId: number) => {
    if (stepId === 1) {
      // Step 1 is completed if we have initial form data
      return Boolean(formData.fromLocation?.value && 
        (formData.toLocation?.value || formData.duration?.value) &&
        formData.date?.value && 
        formData.time?.value);
    }
    if (stepId === 2) {
      // Step 2 is completed if vehicle is selected
      return Boolean(formData.car?.value && formData.price?.value);
    }
    return false;
  };

  const handleStepClick = (step: Step) => {
    // Only allow navigation if step is completed or is the current step
    if (step.id <= currentStep || isStepCompleted(step.id - 1)) {
      router.push(step.path);
    }
  };

  const handleBackClick = () => {
    if (currentStep === 2) {
      router.push("/book-ride/select-vehicle");
    } else if (currentStep === 1) {
      router.push("/");
    }
  };

  return (
    <div className="flex flex-col w-full gap-4">
      {/* Back Button - Desktop only */}
      <div className="hidden lg:flex justify-start">
        <button
          onClick={handleBackClick}
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold px-4 py-2 rounded-lg border border-gray-300 transition-all shadow-sm hover:shadow-md active:scale-[0.98] w-full justify-center"
          aria-label="Go back"
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center justify-between w-full">
        {steps.map((stepData, index) => {
          const isActive = currentStep === stepData.id;
          const isCompleted = currentStep > stepData.id || isStepCompleted(stepData.id);
          const isClickable = stepData.id <= currentStep || isStepCompleted(stepData.id - 1);

          return (
            <React.Fragment key={stepData.id}>
              <div 
                className="flex items-center gap-2"
                onClick={() => isClickable && handleStepClick(stepData)}
                style={{ cursor: isClickable ? 'pointer' : 'default' }}
              >
                <div
                  className={`flex items-center justify-center w-6 h-6 rounded-full border-2 text-sm font-medium transition-colors
                    ${isActive
                      ? "bg-gray-900 text-white border-gray-900"
                      : isCompleted
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-gray-100 text-gray-400 border-gray-300"
                    }`}
                >
                  {stepData.id}
                </div>
                <span
                  className={`text-sm font-medium max-lg:hidden ${isActive ? "text-gray-900" : "text-gray-400"
                    }`}
                >
                  {stepData.title}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-[1px] mx-2 ${isCompleted ? "bg-gray-300" : "bg-gray-200"
                    }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}