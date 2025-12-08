'use client'
import useFormStore from '@/stores/FormStore'
import React, { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Steps from '../steps'
import CarList from '../CarList'
import GoogleMapsRoute from '../GoogleMap'
import PickupTripDetails from '../PickupDetails'
import FeaturesIncluded from '../FeaturesIncluded'
import { ArrowDown, ArrowUp, ArrowLeft } from 'lucide-react'

function SelectVehiclePage() {
  const { isMobileDropdownOpen, toggleMobileDropdown, orderId, paymentURL, isOrderDone, formData } = useFormStore()
  const router = useRouter()
  const headerRef = useRef<HTMLDivElement | null>(null)

  // Redirect to payment-process when payment is ready
  useEffect(() => {
    if (orderId && paymentURL && isOrderDone) {
      router.push(`/payment-process/${orderId}`);
    }
  }, [orderId, paymentURL, isOrderDone, router])

  // Route protection: Check if step 1 (initial form) is completed
  useEffect(() => {
    const hasRequiredData = formData.fromLocation?.value && 
      (formData.toLocation?.value || formData.duration?.value) &&
      formData.date?.value && 
      formData.time?.value &&
      formData.passengers?.value &&
      formData.bags?.value

    if (!hasRequiredData) {
      router.push('/')
    }
  }, [formData, router])

  useEffect(() => {
    if (headerRef.current) {
      headerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  return (
    <div className='w-full bg-slate-50 flex flex-col'>
      <div ref={headerRef} className='h-24 w-full bg-black header'></div>
      <div className='max-w-5xl mx-auto flex flex-col gap-5 lg:gap-10 w-full py-5 lg:py-16 px-2'>
        {/* Back Button - Mobile Full Width */}
        <div className="lg:hidden flex justify-start w-full">
          <button
            onClick={() => router.push('/')}
            className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold px-4 py-2 rounded-lg border border-gray-300 transition-all shadow-sm hover:shadow-md active:scale-[0.98] w-full"
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>
        </div>

        {/* Mobile Dropdown */}
        <div className={`w-full border-2 border-brand rounded-md flex flex-col lg:hidden ${isMobileDropdownOpen ? 'gap-5' : 'gap-0'}`}>
          <div className={`overflow-hidden transition-all duration-700 flex flex-col gap-3 ease-out
             ${isMobileDropdownOpen ? 'max-h-[2000px] opacity-100 p-1' : 'max-h-0 opacity-0 p-0'}
              `}>
            <GoogleMapsRoute />
            <PickupTripDetails />
            <FeaturesIncluded />
          </div>
          <div onClick={() => toggleMobileDropdown()} className='bg-primary text-white p-2 rounded-sm font-bold flex items-center justify-between'>
            <div>Ride Details</div>
            {isMobileDropdownOpen ? <ArrowUp /> : <ArrowDown />}
          </div>
        </div>

        {/* Steps Component */}
        <Steps />

        <div className='grid lg:grid-cols-3 gap-5 w-full'>
          <div className='lg:col-span-2 w-full flex flex-col gap-5'>
            <CarList />
          </div>
          <div className='hidden lg:flex flex-col gap-5 w-full'>
            <GoogleMapsRoute />
            <PickupTripDetails />
            <FeaturesIncluded />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SelectVehiclePage

