ALTER TABLE "okataxis_orders" ALTER COLUMN "pickup_date" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "okataxis_orders" ALTER COLUMN "pickup_time" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "okataxis_orders" ADD COLUMN "stops" text[];--> statement-breakpoint
ALTER TABLE "okataxis_orders" DROP COLUMN "stop_1";--> statement-breakpoint
ALTER TABLE "okataxis_orders" DROP COLUMN "stop_2";--> statement-breakpoint
ALTER TABLE "okataxis_orders" DROP COLUMN "stop_3";