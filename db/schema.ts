import {
  timestamp,
  uuid,
  varchar,
  pgTable,
  integer,
  boolean,
  text,
  index,
  numeric,
  jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const orders = pgTable("chauffeurio_order", {
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
  flight_name: varchar("flight_name"),         
  flight_number: varchar("flight_number"),    
  is_airport_pickup: boolean("is_airport_pickup"),
  car_image: varchar("car_image"),           

  payment_id: varchar("payment_id"),
  payment_method: varchar("payment_method"),
  duration: integer("duration"),
  flight_track: boolean("flight_track"),
  meet_greet: boolean("meet_greet"),

  // 🔹 Extras Fields
  child_seat: varchar("child_seat"),
  infant_seat: varchar("infant_seat"),
  booster_seat: varchar("booster_seat"),
  extras_description: text("extras_description"),
  extras_total: varchar("extras_total"),
  extras_flight_track: varchar("extras_flight_track"),
  extras_meet_greet: varchar("extras_meet_greet"),
  extra_stops: varchar("extra_stops"),
  
  payment_status: varchar("payment_status").default('pending').notNull(),
  payment_secret: varchar("payment_secret").notNull(),
  session_id: varchar("session_id"),

  // 🔹 Audit
  updated_at: timestamp("updated_at").defaultNow().notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

// Admin tables
export const admins = pgTable("admins", {
  id: uuid("id").defaultRandom().notNull().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password_hash: varchar("password_hash", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  is_active: boolean("is_active").default(true).notNull(),
  last_login: timestamp("last_login"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  emailIdx: index("admins_email_idx").on(table.email),
}));

export const adminSessions = pgTable("admin_sessions", {
  id: uuid("id").defaultRandom().notNull().primaryKey(),
  admin_id: uuid("admin_id").notNull().references(() => admins.id, { onDelete: "cascade" }),
  token: varchar("token", { length: 255 }).notNull().unique(),
  expires_at: timestamp("expires_at").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  tokenIdx: index("admin_sessions_token_idx").on(table.token),
  adminIdIdx: index("admin_sessions_admin_id_idx").on(table.admin_id),
}));

export const adminLogs = pgTable("admin_logs", {
  id: uuid("id").defaultRandom().notNull().primaryKey(),
  admin_id: uuid("admin_id").references(() => admins.id, { onDelete: "set null" }),
  action: varchar("action", { length: 100 }).notNull(),
  resource: varchar("resource", { length: 100 }),
  details: text("details"),
  ip_address: varchar("ip_address", { length: 45 }),
  created_at: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  adminIdIdx: index("admin_logs_admin_id_idx").on(table.admin_id),
  createdAtIdx: index("admin_logs_created_at_idx").on(table.created_at),
}));

// Relations
export const adminsRelations = relations(admins, ({ many }) => ({
  sessions: many(adminSessions),
  logs: many(adminLogs),
}));

export const adminSessionsRelations = relations(adminSessions, ({ one }) => ({
  admin: one(admins, {
    fields: [adminSessions.admin_id],
    references: [admins.id],
  }),
}));

export const adminLogsRelations = relations(adminLogs, ({ one }) => ({
  admin: one(admins, {
    fields: [adminLogs.admin_id],
    references: [admins.id],
  }),
}));

// Pricing rates table
export const pricingRates = pgTable("pricing_rates", {
  id: uuid("id").defaultRandom().notNull().primaryKey(),
  category: varchar("category", { length: 50 }).notNull().unique(),
  // Store pricing structure as JSON
  // Structure: [{ min: 0, max: 3, type: 'fixed', price: 10 }, { min: 3, max: 5, type: 'fixed', price: 12 }, { min: 5, max: 10, type: 'per_km', price: 2 }, ...]
  pricing_structure: jsonb("pricing_structure").notNull(),
  is_active: boolean("is_active").default(true).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  categoryIdx: index("pricing_rates_category_idx").on(table.category),
}));
