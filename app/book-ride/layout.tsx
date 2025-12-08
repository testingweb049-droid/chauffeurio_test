'use client'
import useFormStore from '@/stores/FormStore'
import React, { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function BookRideLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { step, orderId, paymentURL, isOrderDone } = useFormStore()
  const router = useRouter()
  const pathname = usePathname()

  // Redirect to payment-process when payment is ready (applies to all child routes)
  useEffect(() => {
    if (orderId && paymentURL && isOrderDone) {
      router.push(`/payment-process/${orderId}`);
    }
  }, [orderId, paymentURL, isOrderDone, router])

  // Handle redirects for /book-ride root path (when page.tsx is deleted)
  useEffect(() => {
    if (pathname === '/book-ride') {
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
    }
  }, [pathname, step, router])

  return <>{children}</>
}

