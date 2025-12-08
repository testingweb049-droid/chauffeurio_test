'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useFormStore from '@/stores/FormStore'

export default function BookRideRedirect() {
  const router = useRouter()
  const { step } = useFormStore()

  useEffect(() => {
    // Redirect based on step
    if (step === 1) {
      router.replace('/');
    } else if (step === 2) {
      router.replace('/book-ride/select-vehicle');
    } else if (step === 3) {
      router.replace('/book-ride/passenger-details');
    } else {
      // Default redirect to select-vehicle
      router.replace('/book-ride/select-vehicle');
    }
  }, [step, router])

  // Show loading state while redirecting
  return (
    <div className='w-full min-h-screen bg-slate-50 flex items-center justify-center'>
      <div className='flex flex-col items-center gap-3'>
        <div className='w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin'></div>
        <p className='text-gray-700 text-lg font-medium'>Loading...</p>
      </div>
    </div>
  )
}

