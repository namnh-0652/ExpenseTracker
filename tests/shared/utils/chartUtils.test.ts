import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getChartColorsByTheme,
  formatChartDate,
  formatChartCurrency,
  formatChartNumber,
  getResponsiveChartHeight,
  getBalanceColor,
  truncateAxisLabel,
  prefersReducedMotion,
  createChartDataset,
  formatTooltipLabel,
  calculateOptimalTicks,
} from '@/shared/utils/chartUtils';
import {
  LIGHT_CHART_COLORS,
  DARK_CHART_COLORS,
  CHART_HEIGHTS,
  CHART_BREAKPOINTS,
} from '@/shared/constants/chartConstants';

/**
 * Test Suite: Chart Utilities
 * 
 * Tests for chart formatting, theming, and configuration helpers.
 */

describe('chartUtils', () => {
  describe('getChartColorsByTheme', () => {
    it('should return light theme colors', () => {
      const colors = getChartColorsByTheme('light');
      
      expect(colors).toEqual(LIGHT_CHART_COLORS);
      expect(colors.positive).toBe('#22c55e');
      expect(colors.negative).toBe('#ef4444');
    });

    it('should return dark theme colors', () => {
      const colors = getChartColorsByTheme('dark');
      
      expect(colors).toEqual(DARK_CHART_COLORS);
      expect(colors.positive).toBe('#4ade80');
      expect(colors.negative).toBe('#f87171');
    });

    it('should have all required color properties', () => {
      const lightColors = getChartColorsByTheme('light');
      const darkColors = getChartColorsByTheme('dark');

      const requiredProps = [
        'positive',
        'negative',
        'gridLines',
        'axisLabels',
        'axisLines',
        'tooltipBackground',
        'tooltipText',
        'tooltipBorder',
      ];

      requiredProps.forEach(prop => {
        expect(lightColors).toHaveProperty(prop);
        expect(darkColors).toHaveProperty(prop);
      });
    });
  });

  describe('formatChartDate', () => {
    it('should format daily dates as "MMM d"', () => {
      expect(formatChartDate('2026-02-03', 'day')).toBe('Feb 3');
      expect(formatChartDate('2026-01-15', 'day')).toBe('Jan 15');
      expect(formatChartDate('2026-12-31', 'day')).toBe('Dec 31');
    });

    it('should format weekly dates as "MMM d"', () => {
      expect(formatChartDate('2026-02-02', 'week')).toBe('Feb 2'); // Monday
      expect(formatChartDate('2026-01-05', 'week')).toBe('Jan 5');
    });

    it('should format monthly dates as "MMM yyyy"', () => {
      expect(formatChartDate('2026-02-01', 'month')).toBe('Feb 2026');
      expect(formatChartDate('2025-12-01', 'month')).toBe('Dec 2025');
      expect(formatChartDate('2026-01-01', 'month')).toBe('Jan 2026');
    });

    it('should handle invalid dates gracefully', () => {
      const result = formatChartDate('invalid-date', 'day');
      expect(result).toBe('invalid-date'); // Returns original on error
    });

    it('should handle different ISO date formats', () => {
      expect(formatChartDate('2026-02-03', 'day')).toBe('Feb 3');
      expect(formatChartDate('2026-02-03T00:00:00.000Z', 'day')).toBe('Feb 3');
    });
  });

  describe('formatChartCurrency', () => {
    it('should format positive numbers as USD currency', () => {
      expect(formatChartCurrency(1234.56)).toBe('$1,234.56');
      expect(formatChartCurrency(100)).toBe('$100.00');
      expect(formatChartCurrency(0.99)).toBe('$0.99');
    });

    it('should format negative numbers as USD currency', () => {
      expect(formatChartCurrency(-1234.56)).toBe('-$1,234.56');
      expect(formatChartCurrency(-100)).toBe('-$100.00');
    });

    it('should format zero correctly', () => {
      expect(formatChartCurrency(0)).toBe('$0.00');
    });

    it('should handle large numbers', () => {
      expect(formatChartCurrency(1000000)).toBe('$1,000,000.00');
      expect(formatChartCurrency(1234567.89)).toBe('$1,234,567.89');
    });

    it('should accept custom currency options', () => {
      const result = formatChartCurrency(1234.56, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
      expect(result).toBe('$1,235');
    });

    it('should handle decimal precision', () => {
      expect(formatChartCurrency(99.999)).toBe('$100.00'); // Rounds up
      expect(formatChartCurrency(99.994)).toBe('$99.99'); // Rounds down
    });
  });

  describe('formatChartNumber', () => {
    it('should format numbers under 1K as-is', () => {
      expect(formatChartNumber(999)).toBe('999');
      expect(formatChartNumber(500)).toBe('500');
      expect(formatChartNumber(0)).toBe('0');
    });

    it('should format thousands with K suffix', () => {
      expect(formatChartNumber(1000)).toBe('1.0K');
      expect(formatChartNumber(5500)).toBe('5.5K');
      expect(formatChartNumber(999999)).toBe('1000.0K');
    });

    it('should format millions with M suffix', () => {
      expect(formatChartNumber(1000000)).toBe('1.0M');
      expect(formatChartNumber(2500000)).toBe('2.5M');
      expect(formatChartNumber(999999999)).toBe('1000.0M');
    });

    it('should format billions with B suffix', () => {
      expect(formatChartNumber(1000000000)).toBe('1.0B');
      expect(formatChartNumber(3500000000)).toBe('3.5B');
    });

    it('should handle negative numbers', () => {
      expect(formatChartNumber(-1000)).toBe('-1.0K');
      expect(formatChartNumber(-2500000)).toBe('-2.5M');
      expect(formatChartNumber(-3500000000)).toBe('-3.5B');
    });
  });

  describe('getResponsiveChartHeight', () => {
    it('should return mobile height for small screens', () => {
      expect(getResponsiveChartHeight(320)).toBe(CHART_HEIGHTS.mobile);
      expect(getResponsiveChartHeight(CHART_BREAKPOINTS.mobile - 1)).toBe(CHART_HEIGHTS.mobile);
    });

    it('should return tablet height for medium screens', () => {
      expect(getResponsiveChartHeight(CHART_BREAKPOINTS.mobile)).toBe(CHART_HEIGHTS.tablet);
      expect(getResponsiveChartHeight(700)).toBe(CHART_HEIGHTS.tablet);
      expect(getResponsiveChartHeight(CHART_BREAKPOINTS.tablet - 1)).toBe(CHART_HEIGHTS.tablet);
    });

    it('should return desktop height for large screens', () => {
      expect(getResponsiveChartHeight(CHART_BREAKPOINTS.desktop)).toBe(CHART_HEIGHTS.desktop);
      expect(getResponsiveChartHeight(1920)).toBe(CHART_HEIGHTS.desktop);
    });

    it('should handle exact breakpoint values', () => {
      expect(getResponsiveChartHeight(CHART_BREAKPOINTS.mobile)).toBe(CHART_HEIGHTS.tablet);
      expect(getResponsiveChartHeight(CHART_BREAKPOINTS.tablet)).toBe(CHART_HEIGHTS.desktop);
    });
  });

  describe('getBalanceColor', () => {
    it('should return positive color for positive values (light theme)', () => {
      const color = getBalanceColor(100, 'light');
      expect(color).toBe(LIGHT_CHART_COLORS.positive);
    });

    it('should return negative color for negative values (light theme)', () => {
      const color = getBalanceColor(-100, 'light');
      expect(color).toBe(LIGHT_CHART_COLORS.negative);
    });

    it('should return positive color for zero (light theme)', () => {
      const color = getBalanceColor(0, 'light');
      expect(color).toBe(LIGHT_CHART_COLORS.positive);
    });

    it('should return correct colors for dark theme', () => {
      expect(getBalanceColor(100, 'dark')).toBe(DARK_CHART_COLORS.positive);
      expect(getBalanceColor(-100, 'dark')).toBe(DARK_CHART_COLORS.negative);
    });
  });

  describe('truncateAxisLabel', () => {
    it('should not truncate labels shorter than max length', () => {
      expect(truncateAxisLabel('Short', 10)).toBe('Short');
      expect(truncateAxisLabel('Jan 2026', 10)).toBe('Jan 2026');
    });

    it('should truncate labels longer than max length', () => {
      expect(truncateAxisLabel('Very Long Label Here', 10)).toBe('Very Long…');
      expect(truncateAxisLabel('January 2026', 10)).toBe('January 2…');
    });

    it('should use default max length of 10', () => {
      expect(truncateAxisLabel('12345678901')).toBe('123456789…');
    });

    it('should handle custom max length', () => {
      expect(truncateAxisLabel('Hello World', 5)).toBe('Hell…');
      expect(truncateAxisLabel('Test', 5)).toBe('Test');
    });

    it('should handle empty strings', () => {
      expect(truncateAxisLabel('')).toBe('');
    });
  });

  describe('prefersReducedMotion', () => {
    let matchMediaMock: vi.Mock;

    beforeEach(() => {
      matchMediaMock = vi.fn();
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: matchMediaMock,
      });
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should return true if user prefers reduced motion', () => {
      matchMediaMock.mockReturnValue({ matches: true });
      expect(prefersReducedMotion()).toBe(true);
    });

    it('should return false if user does not prefer reduced motion', () => {
      matchMediaMock.mockReturnValue({ matches: false });
      expect(prefersReducedMotion()).toBe(false);
    });

    it('should call matchMedia with correct query', () => {
      matchMediaMock.mockReturnValue({ matches: false });
      prefersReducedMotion();
      expect(matchMediaMock).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
    });
  });

  describe('createChartDataset', () => {
    it('should create line dataset configuration', () => {
      const data = [100, 200, 300];
      const dataset = createChartDataset('Balance', data, 'light', 'line');

      expect(dataset.label).toBe('Balance');
      expect(dataset.data).toEqual(data);
      expect(dataset.borderWidth).toBe(2);
      expect(dataset.fill).toBe(true);
      expect(dataset.tension).toBe(0.4);
      expect(dataset.pointRadius).toBe(4);
    });

    it('should create bar dataset configuration', () => {
      const data = [100, 200, 300];
      const dataset = createChartDataset('Balance', data, 'light', 'bar');

      expect(dataset.label).toBe('Balance');
      expect(dataset.data).toEqual(data);
      expect(dataset.borderWidth).toBe(2);
      expect(dataset.borderRadius).toBe(4);
      expect(dataset.borderSkipped).toBe(false);
    });

    it('should use positive color for positive ending balance', () => {
      const data = [100, 200, 300];
      const dataset = createChartDataset('Balance', data, 'light', 'line');

      expect(dataset.borderColor).toBe(LIGHT_CHART_COLORS.positive);
    });

    it('should use negative color for negative ending balance', () => {
      const data = [100, 50, -10];
      const dataset = createChartDataset('Balance', data, 'light', 'line');

      expect(dataset.borderColor).toBe(LIGHT_CHART_COLORS.negative);
    });

    it('should apply dark theme colors', () => {
      const data = [100, 200, 300];
      const dataset = createChartDataset('Balance', data, 'dark', 'line');

      expect(dataset.borderColor).toBe(DARK_CHART_COLORS.positive);
    });

    it('should default to line type', () => {
      const data = [100, 200, 300];
      const dataset = createChartDataset('Balance', data, 'light');

      expect(dataset.fill).toBe(true);
      expect(dataset.tension).toBe(0.4);
    });
  });

  describe('formatTooltipLabel', () => {
    it('should format value as currency only when no previous value', () => {
      const result = formatTooltipLabel(1234.56);
      expect(result).toBe('$1,234.56');
    });

    it('should format with change when previous value provided', () => {
      const result = formatTooltipLabel(1500, 1000);
      expect(result).toContain('$1,500.00');
      expect(result).toContain('+$500.00');
      expect(result).toContain('+50.0%');
    });

    it('should format negative change correctly', () => {
      const result = formatTooltipLabel(800, 1000);
      expect(result).toContain('$800.00');
      expect(result).toContain('$200.00');
      expect(result).toContain('-20.0%');
    });

    it('should handle zero previous value', () => {
      const result = formatTooltipLabel(100, 0);
      expect(result).toBe('$100.00'); // No change calculation
    });

    it('should handle zero change', () => {
      const result = formatTooltipLabel(1000, 1000);
      expect(result).toContain('$1,000.00');
      expect(result).toContain('+$0.00');
      expect(result).toContain('+0.0%');
    });

    it('should handle negative previous value', () => {
      const result = formatTooltipLabel(-500, -1000);
      expect(result).toContain('-$500.00');
      expect(result).toContain('+$500.00');
      expect(result).toContain('+50.0%');
    });
  });

  describe('calculateOptimalTicks', () => {
    it('should return data point count if less than max ticks', () => {
      expect(calculateOptimalTicks(5, 12)).toBe(5);
      expect(calculateOptimalTicks(10, 12)).toBe(10);
      expect(calculateOptimalTicks(12, 12)).toBe(12);
    });

    it('should calculate optimal ticks for 30 data points', () => {
      const ticks = calculateOptimalTicks(30, 12);
      expect(ticks).toBeLessThanOrEqual(12);
      expect(ticks).toBeGreaterThan(0);
    });

    it('should calculate optimal ticks for 365 data points', () => {
      const ticks = calculateOptimalTicks(365, 12);
      expect(ticks).toBeLessThanOrEqual(12);
      expect(ticks).toBeGreaterThan(0);
    });

    it('should use default max ticks of 12', () => {
      const ticks = calculateOptimalTicks(100);
      expect(ticks).toBeLessThanOrEqual(12);
    });

    it('should handle custom max ticks', () => {
      const ticks = calculateOptimalTicks(100, 8);
      expect(ticks).toBeLessThanOrEqual(8);
    });

    it('should return max ticks if no good divisor found', () => {
      const ticks = calculateOptimalTicks(1000, 5);
      expect(ticks).toBeLessThanOrEqual(5);
    });

    it('should handle edge case of 1 data point', () => {
      expect(calculateOptimalTicks(1)).toBe(1);
    });

    it('should handle edge case of 0 data points', () => {
      expect(calculateOptimalTicks(0)).toBe(0);
    });
  });

  describe('edge cases and integration', () => {
    it('should format all period types consistently', () => {
      const date = '2026-02-15';
      
      const daily = formatChartDate(date, 'day');
      const weekly = formatChartDate(date, 'week');
      const monthly = formatChartDate(date, 'month');

      expect(daily).toBeTruthy();
      expect(weekly).toBeTruthy();
      expect(monthly).toBeTruthy();
      
      // All should produce different formats
      expect(daily).not.toBe(monthly);
    });

    it('should create consistent datasets across themes', () => {
      const data = [100, 200, 300];
      
      const lightDataset = createChartDataset('Balance', data, 'light', 'line');
      const darkDataset = createChartDataset('Balance', data, 'dark', 'line');

      // Same structure, different colors
      expect(lightDataset.label).toBe(darkDataset.label);
      expect(lightDataset.data).toEqual(darkDataset.data);
      expect(lightDataset.borderWidth).toBe(darkDataset.borderWidth);
      expect(lightDataset.borderColor).not.toBe(darkDataset.borderColor);
    });

    it('should handle chart colors for all theme variations', () => {
      const themes: Array<'light' | 'dark'> = ['light', 'dark'];
      
      themes.forEach(theme => {
        const colors = getChartColorsByTheme(theme);
        const positiveColor = getBalanceColor(100, theme);
        const negativeColor = getBalanceColor(-100, theme);

        expect(positiveColor).toBe(colors.positive);
        expect(negativeColor).toBe(colors.negative);
      });
    });
  });
});
