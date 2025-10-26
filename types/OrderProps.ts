export interface OrderProps {
  id: string;
  category: string;
  price: string;
  car: string;
  distance: string | null;
  stops: string[] | null;
  pickup_date: Date | null;
  pickup_time: string | null;
  dropoff_location: string | null;
  pickup_location: string;
  duration?: number | null;
  is_return?: boolean | null;
  return_date?: Date | null;
  return_time?: string | null;
  name: string;
  email: string;
  phone: string;
  flight?: string | null;
  flight_track?: boolean | null;
  meet_greet?: boolean | null;
  payment_method: string | null;

  created_at: Date;
}
