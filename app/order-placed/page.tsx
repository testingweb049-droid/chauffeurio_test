'use client'

import useFormStore from '@/stores/FormStore'
import { useRouter } from 'next/navigation'
import React, { useEffect, useRef } from 'react'
import { fleets } from '../book-ride/CarList'
import { MdDone } from 'react-icons/md'
import Image from 'next/image'
import Link from 'next/link'

// 🧩 Define a safe type for each form field
interface FormField {
  value: string | number | boolean
  error?: string
  required?: boolean
  step?: number
  coardinates?: string
  coardinatesRequired?: boolean
}

// 🧩 Define the structure of your form data
interface FormData {
  fromLocation: FormField
  toLocation: FormField
  stops: FormField[]
  duration: FormField
  distance: FormField
  car: FormField
  price: FormField
  name: FormField
  phone: FormField
  email: FormField
  date: FormField
  time: FormField
  returnDate: FormField
  returnTime: FormField
  passengers: FormField
  bags: FormField
  flightName: FormField
  flightNumber: FormField
  isAirportPickup: FormField
  isFlightTrack: FormField
  isMeetGreet: FormField
  isReturn: FormField
  paymentId: FormField
  childSeat: FormField
  infantSeat: FormField
  boosterSeat: FormField
  description: FormField
}

// 🧩 Fleet type
interface Fleet {
  category: string
  displayName: string
  vehicles: string[]
  passengers: number
  luggage: number
  hasChargingPort: boolean
  imageUrl: string
  pricing: {
    perKm: number
    hourly: number
    airport: number
  }
}

