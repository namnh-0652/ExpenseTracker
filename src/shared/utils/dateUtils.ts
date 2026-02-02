/**
 * Date Utilities
 * Date formatting and manipulation helpers using date-fns
 */

import {
  format,
  parseISO,
  isValid,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth
} from 'date-fns';

export interface DateRange {
  start: string;
  end: string;
}

/**
 * Format a date to a string
 * @param date - Date object or ISO string
 * @param formatStr - Format string (defaults to 'yyyy-MM-dd')
 * @returns Formatted date string
 */
export function formatDate(date: Date | string, formatStr: string = 'yyyy-MM-dd'): string {
  // If already in YYYY-MM-DD format and default format requested, return as-is
  if (formatStr === 'yyyy-MM-dd' && typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
}

/**
 * Format a date for HTML input[type="date"] (YYYY-MM-DD)
 * @param date - Date object or ISO string
 * @returns Formatted date string YYYY-MM-DD
 */
export function formatDateForInput(date: Date | string): string {
  return formatDate(date, 'yyyy-MM-dd');
}

/**
 * Parse a date string to Date object
 * @param date - Date string (YYYY-MM-DD) or Date object
 * @returns Date object
 */
export function parseDate(date: string | Date): Date {
  if (date instanceof Date) {
    return date;
  }
  return parseISO(date);
}

/**
 * Check if a date is valid
 * @param date - Date to validate
 * @returns true if valid
 */
export function isValidDate(date: string | Date): boolean {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isValid(dateObj);
  } catch {
    return false;
  }
}

/**
 * Get start of day (00:00:00.000)
 * @param date - Date
 * @returns Start of day
 */
export function getStartOfDay(date: string | Date): Date {
  const dateObj = parseDate(date);
  return startOfDay(dateObj);
}

/**
 * Get end of day (23:59:59.999)
 * @param date - Date
 * @returns End of day
 */
export function getEndOfDay(date: string | Date): Date {
  const dateObj = parseDate(date);
  return endOfDay(dateObj);
}

/**
 * Get start of week (Monday)
 * @param date - Date
 * @returns Start of week (Monday)
 */
export function getStartOfWeek(date: string | Date): Date {
  const dateObj = parseDate(date);
  return startOfWeek(dateObj, { weekStartsOn: 1 });  // Monday = 1
}

/**
 * Get end of week (Sunday)
 * @param date - Date
 * @returns End of week (Sunday)
 */
export function getEndOfWeek(date: string | Date): Date {
  const dateObj = parseDate(date);
  return endOfWeek(dateObj, { weekStartsOn: 1 });  // Monday = 1, so Sunday is end
}

/**
 * Get start of month
 * @param date - Date
 * @returns Start of month
 */
export function getStartOfMonth(date: string | Date): Date {
  const dateObj = parseDate(date);
  return startOfMonth(dateObj);
}

/**
 * Get end of month
 * @param date - Date
 * @returns End of month
 */
export function getEndOfMonth(date: string | Date): Date {
  const dateObj = parseDate(date);
  return endOfMonth(dateObj);
}

/**
 * Format a number as currency (2 decimal places)
 * @param amount - Amount to format
 * @returns Formatted amount (e.g., "100.00")
 */
export function formatCurrency(amount: number): string {
  return amount.toFixed(2);
}

/**
 * Get date range for a time period
 * @param type - Period type
 * @param anchorDate - Reference date
 * @returns Date range in YYYY-MM-DD format
 */
export function getDateRangeForPeriod(type: 'day' | 'week' | 'month', anchorDate: string | Date): DateRange {
  const dateObj = parseDate(anchorDate);

  let start, end;

  switch (type) {
    case 'day':
      start = dateObj;
      end = dateObj;
      break;
    case 'week':
      start = getStartOfWeek(dateObj);
      end = getEndOfWeek(dateObj);
      break;
    case 'month':
      start = getStartOfMonth(dateObj);
      end = getEndOfMonth(dateObj);
      break;
    default:
      throw new Error(`Invalid period type: ${type}`);
  }

  return {
    start: formatDate(start),
    end: formatDate(end)
  };
}
