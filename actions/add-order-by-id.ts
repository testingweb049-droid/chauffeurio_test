'use server'
import { db } from '@/db/drizzle';
import { orders } from '@/db/schema';
import nodemailer from 'nodemailer';
import { emailConfig } from '@/lib/emailConfig';
import { eq } from 'drizzle-orm';

export async function createOrderById({orderId,clientSecret}:{orderId:string,clientSecret:string}) {
  try {
   if(!clientSecret){
    return { error: 'payment id not found', status: 500 };
   }

   const alreadyDoneOrder = await db.select().from(orders).where(eq(orders.id, orderId))
   console.log("already : ",alreadyDoneOrder)
   if(alreadyDoneOrder[0]?.payment_id ){
    console.log("already done ", alreadyDoneOrder)
      return { data:alreadyDoneOrder[0] , status: 201, error: '' };
   }

    const order = await db.update(orders).set({payment_id:clientSecret}).where(eq(orders.id, orderId)).returning(); 
    if(!order[0] || !order[0].id){
      console.log('order : ',order)
        return { error: 'order not found', status: 500 };
    }
  
   console.log("one")
   const orderLink = `https://chauffeurio.com/order/${orderId}`; 
   console.log("two")
   
   const transporter = nodemailer.createTransport(emailConfig);
   
   console.log("three")
   const mailOptions = {
     from: 'info@chauffeurio.com',
     to: ['info@chauffeurio.com',order[0].email,],
     subject: 'Order Placed Successfully!',
     html: `
     <html lang="en">
     <body style="font-family: Arial, sans-serif; background-color: #f0f4f8; color: #333; padding: 20px">
     <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
     <h1 style="color: #2b6cb0; text-align: center;">Order Placed Successfully</h1>
     <p style="font-size: 16px; text-align: center;">Dear ${order[0].name},</p>
     <p style="font-size: 16px; text-align: center;">Thank you for placing your order with us! Your order has been successfully placed, and we are preparing it for you.</p>
     <p style="font-size: 16px; text-align: center; font-weight: bold; color: #2b6cb0;">
     To view your order details and track its status, click the link below:
     </p>
     <p style="text-align: center;">
     <a href="${orderLink}" style="display: inline-block; background-color: #2b6cb0; color: white; padding: 12px 25px; border-radius: 5px; text-decoration: none; font-size: 16px;">
     View Order
     </a>
     </p>
     <p style="font-size: 14px; text-align: center; color: #777;">If you have any questions or need assistance, feel free to contact us.</p>
     <p style="font-size: 14px; text-align: center; color: #777;">Best regards,<br>OkTaxis</p>
     </div>
     </body>
     </html>
     `,
    };
    console.log("four")

    const {rejected, response} = await transporter.sendMail(mailOptions);
    console.log("response ",response)
    console.log("rejected ",rejected)
    if(rejected.length>0){

      return { order, status: 500, error: 'email not send' };
    }
    return { data:order[0], status: 201, error: '' };
  } catch (error) {
    console.error('Error creating order:', error);
    return { error: 'An error occurred while creating the order.', status: 500 };
  }
}
