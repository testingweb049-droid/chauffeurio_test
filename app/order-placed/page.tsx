'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { MdDone } from 'react-icons/md';
import Image from 'next/image';
import Link from 'next/link';
import useFormStore, { FormDataType } from '@/stores/FormStore';
import { fleets } from '../book-ride/CarList';

export default function OrderPlacedPage() {
  const router = useRouter();
  const headerRef = useRef<HTMLDivElement | null>(null);
  const { formData, setFormData, isOrderDone, orderId } = useFormStore();
  const [loaded, setLoaded] = useState(false);
  const [localOrderId, setLocalOrderId] = useState('');

  useEffect(() => {
    // Load from localStorage if store is empty
    if (!isOrderDone) {
      const storedOrder = localStorage.getItem('lastOrder');
      if (storedOrder) {
        const parsed: any = JSON.parse(storedOrder);

        // Get orderId from localStorage
        if (parsed.orderId) {
          setLocalOrderId(parsed.orderId);
        }

        Object.entries(parsed).forEach(([key, val]) => {
          if (key === 'stops' && Array.isArray(val)) {
            val.forEach((stop: any, index: number) => {
              if (stop && typeof stop === 'object' && 'value' in stop) {
                setFormData('stops', (stop as any).value, (stop as any).coardinates, index);
              }
            });
          } else if (val && typeof val === 'object' && 'value' in val &&
            (typeof val.value === 'string' || typeof val.value === 'number' || typeof val.value === 'boolean')) {
            setFormData(key as keyof FormDataType, (val as any).value, (val as any).coardinates);
          }
        });
      }
    }

    setLoaded(true);

    if (headerRef.current) {
      headerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [isOrderDone, setFormData]);

  // Use either the store orderId or the one from localStorage
  const displayOrderId = orderId || localOrderId;

  if (!loaded) return <div className="flex items-center justify-center h-screen">Loading order...</div>;

  const stopsArray = Array.isArray(formData.stops) ? formData.stops : [];
  const locations = [formData.fromLocation, ...stopsArray].filter(Boolean);

  if (formData.category?.value === 'hourly' && formData.duration?.value) {
    locations.push({ ...formData.duration, value: formData.duration.value + ' Hours' });
  } else if (formData.toLocation?.value) {
    locations.push(formData.toLocation);
  }

  const selectedFleet = fleets.find(f => f.displayName === formData.car?.value);

  return (
    <div className="w-full flex flex-col min-h-screen bg-white text-gray-900">
      <div ref={headerRef} className="h-24 w-full bg-[#01303f]" />

      <div className="max-w-7xl mx-auto py-16 px-4 lg:px-8 flex flex-col items-center gap-12 text-center">
        <div className="flex flex-col items-center gap-4">
          <MdDone className="p-3 text-white bg-green-500 rounded-full shadow-md" size={55} />
          <p className="text-lg text-gray-700">
            Great choice, <span className="font-semibold">{formData.name?.value || 'Customer'}</span>
          </p>
          <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 tracking-tight">
            YOUR RESERVATION IS CONFIRMED
          </h1>
          <p className="text-gray-600">
            We've sent a confirmation email to {formData.email?.value || 'your email'}
          </p>
        </div>

        <div className="w-full grid lg:grid-cols-3 gap-8">
          {/* Left: Order Details */}
          <div className="lg:col-span-2 w-full bg-white border border-gray-300 rounded-2xl p-6 lg:p-8 shadow-md">
            <h2 className="text-2xl font-semibold mb-4 border-b border-gray-200 pb-2">Order Details</h2>
            <div className="grid grid-cols-2 gap-3 text-sm sm:text-base text-left">
              <div><span className="text-gray-500">Order ID:</span> {displayOrderId || 'Loading...'}</div>
              <div><span className="text-gray-500">Car Type:</span> {formData.car?.value}</div>
              <div><span className="text-gray-500">Passengers:</span> {formData.passengers?.value}</div>
              <div><span className="text-gray-500">Bags:</span> {formData.bags?.value}</div>
              <div><span className="text-gray-500">Price:</span> €{formData.price?.value}</div>
              <div><span className="text-gray-500">Distance:</span> {formData.distance?.value} km</div>
              <div><span className="text-gray-500">Phone:</span> {formData.phone?.value}</div>
              <div><span className="text-gray-500">Email:</span> {formData.email?.value}</div>
              <div><span className="text-gray-500">Child Seats:</span> {formData.childSeat?.value}</div>
              <div><span className="text-gray-500">Infant Seats:</span> {formData.infantSeat?.value}</div>
              <div><span className="text-gray-500">Booster Seats:</span> {formData.boosterSeat?.value}</div>
              <div><span className="text-gray-500">Meet & Greet:</span> {formData.isMeetGreet?.value ? 'Yes' : 'No'}</div>
              <div><span className="text-gray-500">Return Trip:</span> {formData.isReturn?.value ? 'Yes' : 'No'}</div>
            </div>

            {/* View Order Details Button */}
            <div className="flex items-center justify-end w-full mt-8">
              <div className="flex items-center gap-5">
                <Link
                  className='bg-brand px-4 py-2 text-black font-semibold w-fit rounded-md hover:bg-opacity-90 transition-colors'
                  href={`/order/${displayOrderId}`}
                >
                  View Order Details
                </Link>
              </div>
            </div>
          </div>

          {/* Right: Fleet Image and Itinerary */}
          {selectedFleet && (
            <div className="rounded-2xl border border-gray-300 bg-white p-5 flex flex-col items-center shadow-md">
              <Image
                src={selectedFleet.imageUrl}
                alt={selectedFleet.displayName}
                width={400}
                height={250}
                className="rounded-lg object-contain"
              />
              <div className="mt-3 font-semibold text-lg">{selectedFleet.displayName}</div>

              <div className="w-full mt-8 text-left">
                <h2 className="text-2xl font-semibold mb-4 border-b border-gray-200 pb-2">Your Itinerary</h2>
                <div className="flex flex-col gap-3">
                  {locations.map((item, idx) => (
                    <div key={idx} className="text-sm sm:text-base text-gray-800">
                      {item?.value || String(item)}
                    </div>
                  ))}
                </div>

                <div className="mt-4 text-sm sm:text-base">
                  <div className="text-gray-500">Pickup Date & Time</div>
                  <div className="font-medium">{formData.date?.value} {formData.time?.value}</div>
                </div>

                {formData.isReturn?.value && (
                  <div className="mt-2 text-sm sm:text-base">
                    <div className="text-gray-500">Return Date & Time</div>
                    <div className="font-medium">{formData.returnDate?.value} {formData.returnTime?.value}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}