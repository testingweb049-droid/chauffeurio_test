"use client";

import { useEffect, useRef, useState } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import { SlLocationPin } from "react-icons/sl";
import useFormStore, { FormDataType } from "@/stores/FormStore";

interface LocationInputProps {
  field: keyof FormDataType;
  label: string;
  placeholder: string;
  index?: number;
}

export default function CustomLocationInput({
  field,
  label,
  placeholder,
  index,
}: LocationInputProps) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: ["places"],
  });

  const { formData, setFormData } = useFormStore();
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const serviceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesRef = useRef<google.maps.places.PlacesService | null>(null);

  const fieldData =
    field === "stops"
      ? formData.stops[index!]
      : (formData[field as keyof FormDataType] as any);

  useEffect(() => {
    if (isLoaded && !serviceRef.current) {
      serviceRef.current = new google.maps.places.AutocompleteService();
      const dummyDiv = document.createElement("div");
      placesRef.current = new google.maps.places.PlacesService(dummyDiv);
    }
  }, [isLoaded]);

  // 🔹 Fetch predictions as user types (debounced)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(field, value, "", index);
    if (!value.trim() || !serviceRef.current) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    serviceRef.current.getPlacePredictions(
      { input: value },
      (predictions, status) => {
        setLoading(false);
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          setSuggestions(predictions);
        } else {
          setSuggestions([]);
        }
      }
    );
  };

  // 🔹 When a user selects a suggestion
  const handleSelect = (prediction: google.maps.places.AutocompletePrediction) => {
    if (!placesRef.current) return;

    placesRef.current.getDetails(
      { placeId: prediction.place_id },
      (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          const formatted = place.formatted_address || prediction.description;
          const coords = place.geometry
            ? `${place.geometry.location?.lat()},${place.geometry.location?.lng()}`
            : "";
          setFormData(field, formatted, coords, index);
          setSuggestions([]);
        }
      }
    );
  };

  return (
    <div className="relative w-full">
      <div className="text-sm font-semibold text-gray-700 mb-1">{label}</div>
      <div className="relative">
        <SlLocationPin className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          ref={inputRef}
          value={fieldData?.value || ""}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full text-sm pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F4910B] outline-none"
        />
      </div>

      {/* 🔹 Custom Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <div className="absolute z-10 bg-white border border-gray-200 rounded-lg shadow-md mt-1 w-full max-h-60 overflow-y-auto">
          {suggestions.map((p, i) => (
            <div
              key={p.place_id}
              onMouseEnter={() => setActiveIndex(i)}
              onMouseLeave={() => setActiveIndex(null)}
              onClick={() => handleSelect(p)}
              className={`px-3 py-2 text-sm cursor-pointer ${
                activeIndex === i ? "bg-gray-100" : ""
              }`}
            >
              {p.description}
            </div>
          ))}
          <div className="text-[10px] text-gray-400 px-3 py-1 border-t text-right">
            Powered by Google
          </div>
        </div>
      )}
    </div>
  );
}
