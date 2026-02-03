/**
 * Chart Utilities
 * Helper functions for chart formatting, configuration, and theme integration
 */

import { format, parseISO } from 'date-fns';
import {
  LIGHT_CHART_COLORS,
  DARK_CHART_COLORS,
  CHART_HEIGHTS,
  CHART_BREAKPOINTS,
} from '@/shared/constants/chartConstants';

/**
 * Chart theme type
 */
export type ChartTheme = 'light' | 'dark';

/**
 * Chart colors interface
 */
export interface ChartColors {
  positive: string;
  negative: string;
  gridLines: string;
  axisLabels: string;
  axisLines: string;
  tooltipBackground: string;
  tooltipText: string;
  tooltipBorder: string;
}

/**
 * Get chart colors based on theme
 * 
 * @param theme - Theme mode ('light' or 'dark')
 * @returns Chart color configuration
 */
export function getChartColorsByTheme(theme: ChartTheme): ChartColors {
  return theme === 'dark' ? DARK_CHART_COLORS : LIGHT_CHART_COLORS;
}

/**
 * Format date for chart axis labels
 * 
 * @param date - ISO date string (YYYY-MM-DD)
 * @param periodType - Type of period ('day', 'week', 'month')
 * @returns Formatted date string
 */
export function formatChartDate(
  date: string,
  periodType: 'day' | 'week' | 'month'
): string {
  try {
    const dateObj = parseISO(date);
    
    switch (periodType) {
      case 'day':
        // Format as "Jan 5" or "12/5" for mobile
        return format(dateObj, 'MMM d');
      case 'week':
        // Format as "Jan 5" (week starting date)
        return format(dateObj, 'MMM d');
      case 'month':
        // Format as "Jan 2026" or "Jan '26"
        return format(dateObj, 'MMM yyyy');
      default:
        return date;
    }
  } catch (error) {
    console.error('Error formatting chart date:', error);
    return date;
  }
}

/**
 * Format currency value for chart tooltips
 * 
 * @param value - Numeric value
 * @param options - Intl.NumberFormat options
 * @returns Formatted currency string
 */
export function formatChartCurrency(
  value: number,
  options: Intl.NumberFormatOptions = {}
): string {
  const defaultOptions: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  };

  try {
    return new Intl.NumberFormat('en-US', defaultOptions).format(value);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `$${value.toFixed(2)}`;
  }
}

/**
 * Format large numbers with abbreviated suffixes (K, M, B)
 * 
 * @param value - Numeric value
 * @returns Formatted string with suffix
 */
export function formatChartNumber(value: number): string {
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (absValue >= 1_000_000_000) {
    return `${sign}${(absValue / 1_000_000_000).toFixed(1)}B`;
  }
  if (absValue >= 1_000_000) {
    return `${sign}${(absValue / 1_000_000).toFixed(1)}M`;
  }
  if (absValue >= 1_000) {
    return `${sign}${(absValue / 1_000).toFixed(1)}K`;
  }
  return `${sign}${absValue.toFixed(0)}`;
}

/**
 * Get responsive chart height based on window width
 * 
 * @param windowWidth - Current window width in pixels
 * @returns Chart height in pixels
 */
export function getResponsiveChartHeight(windowWidth: number): number {
  if (windowWidth < CHART_BREAKPOINTS.mobile) {
    return CHART_HEIGHTS.mobile;
  }
  if (windowWidth < CHART_BREAKPOINTS.tablet) {
    return CHART_HEIGHTS.tablet;
  }
  return CHART_HEIGHTS.desktop;
}

/**
 * Generate gradient for chart line/bar
 * 
 * @param ctx - Canvas 2D context
 * @param color - Base color
 * @param height - Chart height
 * @returns CanvasGradient
 */
export function createChartGradient(
  ctx: CanvasRenderingContext2D,
  color: string,
  height: number
): CanvasGradient {
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  
  // Parse color and create gradient with alpha
  gradient.addColorStop(0, `${color}40`); // 25% opacity at top
  gradient.addColorStop(1, `${color}00`); // 0% opacity at bottom
  
  return gradient;
}

/**
 * Get color for balance value (positive = green, negative = red)
 * 
 * @param value - Numeric value
 * @param theme - Theme mode
 * @returns Color string
 */
export function getBalanceColor(value: number, theme: ChartTheme): string {
  const colors = getChartColorsByTheme(theme);
  return value >= 0 ? colors.positive : colors.negative;
}

/**
 * Truncate axis label for mobile displays
 * 
 * @param label - Original label
 * @param maxLength - Maximum character length
 * @returns Truncated label
 */
export function truncateAxisLabel(label: string, maxLength: number = 10): string {
  if (label.length <= maxLength) {
    return label;
  }
  return `${label.slice(0, maxLength - 1)}…`;
}

/**
 * Check if user prefers reduced motion
 * 
 * @returns True if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get chart dataset configuration with theme colors
 * 
 * @param label - Dataset label
 * @param data - Data points
 * @param theme - Theme mode
 * @param type - Chart type ('line' or 'bar')
 * @returns Chart.js dataset configuration
 */
export function createChartDataset(
  label: string,
  data: number[],
  theme: ChartTheme,
  type: 'line' | 'bar' = 'line'
) {
  const colors = getChartColorsByTheme(theme);
  const isPositive = data.length > 0 && data[data.length - 1] >= 0;
  const borderColor = isPositive ? colors.positive : colors.negative;
  const backgroundColor = type === 'bar' ? borderColor : `${borderColor}20`;

  const baseConfig = {
    label,
    data,
    borderColor,
    backgroundColor,
    borderWidth: 2,
  };

  if (type === 'line') {
    return {
      ...baseConfig,
      fill: true,
      tension: 0.4, // Smooth curves
      pointRadius: 4,
      pointHoverRadius: 6,
      pointBackgroundColor: borderColor,
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointHoverBackgroundColor: borderColor,
      pointHoverBorderColor: '#ffffff',
      pointHoverBorderWidth: 2,
    };
  }

  return {
    ...baseConfig,
    borderRadius: 4,
    borderSkipped: false,
  };
}

/**
 * Format tooltip label with currency and percentage
 * 
 * @param value - Current value
 * @param previousValue - Previous value for comparison
 * @returns Formatted tooltip text
 */
export function formatTooltipLabel(
  value: number,
  previousValue?: number
): string {
  const formattedValue = formatChartCurrency(value);
  
  if (previousValue !== undefined && previousValue !== 0) {
    const change = value - previousValue;
    const changePercent = (change / Math.abs(previousValue)) * 100;
    const changeSign = change >= 0 ? '+' : '';
    const changeFormatted = formatChartCurrency(Math.abs(change));
    
    return `${formattedValue} (${changeSign}${changeFormatted}, ${changeSign}${changePercent.toFixed(1)}%)`;
  }
  
  return formattedValue;
}

/**
 * Calculate optimal tick count for axis based on data points
 * 
 * @param dataPointCount - Number of data points
 * @param maxTicks - Maximum number of ticks
 * @returns Optimal tick count
 */
export function calculateOptimalTicks(
  dataPointCount: number,
  maxTicks: number = 12
): number {
  if (dataPointCount <= maxTicks) {
    return dataPointCount;
  }
  
  // Find a divisor that gives us a reasonable number of ticks
  const divisors = [2, 3, 4, 5, 6, 7, 8, 10, 12];
  
  for (const divisor of divisors) {
    const ticks = Math.ceil(dataPointCount / divisor);
    if (ticks <= maxTicks) {
      return ticks;
    }
  }
  
  return maxTicks;
}
