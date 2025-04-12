
// Fine calculation utilities for attendance shortfall

// Default fine rate per percentage point below target
const DEFAULT_FINE_RATE = 400;

/**
 * Calculate the fine amount based on attendance shortfall
 * @param currentAttendance The current attendance percentage
 * @param targetAttendance The target attendance percentage
 * @param fineRate The fine rate per percentage point (default: ₹400)
 * @returns Object containing fine details or null if no fine is applicable
 */
export const calculateAttendanceFine = (
  currentAttendance: number,
  targetAttendance: number,
  fineRate: number = DEFAULT_FINE_RATE
): { amount: number; shortfall: number } | null => {
  // Only calculate fine if attendance is below target
  if (currentAttendance >= targetAttendance) {
    return null;
  }
  
  // Calculate shortfall (rounded to 1 decimal place)
  const shortfall = parseFloat((targetAttendance - currentAttendance).toFixed(1));
  
  // Calculate fine amount
  const fineAmount = Math.round(shortfall * fineRate);
  
  return {
    amount: fineAmount,
    shortfall: shortfall
  };
};

/**
 * Format a fine amount as Indian Rupees
 * @param amount The amount to format
 * @returns Formatted string with ₹ symbol
 */
export const formatFineAmount = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN')}`;
};
