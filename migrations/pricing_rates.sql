-- Create pricing_rates table
CREATE TABLE IF NOT EXISTS "pricing_rates" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "category" varchar(50) NOT NULL UNIQUE,
  "pricing_structure" jsonb NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

-- Create index on category
CREATE INDEX IF NOT EXISTS "pricing_rates_category_idx" ON "pricing_rates" ("category");

-- Example pricing structure format:
-- [
--   { "min": 0, "max": 3, "type": "fixed", "price": 10 },
--   { "min": 3, "max": 5, "type": "fixed", "price": 12 },
--   { "min": 5, "max": 10, "type": "per_km", "price": 2 },
--   { "min": 10, "max": 15, "type": "per_km", "price": 3 },
--   { "min": 15, "max": 20, "type": "per_km", "price": 5 },
--   { "min": 20, "max": 30, "type": "per_km", "price": 7 },
--   { "min": 30, "max": 50, "type": "per_km", "price": 9 },
--   { "min": 50, "max": 75, "type": "per_km", "price": 11 },
--   { "min": 75, "max": 100, "type": "per_km", "price": 13 }
-- ]

