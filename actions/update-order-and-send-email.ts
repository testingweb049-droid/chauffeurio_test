'use server';

import { db } from '@/db/drizzle';
import { orders } from '@/db/schema';
import { and, eq} from 'drizzle-orm';
import { render } from '@react-email/components';
import { TripOrderEmailTemplate } from '@/component/emails/BookingEmailTemplate';
import sendEmail from '@/lib/sendEmail'; 

export async function updateOrderId(id: string, secret:string, session_id:string ) {
  try {
    
    const inserted = await db.update(orders).set({payment_status:'paid', session_id}).where(and(eq(orders.id, id), eq(orders.payment_secret, secret))).returning()
    const order = inserted[0];
    
    console.log("update order : ",order)

    if (!order?.id) {
      return { error: 'Order not placed due to backend issue.', status: 500 };
    }
    
     
    // Prepare email
    const orderLink = `https://chauffeurio.com/order/${order.id}`;
    const carImage = `https://chauffeurio.com${order.car_image}`;
    console.log("carImage : ",carImage)
    let dbStops = [{label: 'Pickup Location', value: order.pickup_location}];
    if(order.stops)
        {
        order.stops.map((item, index)=>{
            dbStops.push({label: `Stop ${index+1}`, value:item})
        })
         
        }
        
        if(order.category==='trip' ){
            
            dbStops.push({label:'Dropoff Location', value:order.dropoff_location ?? 'N/A'})
        } else if(order.duration){
            
           dbStops.push({label:'Duration', value:order.duration.toString() ?? 'N/A'})
    }

  

    const htmlEmail = await render(
      TripOrderEmailTemplate({
        carImage,
        stops:dbStops,
        viewOrderLink: orderLink,
      })
    );

    try {
      await sendEmail({
        to: order.email,
        subject: 'Your Chauffeurio Booking Confirmation 🚕',
        html: htmlEmail,
      });
      console.log('Confirmation email sent successfully');
    } catch (emailError) {
        console.log("email error : ",emailError)
      return {
      error: `Email sending failed. Please Take a Screen Shot and Copy the URL and send to us. ${process.env.EMAIL_USER} `,
      status: 500,
    };
    }

    return { order, status: 201, error: '' };
  } catch (error) {
    console.error(' Error creating order:', error);
    return {
      error: 'An error occurred while creating the order.',
      status: 500,
    };
  }
}
