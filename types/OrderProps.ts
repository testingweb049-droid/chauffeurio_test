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

export interface OrderReturnType {
  id: string

  // 🔹 Basic booking details
  category: string
  price: string
  car: string
  distance?: string | null
  stops?: string[] | null

  // 🔹 Trip & timing info
  pickup_date?: Date | null
  pickup_time?: string | null
  return_date?: Date | null
  return_time?: string | null
  is_return?: boolean | null

  // 🔹 Locations
  pickup_location: string
  dropoff_location?: string | null

  // 🔹 Passenger details
  passengers: number
  kids: number
  bags: number

  // 🔹 Contact info
  name: string
  email: string
  phone: string

  // 🔹 Flight & payment
  flight_name?: string | null
  flight_number?: string | null
  is_airport_pickup?: boolean | null
  car_image?: string | null

  payment_id?: string | null
  payment_method?: string | null
  duration?: number | null
  flight_track?: boolean | null
  meet_greet?: boolean | null

  // 🔹 Extras Fields
  child_seat?: string | null
  infant_seat?: string | null
  booster_seat?: string | null
  extras_description?: string | null
  extras_total?: string | null
  extras_flight_track?: string | null
  extras_meet_greet?: string | null
  extra_stops?: string | null

  // 🔹 Payment details
  payment_status?: string | null
  payment_secret?: string | null
  session_id?: string | null

  // 🔹 Audit
  updated_at: Date
  created_at: Date
}
