import { PricingRange } from "@/types/rates";

/**
 * Calculate price based on distance and pricing structure
 * Handles fixed prices and per_km pricing with proper range calculations
 * 
 * Pricing structure example:
 * - 0-3 km: fixed €10
 * - 3-5 km: fixed €12
 * - 15-20 km: €3/km
 * 
 * Example calculation for 18 km:
 * - Distance falls in 15-20 km range with rate €3/km
 * - Price = 18 * 3 = €54
 * 
 * For per_km ranges: The ENTIRE distance is multiplied by the rate of the matching range
 * For fixed ranges: The fixed price is applied if distance falls within that range
 */
export function calculatePriceFromRates(
  distance: number,
  pricingStructure: PricingRange[]
): number {
  if (distance <= 0 || !pricingStructure || pricingStructure.length === 0) {
    return 0;
  }

  // Sort ranges by min to ensure proper order
  const sortedRanges = [...pricingStructure].sort((a, b) => a.min - b.min);

  // Find the range that contains this distance
  for (const range of sortedRanges) {
    const rangeMin = range.min;
    const rangeMax = range.max === null || range.max === Infinity ? Infinity : range.max;

    // Check if distance falls within this range
    // For inclusive boundaries: distance > min and distance <= max
    if (distance > rangeMin && distance <= rangeMax) {
      if (range.type === "fixed") {
        // Fixed price: return the fixed price for this range
        const price = Math.round(range.price * 100) / 100;
        if (process.env.NODE_ENV === 'development') {
          console.log(`📊 Pricing: Distance ${distance}km falls in fixed range ${rangeMin}-${rangeMax === Infinity ? '∞' : rangeMax}km, price: €${price}`);
        }
        return price;
      } else {
        // Per kilometer pricing: multiply ENTIRE distance by the rate
        // Example: 18 km in 15-20 km range with rate 3 = 18 * 3 = 54
        const price = Math.round(distance * range.price * 100) / 100;
        if (process.env.NODE_ENV === 'development') {
          console.log(`📊 Pricing: Distance ${distance}km falls in per_km range ${rangeMin}-${rangeMax === Infinity ? '∞' : rangeMax}km (rate: €${range.price}/km), price: ${distance} × ${range.price} = €${price}`);
        }
        return price;
      }
    }
  }

  // If no range matches, find the highest range and use it (for distances beyond all ranges)
  const lastRange = sortedRanges[sortedRanges.length - 1];
  if (lastRange) {
    if (lastRange.type === "fixed") {
      return Math.round(lastRange.price * 100) / 100;
    } else {
      // For per_km, multiply entire distance by the rate
      return Math.round(distance * lastRange.price * 100) / 100;
    }
  }

  return 0;
}

/**
 * Get pricing structure for a category from API
 * Uses public API endpoint (no authentication required)
 */
export async function getPricingRates(category: string): Promise<PricingRange[] | null> {
  try {
    const response = await fetch(`/api/rates/${encodeURIComponent(category)}`);
    const result = await response.json();

    if (result.success && result.data) {
      // Convert null max values to Infinity for easier handling
      const structure = result.data.pricing_structure as PricingRange[];
      return structure.map(range => ({
        ...range,
        max: range.max === null ? Infinity : range.max
      }));
    }
    return null;
  } catch (error) {
    console.error("Error fetching pricing rates:", error);
    return null;
  }
}
