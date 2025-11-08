'use server';

import { db } from '@/db/drizzle';
import { orders } from '@/db/schema';
import { InferInsertModel } from 'drizzle-orm';
import { render } from '@react-email/components';
import { TripOrderEmailTemplate } from '@/component/emails/BookingEmailTemplate';
import sendEmail from '@/lib/sendEmail'; // <-- Use your new email utility

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
    childSeat: string;
    infantSeat: string;
    boosterSeat: string;
    flightTrack: string;
    meetGreet: string;
    description: string;
    extrasTotal: string;
    extraStops: string;
  };
}

type NewOrder = InferInsertModel<typeof orders>;

export async function createOrder(data: OrderDataType) {
  try {
    const orderData: NewOrder = {
      category: String(data.category || 'trip'),
      price: String(data.price || '0'),
      car: String(data.car || ''),
      distance: data.distance ? String(data.distance) : null,
      stops: data.stops,
      pickup_date: data.date ? new Date(data.date) : null,
      pickup_time: String(data.time || ''),
      return_date: data.returnDate ? new Date(data.returnDate) : null,
      return_time: String(data.returnTime || ''),
      is_return: Boolean(data.isReturn),
      pickup_location: String(data.fromLocation || ''),
      dropoff_location: String(data.toLocation || null),
      passengers: Number(data.passengers || 1),
      kids: 0,
      bags: Number(data.bags || 0),
      name: String(data.name || ''),
      email: String(data.email || ''),
      phone: String(data.phone || ''),
      flight_name: data.flightName || null,
      flight_number: data.flightNumber || null,
      is_airport_pickup: Boolean(data.isAirportPickup),
      car_image: data.carImage || null,
      payment_id: data.paymentId || null,
      payment_method: 'card',
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
      extra_stops: data.extras?.extraStops || '0',
      created_at: new Date(),
      updated_at: new Date(),
    };

    // Insert into database
    const inserted = await db.insert(orders).values(orderData).returning();
    const order = inserted[0];

    if (!order?.id) {
      return { error: 'Order not placed due to backend issue.', status: 500 };
    }

    console.log('Order created successfully with ID:', order.id);
    console.log('Customer email:', order.email);

    // Prepare email
    const orderLink = `https://chauffeurio.com/order/${order.id}`;
    const carImage = data.carImage
      ? `https://chauffeurio.com/${data.carImage}`
      : `https://chauffeurio.com/default-car.png`;

    const stops = data.stops.map((item, index) => ({
      label:
        index === 0
          ? 'Pickup Location'
          : data.stops.length - 1 === index
          ? data.category === 'hourly'
            ? 'Duration'
            : 'Dropoff Location'
          : `Stop ${index}`,
      value:
        data.stops.length - 1 === index && data.category === 'hourly'
          ? item + ' hours'
          : item,
    }));

    const htmlEmail = await render(
      TripOrderEmailTemplate({
        carImage,
        stops,
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
    } catch (emailError: any) {
      console.warn('Email sending failed, but order was created successfully');
      console.warn('Email error details:', emailError.message);
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
