CREATE TABLE "pricing_rates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category" varchar(50) NOT NULL,
	"pricing_structure" jsonb NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "pricing_rates_category_unique" UNIQUE("category")
);
--> statement-breakpoint
CREATE INDEX "pricing_rates_category_idx" ON "pricing_rates" USING btree ("category");