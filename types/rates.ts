export type PricingType = "fixed" | "per_km";

export interface PricingRange {
  min: number;
  max: number | null; // null represents Infinity
  type: PricingType;
  price: number; // Fixed price or price per km
}

export interface PricingRate {
  id: string;
  category: string;
  pricing_structure: PricingRange[];
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreatePricingRateInput {
  category: string;
  pricing_structure: PricingRange[];
}

export interface UpdatePricingRateInput {
  pricing_structure?: PricingRange[];
  is_active?: boolean;
}

