ALTER TABLE "chauffeurio_orders" RENAME COLUMN "flight" TO "flight_name";--> statement-breakpoint
ALTER TABLE "chauffeurio_orders" ADD COLUMN "flight_number" varchar;--> statement-breakpoint
ALTER TABLE "chauffeurio_orders" ADD COLUMN "is_airport_pickup" boolean;--> statement-breakpoint
ALTER TABLE "chauffeurio_orders" ADD COLUMN "car_image" varchar;