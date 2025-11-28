'use client'
import useFormStore from '@/stores/FormStore'
import { useEffect } from 'react'
import { getOrderByIdAndSecret } from '@/actions/get-order-by-id-secret';
import { useRouter } from 'next/navigation';

function PaymentProcess({ id }:{id:string}) {
 const { orderId, isOrderDone, paymentURL, loadOrderIntoForm } = useFormStore()
 const router = useRouter()

 async function BackFromStrip(){
    const response = await getOrderByIdAndSecret(id)
     if (response?.status !== 200 || !response?.order) {
          console.log("not found")
          router.push('/');
          return;
        }
        loadOrderIntoForm(response.order,3)
        router.push('/book-ride/passenger-details')
 }


useEffect(() => {

 if(orderId && isOrderDone && paymentURL ){
        console.log("redirect to stripe")
        window.location.href =paymentURL ; 
          return;
        } else{
            void BackFromStrip()
            return;
        }
}, [orderId,isOrderDone,paymentURL ]);


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