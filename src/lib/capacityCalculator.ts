/**
 * Childminder capacity calculator
 * Based on Ofsted regulations and standard ratios
 */

export interface CapacityRatios {
  totalAdults: number;
  maxUnder1: number;
  maxUnder5: number;
  maxUnder8: number;
}

export interface ProposedNumbers {
  under1?: number;
  under5?: number;
  age5to8?: number;
  age8plus?: number;
}

export interface CapacityValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  totalUnder5: number;
  totalUnder8: number;
}

/**
 * Calculate maximum capacity based on number of adults
 * Standard Ofsted ratios:
 * - 1 child under 1 per adult
 * - 3 children under 5 per adult (including those under 1)
 * - Maximum 6 children under 8 in total
 */
export function calculateCapacityRatios(
  workWithOthers: "Yes" | "No" | undefined,
  numberOfAssistants: number = 0
): CapacityRatios {
  const totalAdults = workWithOthers === "Yes" ? 1 + numberOfAssistants : 1;
  
  return {
    totalAdults,
    maxUnder1: totalAdults * 1,
    maxUnder5: totalAdults * 3,
    maxUnder8: 6, // Fixed maximum regardless of adults
  };
}

/**
 * Validate proposed numbers against capacity limits
 */
export function validateCapacity(
  proposed: ProposedNumbers,
  ratios: CapacityRatios
): CapacityValidation {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  const under1 = proposed.under1 || 0;
  const under5 = proposed.under5 || 0;
  const age5to8 = proposed.age5to8 || 0;
  const age8plus = proposed.age8plus || 0;

  // Calculate totals
  const totalUnder5 = under1 + under5;
  const totalUnder8 = under1 + under5 + age5to8;

  // Validation: Children under 1
  if (under1 > ratios.maxUnder1) {
    errors.push(
      `Children under 1 year exceeds limit. Maximum: ${ratios.maxUnder1}, Proposed: ${under1}`
    );
  }

  // Validation: Children under 5 (including under 1)
  if (totalUnder5 > ratios.maxUnder5) {
    errors.push(
      `Total children under 5 years exceeds limit. Maximum: ${ratios.maxUnder5}, Proposed: ${totalUnder5}`
    );
  }

  // Validation: Children under 8 (fixed maximum)
  if (totalUnder8 > ratios.maxUnder8) {
    errors.push(
      `Total children under 8 years exceeds limit. Maximum: ${ratios.maxUnder8}, Proposed: ${totalUnder8}`
    );
  }

  // Warnings for high numbers
  if (totalUnder5 === ratios.maxUnder5 && totalUnder5 > 0) {
    warnings.push(
      "You are proposing the maximum number of children under 5 years"
    );
  }

  if (totalUnder8 === ratios.maxUnder8 && totalUnder8 > 0) {
    warnings.push(
      "You are proposing the maximum number of children under 8 years"
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    totalUnder5,
    totalUnder8,
  };
}

/**
 * Get capacity guidance text
 */
export function getCapacityGuidanceText(ratios: CapacityRatios): string[] {
  return [
    `Maximum ${ratios.maxUnder1} child${ratios.maxUnder1 !== 1 ? "ren" : ""} under 1 year`,
    `Maximum ${ratios.maxUnder5} children under 5 years (including those under 1)`,
    `Maximum ${ratios.maxUnder8} children under 8 years in total`,
    `You are working with ${ratios.totalAdults} adult${ratios.totalAdults > 1 ? "s" : ""}`,
  ];
}
