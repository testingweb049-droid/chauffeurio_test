'use client'
import useFormStore from '@/stores/FormStore'
import { useEffect } from 'react'
import { useReferrer } from '../URLHook';
import { getOrderByIdAndSecret } from '@/actions/get-order-by-id-secret';
import { useRouter } from 'next/navigation';

function PaymentProcess({ id }:{id:string}) {
 const { orderId, isOrderDone, paymentURL, loadOrderIntoForm } = useFormStore()
 const { referrer, isExternal, referrerPage } = useReferrer();
 const router = useRouter()

 async function BackFromStrip(){
    const response = await getOrderByIdAndSecret(id)
    if (response?.error || response?.status !== 200 || !response?.order) {
          console.log("not found")
          router.replace('/');
          router.push('/');
          return;
        }
        loadOrderIntoForm(response.order,3)
        router.push('/book-ride');
 }

 console.log('referrer, isExternal, referrerPage ',referrer, isExternal, referrerPage)

useEffect(() => {
 if (isExternal) {
      void BackFromStrip()
      return;
    
  } else {
     if(orderId && isOrderDone && paymentURL && referrerPage  && referrer){
        console.log("redirect to stripe")
        // router.push(paymentURL)
          window.location.href = paymentURL;
          return;
        } else{
            void BackFromStrip()
            return;
        }
  }
}, [referrer, isExternal, referrerPage , orderId, ]);


  return (
    <div className="w-full min-h-[90vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
          <p className="text-gray-700 text-lg font-medium">Preparing your payment...</p>
        </div>
      </div>
  )
}

export default PaymentProcess