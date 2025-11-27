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

-- Insert default pricing data for all car categories
-- Structure: 0-3 km fixed, 3-5 km fixed, then per km pricing with 2 euro increments

-- ECONOMY
INSERT INTO "pricing_rates" ("category", "pricing_structure", "is_active")
VALUES (
  'ECONOMY',
  '[
    {"min": 0, "max": 3, "type": "fixed", "price": 10},
    {"min": 3, "max": 5, "type": "fixed", "price": 12},
    {"min": 5, "max": 10, "type": "per_km", "price": 2},
    {"min": 10, "max": 15, "type": "per_km", "price": 4},
    {"min": 15, "max": 20, "type": "per_km", "price": 6},
    {"min": 20, "max": 25, "type": "per_km", "price": 8},
    {"min": 25, "max": 30, "type": "per_km", "price": 10},
    {"min": 30, "max": 35, "type": "per_km", "price": 12},
    {"min": 35, "max": 40, "type": "per_km", "price": 14},
    {"min": 40, "max": 45, "type": "per_km", "price": 16},
    {"min": 45, "max": 50, "type": "per_km", "price": 18},
    {"min": 50, "max": 55, "type": "per_km", "price": 20},
    {"min": 55, "max": 60, "type": "per_km", "price": 22},
    {"min": 60, "max": 65, "type": "per_km", "price": 24},
    {"min": 65, "max": 70, "type": "per_km", "price": 26},
    {"min": 70, "max": 75, "type": "per_km", "price": 28},
    {"min": 75, "max": 80, "type": "per_km", "price": 30},
    {"min": 80, "max": 85, "type": "per_km", "price": 32},
    {"min": 85, "max": 90, "type": "per_km", "price": 34},
    {"min": 90, "max": 95, "type": "per_km", "price": 36},
    {"min": 95, "max": 100, "type": "per_km", "price": 38},
    {"min": 100, "max": null, "type": "per_km", "price": 40}
  ]'::jsonb,
  true
)
ON CONFLICT ("category") DO NOTHING;

-- BUSINESS_SEDAN
INSERT INTO "pricing_rates" ("category", "pricing_structure", "is_active")
VALUES (
  'BUSINESS_SEDAN',
  '[
    {"min": 0, "max": 3, "type": "fixed", "price": 15},
    {"min": 3, "max": 5, "type": "fixed", "price": 18},
    {"min": 5, "max": 10, "type": "per_km", "price": 3},
    {"min": 10, "max": 15, "type": "per_km", "price": 5},
    {"min": 15, "max": 20, "type": "per_km", "price": 7},
    {"min": 20, "max": 25, "type": "per_km", "price": 9},
    {"min": 25, "max": 30, "type": "per_km", "price": 11},
    {"min": 30, "max": 35, "type": "per_km", "price": 13},
    {"min": 35, "max": 40, "type": "per_km", "price": 15},
    {"min": 40, "max": 45, "type": "per_km", "price": 17},
    {"min": 45, "max": 50, "type": "per_km", "price": 19},
    {"min": 50, "max": 55, "type": "per_km", "price": 21},
    {"min": 55, "max": 60, "type": "per_km", "price": 23},
    {"min": 60, "max": 65, "type": "per_km", "price": 25},
    {"min": 65, "max": 70, "type": "per_km", "price": 27},
    {"min": 70, "max": 75, "type": "per_km", "price": 29},
    {"min": 75, "max": 80, "type": "per_km", "price": 31},
    {"min": 80, "max": 85, "type": "per_km", "price": 33},
    {"min": 85, "max": 90, "type": "per_km", "price": 35},
    {"min": 90, "max": 95, "type": "per_km", "price": 37},
    {"min": 95, "max": 100, "type": "per_km", "price": 39},
    {"min": 100, "max": null, "type": "per_km", "price": 41}
  ]'::jsonb,
  true
)
ON CONFLICT ("category") DO NOTHING;

-- ECONOMY_VAN
INSERT INTO "pricing_rates" ("category", "pricing_structure", "is_active")
VALUES (
  'ECONOMY_VAN',
  '[
    {"min": 0, "max": 3, "type": "fixed", "price": 18},
    {"min": 3, "max": 5, "type": "fixed", "price": 22},
    {"min": 5, "max": 10, "type": "per_km", "price": 4},
    {"min": 10, "max": 15, "type": "per_km", "price": 6},
    {"min": 15, "max": 20, "type": "per_km", "price": 8},
    {"min": 20, "max": 25, "type": "per_km", "price": 10},
    {"min": 25, "max": 30, "type": "per_km", "price": 12},
    {"min": 30, "max": 35, "type": "per_km", "price": 14},
    {"min": 35, "max": 40, "type": "per_km", "price": 16},
    {"min": 40, "max": 45, "type": "per_km", "price": 18},
    {"min": 45, "max": 50, "type": "per_km", "price": 20},
    {"min": 50, "max": 55, "type": "per_km", "price": 22},
    {"min": 55, "max": 60, "type": "per_km", "price": 24},
    {"min": 60, "max": 65, "type": "per_km", "price": 26},
    {"min": 65, "max": 70, "type": "per_km", "price": 28},
    {"min": 70, "max": 75, "type": "per_km", "price": 30},
    {"min": 75, "max": 80, "type": "per_km", "price": 32},
    {"min": 80, "max": 85, "type": "per_km", "price": 34},
    {"min": 85, "max": 90, "type": "per_km", "price": 36},
    {"min": 90, "max": 95, "type": "per_km", "price": 38},
    {"min": 95, "max": 100, "type": "per_km", "price": 40},
    {"min": 100, "max": null, "type": "per_km", "price": 42}
  ]'::jsonb,
  true
)
ON CONFLICT ("category") DO NOTHING;

