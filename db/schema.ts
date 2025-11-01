import {
  timestamp,
  uuid,
  varchar,
  pgTable,
  integer,
  boolean,
  text,
} from "drizzle-orm/pg-core";

export const orders = pgTable("chauffeurio_orders", {
  id: uuid("id").defaultRandom().notNull().primaryKey(),

  // 🔹 Basic booking details
  category: varchar("category").notNull(),
  price: varchar("price").notNull(),
  car: varchar("car").notNull(),
  distance: varchar("distance"),
  stops: text("stops").array(),

  // 🔹 Trip & timing info
  pickup_date: timestamp("pickup_date"),
  pickup_time: varchar("pickup_time"),
  return_date: timestamp("return_date"),
  return_time: varchar("return_time"),
  is_return: boolean("is_return"),

  // 🔹 Locations
  pickup_location: varchar("pickup_location").notNull(),
  dropoff_location: varchar("dropoff_location"),

  // 🔹 Passenger details
  passengers: integer("passengers").notNull(),
  kids: integer("kids").notNull(),
  bags: integer("bags").notNull(),

  // 🔹 Contact info
  name: varchar("name").notNull(),
  email: varchar("email").notNull(),
  phone: varchar("phone").notNull(),

  // 🔹 Flight & payment
  flight: varchar("flight"),
  payment_id: varchar("payment_id"),
  payment_method: varchar("payment_method"),
  duration: integer("duration"),
  flight_track: boolean("flight_track"),
  meet_greet: boolean("meet_greet"),

  // 🔹 New Extras Fields
  child_seat: varchar("child_seat"),        // e.g. "2" seats
  infant_seat: varchar("infant_seat"),      // e.g. "1" seat
  booster_seat: varchar("booster_seat"),    // e.g. "0"
  extras_description: text("extras_description"), // optional text
  extras_total: varchar("extras_total"),    // total extra price as string
  extras_flight_track: varchar("extras_flight_track"), // "yes"/"no" from frontend
  extras_meet_greet: varchar("extras_meet_greet"),     // "yes"/"no"

  // 🔹 Audit
  updated_at: timestamp("updated_at").defaultNow().notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});
