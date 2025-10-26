ALTER TABLE "okataxis_orders" ADD COLUMN "return_date" timestamp;--> statement-breakpoint
ALTER TABLE "okataxis_orders" ADD COLUMN "return_time" varchar;--> statement-breakpoint
ALTER TABLE "okataxis_orders" ADD COLUMN "is_return" boolean;