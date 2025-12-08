import { z } from "zod";

export const pricingRangeSchema = z.object({
  min: z.number().min(0),
  max: z.number().min(0).nullable(), // Allow null for Infinity
  type: z.enum(["fixed", "per_km"]),
  price: z.number().min(0),
});

export const createPricingRateSchema = z.object({
  category: z.string().min(1),
  pricing_structure: z.array(pricingRangeSchema).min(1),
});

export const updatePricingRateSchema = z.object({
  pricing_structure: z.array(pricingRangeSchema).min(1).optional(),
  is_active: z.boolean().optional(),
});

