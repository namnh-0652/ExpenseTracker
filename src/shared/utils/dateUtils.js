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

/**
 * Format a date to YYYY-MM-DD string
 * @param {Date|string} date - Date object or ISO string
 * @returns {string} Formatted date string YYYY-MM-DD
 */
export function formatDate(date) {
  // If already in YYYY-MM-DD format, return as-is
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'yyyy-MM-dd');
}

/**
 * Parse a date string to Date object
 * @param {string|Date} date - Date string (YYYY-MM-DD) or Date object
 * @returns {Date} Date object
 */
export function parseDate(date) {
  if (date instanceof Date) {
    return date;
  }
  return parseISO(date);
}

/**
 * Check if a date is valid
 * @param {string|Date} date - Date to validate
 * @returns {boolean} true if valid
 */
export function isValidDate(date) {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isValid(dateObj);
  } catch {
    return false;
  }
}

/**
 * Get start of day (00:00:00.000)
 * @param {string|Date} date - Date
 * @returns {Date} Start of day
 */
export function getStartOfDay(date) {
  const dateObj = parseDate(date);
  return startOfDay(dateObj);
}

/**
 * Get end of day (23:59:59.999)
 * @param {string|Date} date - Date
 * @returns {Date} End of day
 */
export function getEndOfDay(date) {
  const dateObj = parseDate(date);
  return endOfDay(dateObj);
}

/**
 * Get start of week (Monday)
 * @param {string|Date} date - Date
 * @returns {Date} Start of week (Monday)
 */
export function getStartOfWeek(date) {
  const dateObj = parseDate(date);
  return startOfWeek(dateObj, { weekStartsOn: 1 });  // Monday = 1
}

/**
 * Get end of week (Sunday)
 * @param {string|Date} date - Date
 * @returns {Date} End of week (Sunday)
 */
export function getEndOfWeek(date) {
  const dateObj = parseDate(date);
  return endOfWeek(dateObj, { weekStartsOn: 1 });  // Monday = 1, so Sunday is end
}

/**
 * Get start of month
 * @param {string|Date} date - Date
 * @returns {Date} Start of month
 */
export function getStartOfMonth(date) {
  const dateObj = parseDate(date);
  return startOfMonth(dateObj);
}

/**
 * Get end of month
 * @param {string|Date} date - Date
 * @returns {Date} End of month
 */
export function getEndOfMonth(date) {
  const dateObj = parseDate(date);
  return endOfMonth(dateObj);
}

/**
 * Format a number as currency (2 decimal places)
 * @param {number} amount - Amount to format
 * @returns {string} Formatted amount (e.g., "100.00")
 */
export function formatCurrency(amount) {
  return amount.toFixed(2);
}

/**
 * Get date range for a time period
 * @param {'day'|'week'|'month'} type - Period type
 * @param {string|Date} anchorDate - Reference date
 * @returns {{start: string, end: string}} Date range in YYYY-MM-DD format
 */
export function getDateRangeForPeriod(type, anchorDate) {
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
