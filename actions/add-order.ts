'use server';

import { db } from '@/db/drizzle';
import { orders } from '@/db/schema';
import nodemailer from 'nodemailer';
import { emailConfig } from '@/lib/emailConfig';
import { render } from '@react-email/components';
import { TripOrderEmailTemplate } from '@/component/emails/BookingEmailTemplate';

export interface OrderDataType {
  fromLocation: string;
  toLocation: string;
  stops: string[];
  duration: string;
  distance: number;
  car: string;
  price: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  returnDate: string;
  returnTime: string;
  passengers: string;
  bags: string;
  flightName: string;
  flightNumber: string;
  paymentId: string;
  isAirportPickup: boolean;
  isFlightTrack: boolean;
  isMeetGreet: boolean;
  isReturn: boolean;
  carImage?: string; 
  category: 'hourly' | 'trip';
  extras: {
    childSeat: string,
    infantSeat: string,
    boosterSeat: string,
    flightTrack: string,
    meetGreet: string,
    description: string,
    extrasTotal: string
  }
}

export async function createOrder(data: OrderDataType) {
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
      child_seat: data.extras?.childSeat || '0',
      infant_seat: data.extras?.infantSeat || '0',
      booster_seat: data.extras?.boosterSeat || '0',
      extras_description: data.extras?.description || '',
      extras_total: data.extras?.extrasTotal || '0',
      extras_flight_track: data.extras?.flightTrack || 'no',
      extras_meet_greet: data.extras?.meetGreet || 'no',
    };

    
    const inserted = await db.insert(orders).values(orderData).returning();
    const order = inserted[0];

    if (!order?.id) {
      return { error: 'Order not placed due to backend issue.', status: 500 };
    }

    console.log('Order created successfully with ID:', order.id);
    console.log('Customer email:', order.email);

    // EMAIL SENDING WITH PROPER ERROR IGNORING
    try {
      const orderLink = `https://chauffeurio.com/order/${order.id}`;
      const transporter = nodemailer.createTransport(emailConfig);
      const carImage = `https://chauffeurio.com/order/${data.carImage}`;
      const stops = data.stops.map((item,index)=>({
        label: index===0 ? 'Pickup Location' : 
               data.stops.length-1 === index ? 
                 data.category==='hourly' ? 'Duration' : 'Stop ' + index : 
                 'Dropoff Location', 
        value: data.stops.length-1 === index && data.category==='hourly' ? item + ' hours' : item
      }));
      
      const htmEmail = await render(TripOrderEmailTemplate({carImage, stops, viewOrderLink:orderLink}))

      await transporter.sendMail({
        from: 'info@chauffeurio.com',
        to: [order.email, 'info@chauffeurio.com'],
        subject: 'Your Chauffeurio Booking Confirmation 🚕',
        html: htmEmail,
      });

      console.log('✅ Confirmation email sent successfully');
      
    } catch (emailError: any) {
      console.warn('⚠️ Email sending failed, but order was created successfully');
      console.warn('Email error details:', emailError.message);
    }
    return { 
      order, 
      status: 201, 
      error: '' 
    };
    
  } catch (error) {
    console.error('❌ Error creating order:', error);
    return { 
      error: 'An error occurred while creating the order.', 
      status: 500 
    };
  }
}
