'use client'
import useFormStore from '@/stores/FormStore'
import React, { useEffect, useRef } from 'react'
import Steps from './steps'
import CarList from './CarList'
import GoogleMapsRoute from './GoogleMap'
import PickupTripDetails from './PickupDetails'
import Step3 from './Step3'
import FeatureList from './FeatureList'
import SelectedCar from './SelectedCar'
import { useRouter } from 'next/navigation'
import Step4 from './Step4'
import PersonalDetails from './PersonalDetails'
import { ArrowDown, ArrowUp, ArrowLeft } from 'lucide-react'
import FeaturesIncluded from './FeaturesIncluded'

function Page() {

  const { step, isMobileDropdownOpen, toggleMobileDropdown, changeStep, orderId, paymentURL, isOrderDone  } = useFormStore()
  const router = useRouter()
  const headerRef = useRef<HTMLDivElement | null>(null)
  
  

  useEffect(()=>{
    console.log(step , 'step 1')
    console.log(orderId , 'orderId 1')
    console.log(paymentURL , 'paymentURL 1')
    console.log(isOrderDone , 'isOrderDone 1')
    if(orderId && paymentURL && isOrderDone){
      router.replace(`/payment-process/${orderId}`);
      router.refresh();
      
    }
  },[orderId, paymentURL, isOrderDone])

  useEffect(() => {
    if (step === 1 ) {
      router.replace('/');
      router.refresh();
    }

    if (headerRef.current) {
      headerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

  }, [step])

  return (
    <div className=' w-full bg-slate-50 flex flex-col'>
      <div ref={headerRef} className='h-24 w-full bg-black header'></div>
      <div className='max-w-5xl mx-auto flex flex-col gap-5 lg:gap-10 w-full py-5 lg:py-16 px-2 '>
        {/* 🟨 Back Button - Mobile Full Width */}
        <div className="lg:hidden flex justify-start w-full">
          <button
            onClick={() => changeStep(false, step)}
            className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold px-4 py-2 rounded-lg border border-gray-300 transition-all shadow-sm hover:shadow-md active:scale-[0.98] w-full"
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>
        </div>

        {/* Mobile Dropdown - Back button ke NICHE */}
        <div className={`w-full border-2 border-brand rounded-md flex flex-col lg:hidden ${isMobileDropdownOpen ? 'gap-5' : 'gap-0'}`}>
          <div className={`overflow-hidden transition-all duration-700 flex flex-col gap-3  ease-out
             ${isMobileDropdownOpen ? 'max-h-[2000px] opacity-100  p-1' : 'max-h-0 opacity-0 p-0'}
              `}>
            {step == 2 && <GoogleMapsRoute />}
            {step >= 2 && <PickupTripDetails />}
            {step >= 2 && <FeaturesIncluded />}
            {step == 3 && <SelectedCar />}
            {/* {step >= 4 && <PersonalDetails />} */}
            {step == 3 && <FeatureList />}
          </div>
          <div onClick={() => toggleMobileDropdown()} className='bg-primary text-white p-2 rounded-sm font-bold flex items-center justify-between' >
            <div>Ride Details</div>
            {isMobileDropdownOpen ? <ArrowUp /> : <ArrowDown />}
          </div>
        </div>

        {/* Steps Component - Desktop ke liye back button isme rahega */}
        <Steps />

        <div className='grid lg:grid-cols-3 gap-5 w-full'>
          <div className='lg:col-span-2 w-full flex flex-col gap-5'>
            {step === 2 && <CarList />}
            {step === 3 && <Step3 />}
            {/* {step === 4 && <Step4 />} */}
          </div>
          <div className='hidden lg:flex flex-col gap-5 w-full'>
            {step == 2 && <GoogleMapsRoute />}
            {step >= 2 && <PickupTripDetails />}
            {step == 3 && <SelectedCar />}
            {step >= 2 && <FeaturesIncluded />}
            {/* {step >= 4 && <PersonalDetails />} */}
            {step == 3 && <FeatureList />}
          </div>
        </div>


      </div>
    </div>
  )
}

export default Page