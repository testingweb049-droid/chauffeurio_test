import { Suspense } from "react"
import PaymentSuccessPage from "./ClientPage"

export default function PageWrapper() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <PaymentSuccessPage />
    </Suspense>
  )
}
