'use server';

import { db } from '@/db/drizzle';
import { orders } from '@/db/schema';
import { and, eq} from 'drizzle-orm';


export async function getOrderByIdAndSecret(id: string, secret?:string ) {
  try {
    
    const inserted = secret ? await db.select().from(orders).where(and(eq(orders.id, id), eq(orders.payment_secret, secret), eq(orders.payment_status, 'pending'))) : await db.select().from(orders).where(and(eq(orders.id, id), eq(orders.payment_status, 'pending')));
    const order = inserted[0];

    if (!order?.id) {
      return { error: 'Order not placed due to backend issue.', status: 500 };
    }
     

    console.log("order : ",order)
     
    return { order, status: 200, error: '' };
  } catch (error) {
    console.error(' Error creating order:', error);
    return {
      error: 'An error occurred while creating the order.',
      status: 500,
    };
  }
}
