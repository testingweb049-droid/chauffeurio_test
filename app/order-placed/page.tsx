import { Suspense } from 'react'
import OrderPlacedPage from './OrderPlacedPage'

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-[60vh] text-gray-600 text-lg animate-pulse">
          Loading your order...
        </div>
      }
    >
      <OrderPlacedPage />
    </Suspense>
  )
}
