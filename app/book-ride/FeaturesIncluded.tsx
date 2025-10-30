"use client";

import { brandColor } from "@/lib/colors";
import { Check } from "lucide-react";

export default function FeaturesIncluded() {
    const features = [
        "Free waiting time",
        "Door-to-door service",
        "Meet & Greet",
        "Private transfer",
        "Flight tracking",
        "Licensed chauffeurs",
        "Instant confirmation"
    ];

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 max-w-md">
            {/* Header */}
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    What's included
                </h3>
                <hr className="border-gray-200" />
            </div>

            {/* Features List in Grid */}
            <div className="grid gap-3">
                {features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                        {/* Check Icon */}
                        <div className="flex-shrink-0 mt-0.5">
                            <div
                                className="w-5 h-5 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: brandColor }}
                            >
                                <Check className="w-3 h-3 text-white" />
                            </div>
                        </div>

                        {/* Feature Text */}
                        <span className="text-gray-700 text-sm">
                            {feature}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}