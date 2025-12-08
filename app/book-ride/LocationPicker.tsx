"use client";

import { useRef } from "react";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import { SlLocationPin } from "react-icons/sl";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import useFormStore, { FormDataType } from "@/stores/FormStore";

interface LocationInputProps {
  field: keyof FormDataType;
  label: string;
  placeholder: string;
  index?: number; 
  isStop?: boolean;
  onAddStop?: () => void;
  onRemoveStop?: () => void;
  showAddButton?: boolean;
}

export default function LocationInput({
  field,
  label,
  placeholder,
  index,
}: LocationInputProps) {
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const { formData, setFormData } = useFormStore();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: ["places"],
  });

  const handlePlaceChanged = () => {
    const autocomplete = autocompleteRef.current;
    if (!autocomplete) return;
    const place = autocomplete.getPlace();
    if (place.geometry?.location) {
      const coords = `${place.geometry.location.lat()},${place.geometry.location.lng()}`;
      
      // Build address in format: Place Name, Street Address, City, Country (no postal code, no neighborhood)
      let address = "";
      
      if (place.address_components && place.name) {
        // Get place name
        const placeName = place.name;
        
        // Get street address components
        const streetNumber = place.address_components.find(
          (comp) => comp.types.includes("street_number")
        )?.long_name;
        const route = place.address_components.find(
          (comp) => comp.types.includes("route")
        )?.long_name;
        
        // Get city (locality)
        const locality = place.address_components.find(
          (comp) => comp.types.includes("locality")
        )?.long_name;
        
        // Get country
        const country = place.address_components.find(
          (comp) => comp.types.includes("country")
        )?.long_name;
        
        // Build street address (number + route)
        const streetAddress = [streetNumber, route].filter(Boolean).join(" ");
        
        // Build final address: Place Name, Street Address, City, Country
        const addressParts: string[] = [];
        
        if (placeName) addressParts.push(placeName);
        if (streetAddress) addressParts.push(streetAddress);
        if (locality) addressParts.push(locality);
        if (country) addressParts.push(country);
        
        address = addressParts.join(", ");
      } else {
        // Fallback: clean formatted_address to remove postal codes and neighborhoods
        address = place.formatted_address || place.name || "";
        // Remove postal codes (5 digits)
        address = address.replace(/,\s*\d{5}\s*/g, ", ");
        address = address.replace(/\s+\d{5}\s*/g, " ");
        // Remove neighborhood names like "Extramurs"
        address = address.replace(/,\s*Extramurs,?/gi, ",");
        address = address.replace(/,\s*$/, "").trim();
      }
      
      setFormData(field, address, coords, index);
    }
  };

  const handleInputChange = (value: string) => {
    setFormData(field, value, "",index);
  };
  
  const fieldData =
     field === "stops" 
      ? formData.stops[index!]
      : (formData[field as keyof FormDataType] as any);

     

  return (
    <div className="relative flex items-center gap-3 w-full">
      

      {/* Input */}
      {!isLoaded ? (
        <div className="flex flex-col gap-1 w-full">
          <div className="text-sm font-semibold text-gray-700">{label}</div>
        <div className="relative flex-1">
          <SlLocationPin className="absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            placeholder="Loading..."
            className="w-full pl-8 md:pl-10 pr-2 md:pr-3 py-2 md:py-2.5 border border-gray-300 rounded-lg text-gray-500 bg-gray-50 cursor-not-allowed"
            disabled
          />
        </div>
            </div>
      ) : (
        <div className="flex flex-col gap-1 w-full">
          <div className="text-sm font-semibold text-gray-700">{label}</div>
        <Autocomplete
          onLoad={(auto) => (autocompleteRef.current = auto)}
          onPlaceChanged={handlePlaceChanged}
          options={{ 
            componentRestrictions: { country: "es" },
            fields: ["name", "formatted_address", "geometry", "address_components"]
          }}
          className="w-full"
        >
          <div className="relative flex-1 w-full">
            <SlLocationPin className="absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              value={fieldData?.value || ""}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={placeholder}
              className={`w-full pl-8 md:pl-10 pr-2 md:pr-3 py-2 md:py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-gray-900 text-sm md:text-base bg-white cursor-text ${fieldData.error ? 'border-red-500 focus:ring-red-500/50' : 'border-gray-300 hover:border-gray-400'} `}
            />
          </div>
        </Autocomplete>
        </div>
      )}

    </div>
  );
}
