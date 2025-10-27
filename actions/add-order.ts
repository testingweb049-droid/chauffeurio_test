'use server';

import { db } from '@/db/drizzle';
import { orders } from '@/db/schema';
import nodemailer from 'nodemailer';
import { emailConfig } from '@/lib/emailConfig';

interface FrontendOrderData {
  [key: string]: any;
}

export async function createOrder(data: FrontendOrderData) {
  try {
   
    const orderData = {
      category: String(data.category || 'trip'),
      price: String(data.price || '0'),
      car: String(data.car || ''),
      distance: data.distance ? String(data.distance) : null,
      stops: data.stops,
      pickup_date: data.date ? new Date(data.date) : null,
      pickup_time: String(data.time || ''),
      return_date: data.returnDate ? new Date(data.returnDate) : null,
      return_time: String(data.returnTime || ''),
      is_return: Boolean(data.returnDate || data.returnTime),

      pickup_location: String(data.fromLocation || ''),
      dropoff_location: String(data.toLocation || null),

      passengers: Number(data.passengers || 1),
      kids: 0, // can be updated later if added to frontend
      bags: Number(data.bags || 0),

      name: String(data.name || ''),
      email: String(data.email || ''),
      phone: String(data.phone || ''),

      flight: data.flightName || data.flightNumber || null,
      payment_id: data.paymentId || null,
      payment_method: 'card', // default or from frontend if applicable
      duration: data.duration ? parseInt(data.duration, 10) : null,

      flight_track: Boolean(data.isFlightTrack),
      meet_greet: Boolean(data.isMeetGreet),
    };

    
    const inserted = await db.insert(orders).values(orderData).returning();
    const order = inserted[0];

    if (!order?.id) {
      return { error: 'Order not placed due to backend issue.', status: 500 };
    }

    // ✅ Email setup
    const orderLink = `https://chauffeurio.com/order/${order.id}`;
    const transporter = nodemailer.createTransport(emailConfig);

    await transporter.sendMail({
      from: 'reservation@oktaxis.co.uk',
      to: [order.email, 'reservation@oktaxis.co.uk'],
      subject: 'Your OKTaxis Booking Confirmation 🚕',
      html: `
        <html lang="en">
          <body style="font-family: 'Segoe UI', sans-serif; background: #f9fafb; padding: 0; margin: 0;">
            <div style="max-width: 600px; margin: 40px auto; background: #fff; border-radius: 12px; box-shadow: 0 5px 15px rgba(0,0,0,0.08); overflow: hidden;">
              <div style="background: #000; color: #fff; padding: 25px; text-align: center;">
                <h2 style="color: #F7931E;">Booking Confirmed!</h2>
                <p>Thank you for choosing OKTaxis</p>
              </div>
              <div style="padding: 25px;">
                <p>Dear <strong>${order.name}</strong>,</p>
                <p>Your booking has been successfully placed. Below are your details:</p>
                <ul style="line-height: 1.7; color: #333;">
                  <li><strong>Pickup:</strong> ${order.pickup_location}</li>
                  <li><strong>Dropoff:</strong> ${order.dropoff_location ?? '-'}</li>
                  <li><strong>Date:</strong> ${order.pickup_date?.toLocaleDateString() || '-'}</li>
                  <li><strong>Time:</strong> ${order.pickup_time}</li>
                  <li><strong>Car:</strong> ${order.car}</li>
                  <li><strong>Price:</strong> £${order.price}</li>
                </ul>
                <div style="text-align: center; margin-top: 25px;">
                  <a href="${orderLink}" style="background: #F7931E; color: #fff; padding: 12px 20px; border-radius: 6px; text-decoration: none;">View Your Booking</a>
                </div>
                <p style="margin-top: 30px; color: #555; font-size: 14px;">
                  For assistance, contact us at 
                  <a href="mailto:reservation@oktaxis.co.uk" style="color: #F7931E;">reservation@oktaxis.co.uk</a>.
                </p>
              </div>
              <div style="background: #f3f4f6; padding: 15px; text-align: center; font-size: 13px; color: #777;">
                © ${new Date().getFullYear()} OKTaxis. All rights reserved.
              </div>
            </div>
          </body>
        </html>
      `,
    });

    return { order, status: 201, error: '' };
  } catch (error) {
    console.error('Error creating order:', error);
    return { error: 'An error occurred while creating the order.', status: 500 };
  }
}
