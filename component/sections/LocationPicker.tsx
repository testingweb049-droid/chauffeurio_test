'use client'

import { useRef } from 'react'
import { Autocomplete, useJsApiLoader } from '@react-google-maps/api'
import { SlLocationPin } from 'react-icons/sl'
import useFormStore, { FieldType, FormDataType } from '@/stores/FormStore'

interface LocationInputProps {
  field: keyof FormDataType
  label: string
  placeholder: string
}

export default function LocationInput({ field, label, placeholder }: LocationInputProps) {
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const { formData, setFormData } = useFormStore()

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: ['places'],
  })

  const handlePlaceChanged = () => {
    const autocomplete = autocompleteRef.current
    if (!autocomplete) return
    const place = autocomplete.getPlace()
    if (place.formatted_address && place.geometry?.location) {
      const coords = `${place.geometry.location.lat()},${place.geometry.location.lng()}`
      setFormData(field, place.formatted_address, coords)
    }
  }

  const handleInputChange = (value: string) => {
    setFormData(field, value, '')
  }

  const fieldData = formData[field as keyof FormDataType] as FieldType<string>

  return (
    <div className={`w-full rounded-lg bg-gray-100 px-4 py-3 border ${fieldData.error ? 'border-red-500' : 'border-gray-100'} `}>
      {/* Label inside box */}
      <label className="block text-[13px] font-medium text-gray-600 mb-1">
        {label}
      </label>

      {/* Input Field */}
      <div className="relative w-full">
        <SlLocationPin className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />

        {!isLoaded ? (
          <input
            placeholder="Loading..."
            disabled
            className="w-full pl-6 text-[15px] bg-transparent text-gray-500 placeholder:text-gray-400 outline-none cursor-not-allowed"
          />
        ) : (
            <Autocomplete
              onLoad={(auto) => (autocompleteRef.current = auto)}
              onPlaceChanged={handlePlaceChanged}
              options={{ componentRestrictions: { country: 'es' } }}
            >
            <input
                value={fieldData?.value || ''}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={placeholder}
                className={`w-full pl-6 text-[15px] bg-transparent text-gray-800 placeholder:text-gray-400 outline-none focus:text-gray-900 ${fieldData.error ? 'text-red-600' : ''
                  }`}
              />
            </Autocomplete>
        )}
      </div>
    </div>
  )
}
