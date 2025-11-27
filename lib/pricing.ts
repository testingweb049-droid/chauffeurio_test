import { PricingRange } from "@/types/rates";

/**
 * Calculate price based on distance and pricing structure
 * Handles fixed prices and per_km pricing with proper range calculations
 * 
 * Pricing structure example:
 * - 0-3 km: fixed €10
 * - 3-5 km: fixed €12
 * - 5-10 km: €2/km
 * - 10-15 km: €4/km
 * - etc.
 * 
 * Example calculation for 12 km:
 * - 0-3 km: fixed €10 (not applicable, distance > 3)
 * - 3-5 km: fixed €12 (not applicable, distance > 5)
 * - 5-10 km: (10-5) * €2 = €10
 * - 10-15 km: (12-10) * €4 = €8
 * - Total: €18
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

  // Find the infinity range (100+ km range)
  const infinityRange = sortedRanges.find(
    (r) => r.max === null || r.max === Infinity
  );

  // If distance is above the infinity range minimum (100 km), use infinity price for ENTIRE distance
  if (infinityRange && distance > infinityRange.min && infinityRange.type === "per_km") {
    return Math.round(distance * infinityRange.price * 100) / 100;
  }

  // For distances <= 100 km, calculate using normal range logic
  let totalPrice = 0;
  let distanceCovered = 0;

  for (const range of sortedRanges) {
    if (distanceCovered >= distance) break;

    const rangeMin = range.min;
    const rangeMax = range.max === null || range.max === Infinity ? Infinity : range.max;

    // Skip ranges that don't apply (distance hasn't reached this range yet)
    if (distance <= rangeMin) {
      continue;
    }

    if (range.type === "fixed") {
      // Fixed price: if distance falls within this range (inclusive boundaries), apply fixed price and we're done
      // For 0-3 km: distance must be > 0 and <= 3 (so 1, 2, 3 km all get €10)
      // For 3-5 km: distance must be > 3 and <= 5 (so 4, 5 km get €12)
      if (distance > rangeMin && distance <= rangeMax) {
        totalPrice = range.price;
        distanceCovered = distance;
        break;
      }
      // Distance exceeds this fixed range, continue to next range
      continue;
    } else {
      // Per kilometer pricing
      // Calculate the effective range considering what we've already covered
      const effectiveRangeMin = Math.max(rangeMin, distanceCovered);
      const effectiveRangeMax = Math.min(rangeMax, distance);

      if (effectiveRangeMax > effectiveRangeMin) {
        const distanceInRange = effectiveRangeMax - effectiveRangeMin;
        totalPrice += distanceInRange * range.price;
        distanceCovered = effectiveRangeMax;
      }

      // If we've covered all the distance, we're done
      if (distanceCovered >= distance) {
        break;
      }
    }
  }

  return Math.round(totalPrice * 100) / 100; // Round to 2 decimal places
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