-- BUSINESS_VAN
INSERT INTO "pricing_rates" ("category", "pricing_structure", "is_active")
VALUES (
  'BUSINESS_VAN',
  '[
    {"min": 0, "max": 3, "type": "fixed", "price": 30},
    {"min": 3, "max": 5, "type": "fixed", "price": 35},
    {"min": 5, "max": 10, "type": "per_km", "price": 7},
    {"min": 10, "max": 15, "type": "per_km", "price": 9},
    {"min": 15, "max": 20, "type": "per_km", "price": 11},
    {"min": 20, "max": 25, "type": "per_km", "price": 13},
    {"min": 25, "max": 30, "type": "per_km", "price": 15},
    {"min": 30, "max": 35, "type": "per_km", "price": 17},
    {"min": 35, "max": 40, "type": "per_km", "price": 19},
    {"min": 40, "max": 45, "type": "per_km", "price": 21},
    {"min": 45, "max": 50, "type": "per_km", "price": 23},
    {"min": 50, "max": 55, "type": "per_km", "price": 25},
    {"min": 55, "max": 60, "type": "per_km", "price": 27},
    {"min": 60, "max": 65, "type": "per_km", "price": 29},
    {"min": 65, "max": 70, "type": "per_km", "price": 31},
    {"min": 70, "max": 75, "type": "per_km", "price": 33},
    {"min": 75, "max": 80, "type": "per_km", "price": 35},
    {"min": 80, "max": 85, "type": "per_km", "price": 37},
    {"min": 85, "max": 90, "type": "per_km", "price": 39},
    {"min": 90, "max": 95, "type": "per_km", "price": 41},
    {"min": 95, "max": 100, "type": "per_km", "price": 43},
    {"min": 100, "max": null, "type": "per_km", "price": 45}
  ]'::jsonb,
  true
)
ON CONFLICT ("category") DO NOTHING;

-- MINIBUS_12
INSERT INTO "pricing_rates" ("category", "pricing_structure", "is_active")
VALUES (
  'MINIBUS_12',
  '[
    {"min": 0, "max": 3, "type": "fixed", "price": 40},
    {"min": 3, "max": 5, "type": "fixed", "price": 45},
    {"min": 5, "max": 10, "type": "per_km", "price": 9},
    {"min": 10, "max": 15, "type": "per_km", "price": 11},
    {"min": 15, "max": 20, "type": "per_km", "price": 13},
    {"min": 20, "max": 25, "type": "per_km", "price": 15},
    {"min": 25, "max": 30, "type": "per_km", "price": 17},
    {"min": 30, "max": 35, "type": "per_km", "price": 19},
    {"min": 35, "max": 40, "type": "per_km", "price": 21},
    {"min": 40, "max": 45, "type": "per_km", "price": 23},
    {"min": 45, "max": 50, "type": "per_km", "price": 25},
    {"min": 50, "max": 55, "type": "per_km", "price": 27},
    {"min": 55, "max": 60, "type": "per_km", "price": 29},
    {"min": 60, "max": 65, "type": "per_km", "price": 31},
    {"min": 65, "max": 70, "type": "per_km", "price": 33},
    {"min": 70, "max": 75, "type": "per_km", "price": 35},
    {"min": 75, "max": 80, "type": "per_km", "price": 37},
    {"min": 80, "max": 85, "type": "per_km", "price": 39},
    {"min": 85, "max": 90, "type": "per_km", "price": 41},
    {"min": 90, "max": 95, "type": "per_km", "price": 43},
    {"min": 95, "max": 100, "type": "per_km", "price": 45},
    {"min": 100, "max": null, "type": "per_km", "price": 47}
  ]'::jsonb,
  true
)
ON CONFLICT ("category") DO NOTHING;

-- MINIBUS_16
INSERT INTO "pricing_rates" ("category", "pricing_structure", "is_active")
VALUES (
  'MINIBUS_16',
  '[
    {"min": 0, "max": 3, "type": "fixed", "price": 50},
    {"min": 3, "max": 5, "type": "fixed", "price": 55},
    {"min": 5, "max": 10, "type": "per_km", "price": 11},
    {"min": 10, "max": 15, "type": "per_km", "price": 13},
    {"min": 15, "max": 20, "type": "per_km", "price": 15},
    {"min": 20, "max": 25, "type": "per_km", "price": 17},
    {"min": 25, "max": 30, "type": "per_km", "price": 19},
    {"min": 30, "max": 35, "type": "per_km", "price": 21},
    {"min": 35, "max": 40, "type": "per_km", "price": 23},
    {"min": 40, "max": 45, "type": "per_km", "price": 25},
    {"min": 45, "max": 50, "type": "per_km", "price": 27},
    {"min": 50, "max": 55, "type": "per_km", "price": 29},
    {"min": 55, "max": 60, "type": "per_km", "price": 31},
    {"min": 60, "max": 65, "type": "per_km", "price": 33},
    {"min": 65, "max": 70, "type": "per_km", "price": 35},
    {"min": 70, "max": 75, "type": "per_km", "price": 37},
    {"min": 75, "max": 80, "type": "per_km", "price": 39},
    {"min": 80, "max": 85, "type": "per_km", "price": 41},
    {"min": 85, "max": 90, "type": "per_km", "price": 43},
    {"min": 90, "max": 95, "type": "per_km", "price": 45},
    {"min": 95, "max": 100, "type": "per_km", "price": 47},
    {"min": 100, "max": null, "type": "per_km", "price": 49}
  ]'::jsonb,
  true
)
ON CONFLICT ("category") DO NOTHING;