function Page() {
  const { isOrderDone, formData, category, orderId } = useFormStore() as {
    isOrderDone: boolean
    formData: FormData
    category: string
    orderId: string
  }

  const router = useRouter()
  const headerRef = useRef<HTMLDivElement | null>(null)

  const { fromLocation, toLocation, stops, duration } = formData
  const locations = [fromLocation, ...(stops || [])].filter(Boolean)

  if (category === 'hourly') {
    locations.push({ ...duration, value: duration.value + ' Hours' })
  } else {
    locations.push(toLocation)
  }

  const selectedFleet: Fleet | undefined = fleets.find(
    (item) => item.category === formData.car.value
  )

  useEffect(() => {
    if (!isOrderDone) {
      router.replace('/')
      router.refresh()
    }
    if (headerRef.current) {
      headerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [isOrderDone, router])

  return (
    <div className="w-full flex flex-col min-h-screen bg-gray-100 dark:bg-[#0b1623] text-gray-900 dark:text-gray-100 transition-colors duration-500">
      {/* Header Spacer */}
      <div ref={headerRef} className="h-24 w-full bg-[#01303f] dark:bg-[#08111a]" />

      <div className="max-w-7xl mx-auto py-16 px-4 lg:px-8 flex flex-col items-center justify-center gap-12 text-center">
        {/* ✅ Confirmation Section */}
        <div className="flex flex-col items-center justify-center gap-4">
          <MdDone className="p-3 text-white bg-green-500 rounded-full shadow-md" size={55} />
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Great choice, <span className="font-semibold">{formData.name.value}</span>
          </p>
          <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
            YOUR RESERVATION IS CONFIRMED
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            We&apos;ve sent a confirmation email to {formData.email.value}
          </p>
        </div>

        {/* ✅ Main Layout */}
        <div className="w-full grid lg:grid-cols-3 gap-8">
          {/* 🧾 LEFT: Order Details */}
          <div className="lg:col-span-2 w-full bg-white dark:bg-[#121e2d] border border-gray-300 dark:border-gray-700 rounded-2xl p-6 lg:p-8 shadow-md">
            <h2 className="text-2xl font-semibold mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
              Order Details
            </h2>

            <div className="grid grid-cols-2 gap-3 text-sm sm:text-base text-left">
              <div><span className="text-gray-500 dark:text-gray-400">Order ID:</span> {orderId}</div>
              <div><span className="text-gray-500 dark:text-gray-400">Car Type:</span> {formData.car.value}</div>
              <div><span className="text-gray-500 dark:text-gray-400">Passengers:</span> {formData.passengers.value}</div>
              <div><span className="text-gray-500 dark:text-gray-400">Bags:</span> {formData.bags.value}</div>
              <div><span className="text-gray-500 dark:text-gray-400">Price:</span> €{formData.price.value}</div>
              <div><span className="text-gray-500 dark:text-gray-400">Distance:</span> {formData.distance.value} km</div>
              <div><span className="text-gray-500 dark:text-gray-400">Phone:</span> {formData.phone.value}</div>
              <div><span className="text-gray-500 dark:text-gray-400">Email:</span> {formData.email.value}</div>
              <div><span className="text-gray-500 dark:text-gray-400">Child Seats:</span> {formData.childSeat.value}</div>
              <div><span className="text-gray-500 dark:text-gray-400">Infant Seats:</span> {formData.infantSeat.value}</div>
              <div><span className="text-gray-500 dark:text-gray-400">Booster Seats:</span> {formData.boosterSeat.value}</div>
              <div><span className="text-gray-500 dark:text-gray-400">Meet & Greet:</span> {formData.isMeetGreet.value ? 'Yes' : 'No'}</div>
              <div><span className="text-gray-500 dark:text-gray-400">Return Trip:</span> {formData.isReturn.value ? 'Yes' : 'No'}</div>
            </div>

            <div className="text-left leading-relaxed py-4 border-t mt-6">
              <span className="text-gray-500 dark:text-gray-400 font-semibold">Notes:</span>{' '}
              {formData.description.value ? (
                <span>{formData.description.value}</span>
              ) : (
                <span>
                  Please ensure you are ready at least <strong>10 minutes before your scheduled pickup time</strong>.
                  Our chauffeur will wait for up to <strong>15 minutes</strong> at the pickup location.
                  In case of any delays, changes, or special requests, kindly contact our support team immediately.
                  If your booking includes an airport pickup, your driver will monitor your flight for any schedule
                  changes. For return trips, the same pickup instructions apply. We strive to provide a smooth and
                  comfortable journey — thank you for choosing <strong>ChauffeurPro</strong>.
                </span>
              )}
            </div>

            {/* Button */}
            <div className="flex justify-end mt-6">
              <Link
                href={`/order/${orderId}`}
                className="bg-yellow-400 dark:bg-yellow-500 hover:bg-yellow-500 dark:hover:bg-yellow-600 text-black font-semibold px-5 py-2.5 rounded-lg transition-all duration-300 shadow"
              >
                View Order Details
              </Link>
            </div>
          </div>

          {/* 🚗 RIGHT: Image + Itinerary */}
          {selectedFleet && (
            <div className="rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#121e2d] p-5 flex flex-col items-center justify-start shadow-md">
              <Image
                src={selectedFleet.imageUrl}
                alt={selectedFleet.displayName}
                className="rounded-lg object-contain"
                width={400}
                height={250}
              />
              <div className="mt-3 font-semibold text-lg text-gray-900 dark:text-gray-100">
                {selectedFleet.displayName}
              </div>

              {/* ✈️ Itinerary below image */}
              <div className="w-full mt-8 text-left">
                <h2 className="text-2xl font-semibold mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                  Your Itinerary
                </h2>

                <div className="flex flex-col gap-3">
                  {locations.map((item, idx) => (
                    <div key={idx} className="text-sm sm:text-base text-gray-800 dark:text-gray-200">
                      {String(item.value)}
                    </div>
                  ))}
                </div>

                <div className="mt-4 text-sm sm:text-base">
                  <div className="text-gray-500 dark:text-gray-400">Pickup Date & Time</div>
                  <div className="font-medium">{formData.date.value} {formData.time.value}</div>
                </div>

                {formData.isReturn.value && (
                  <div className="mt-2 text-sm sm:text-base">
                    <div className="text-gray-500 dark:text-gray-400">Return Date & Time</div>
                    <div className="font-medium">{formData.returnDate.value} {formData.returnTime.value}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Page
