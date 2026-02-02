import { describe, it, expect } from 'vitest';
import {
  formatDate,
  parseDate,
  isValidDate,
  getStartOfDay,
  getEndOfDay,
  getStartOfWeek,
  getEndOfWeek,
  getStartOfMonth,
  getEndOfMonth,
  formatCurrency,
  getDateRangeForPeriod
} from '../../../src/shared/utils/dateUtils.js';

describe('dateUtils', () => {
  describe('formatDate', () => {
    it('formats Date objects to YYYY-MM-DD', () => {
      const date = new Date('2026-01-30T10:30:00');
      expect(formatDate(date)).toBe('2026-01-30');
    });

    it('formats ISO strings to YYYY-MM-DD', () => {
      expect(formatDate('2026-01-30T10:30:00.000Z')).toBe('2026-01-30');
      // Note: ISO timestamp at end of day in UTC may show as next day in local timezone
      expect(formatDate('2026-12-31T00:00:00.000Z')).toMatch(/2026-12-3[01]/);
    });

    it('handles YYYY-MM-DD strings unchanged', () => {
      expect(formatDate('2026-01-30')).toBe('2026-01-30');
    });
  });

  describe('parseDate', () => {
    it('parses YYYY-MM-DD string to Date', () => {
      const date = parseDate('2026-01-30');
      expect(date).toBeInstanceOf(Date);
      expect(date.getFullYear()).toBe(2026);
      expect(date.getMonth()).toBe(0);  // January = 0
      expect(date.getDate()).toBe(30);
    });

    it('parses Date objects unchanged', () => {
      const original = new Date('2026-01-30');
      const parsed = parseDate(original);
      expect(parsed).toEqual(original);
    });
  });

  describe('isValidDate', () => {
    it('returns true for valid dates', () => {
      expect(isValidDate('2026-01-30')).toBe(true);
      expect(isValidDate(new Date('2026-01-30'))).toBe(true);
    });

    it('returns false for invalid dates', () => {
      expect(isValidDate('2026-13-01')).toBe(false);
      expect(isValidDate('2026-02-30')).toBe(false);
      expect(isValidDate('invalid')).toBe(false);
      expect(isValidDate(new Date('invalid'))).toBe(false);
    });
  });

  describe('getStartOfDay', () => {
    it('returns start of day (00:00:00.000)', () => {
      const result = getStartOfDay('2026-01-30');
      expect(formatDate(result)).toBe('2026-01-30');
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
      expect(result.getSeconds()).toBe(0);
      expect(result.getMilliseconds()).toBe(0);
    });
  });

  describe('getEndOfDay', () => {
    it('returns end of day (23:59:59.999)', () => {
      const result = getEndOfDay('2026-01-30');
      expect(formatDate(result)).toBe('2026-01-30');
      expect(result.getHours()).toBe(23);
      expect(result.getMinutes()).toBe(59);
      expect(result.getSeconds()).toBe(59);
      expect(result.getMilliseconds()).toBe(999);
    });
  });

  describe('getStartOfWeek', () => {
    it('returns Monday of the week', () => {
      // Jan 30, 2026 is Friday
      const result = getStartOfWeek('2026-01-30');
      expect(formatDate(result)).toBe('2026-01-26');  // Previous Monday
    });

    it('handles Monday correctly', () => {
      const result = getStartOfWeek('2026-01-26');  // Already Monday
      expect(formatDate(result)).toBe('2026-01-26');
    });

    it('handles Sunday correctly', () => {
      const result = getStartOfWeek('2026-02-01');  // Sunday
      expect(formatDate(result)).toBe('2026-01-26');  // Previous Monday
    });
  });

  describe('getEndOfWeek', () => {
    it('returns Sunday of the week', () => {
      // Jan 30, 2026 is Friday
      const result = getEndOfWeek('2026-01-30');
      expect(formatDate(result)).toBe('2026-02-01');  // Next Sunday
    });

    it('handles Sunday correctly', () => {
      const result = getEndOfWeek('2026-02-01');  // Already Sunday
      expect(formatDate(result)).toBe('2026-02-01');
    });
  });

  describe('getStartOfMonth', () => {
    it('returns first day of month', () => {
      const result = getStartOfMonth('2026-01-30');
      expect(formatDate(result)).toBe('2026-01-01');
    });

    it('handles first day correctly', () => {
      const result = getStartOfMonth('2026-01-01');
      expect(formatDate(result)).toBe('2026-01-01');
    });
  });

  describe('getEndOfMonth', () => {
    it('returns last day of month (31 days)', () => {
      const result = getEndOfMonth('2026-01-15');
      expect(formatDate(result)).toBe('2026-01-31');
    });

    it('returns last day of month (30 days)', () => {
      const result = getEndOfMonth('2026-04-15');
      expect(formatDate(result)).toBe('2026-04-30');
    });

    it('returns last day of February (non-leap year)', () => {
      const result = getEndOfMonth('2026-02-15');
      expect(formatDate(result)).toBe('2026-02-28');
    });

    it('returns last day of February (leap year)', () => {
      const result = getEndOfMonth('2024-02-15');
      expect(formatDate(result)).toBe('2024-02-29');
    });
  });

  describe('formatCurrency', () => {
    it('formats amounts with 2 decimal places', () => {
      expect(formatCurrency(100)).toBe('100.00');
      expect(formatCurrency(50.5)).toBe('50.50');
      expect(formatCurrency(1234.567)).toBe('1234.57');
    });

    it('formats negative amounts', () => {
      expect(formatCurrency(-50.5)).toBe('-50.50');
    });

    it('formats zero', () => {
      expect(formatCurrency(0)).toBe('0.00');
    });
  });

  describe('getDateRangeForPeriod', () => {
    it('returns single day for "day" type', () => {
      const result = getDateRangeForPeriod('day', '2026-01-30');
      expect(result.start).toBe('2026-01-30');
      expect(result.end).toBe('2026-01-30');
    });

    it('returns Monday-Sunday for "week" type', () => {
      // Jan 30, 2026 is Friday
      const result = getDateRangeForPeriod('week', '2026-01-30');
      expect(result.start).toBe('2026-01-26');  // Monday
      expect(result.end).toBe('2026-02-01');    // Sunday
    });

    it('returns full month for "month" type', () => {
      const result = getDateRangeForPeriod('month', '2026-01-30');
      expect(result.start).toBe('2026-01-01');
      expect(result.end).toBe('2026-01-31');
    });

    it('handles February correctly', () => {
      const result = getDateRangeForPeriod('month', '2026-02-15');
      expect(result.start).toBe('2026-02-01');
      expect(result.end).toBe('2026-02-28');
    });

    it('accepts Date objects', () => {
      const date = new Date('2026-01-30');
      const result = getDateRangeForPeriod('day', date);
      expect(result.start).toBe('2026-01-30');
      expect(result.end).toBe('2026-01-30');
    });
  });
});
