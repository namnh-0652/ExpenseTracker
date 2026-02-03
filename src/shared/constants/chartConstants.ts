/**
 * Chart Constants
 * Default configuration and constants for Chart.js integration
 */

import type { ChartOptions } from 'chart.js';

/**
 * Default chart configuration
 */
export const DEFAULT_CHART_CONFIG = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 300,
    easing: 'easeOut' as const,
  },
} as const;

/**
 * Chart height constants (in pixels)
 */
export const CHART_HEIGHTS = {
  mobile: 300,
  tablet: 350,
  desktop: 400,
} as const;

/**
 * Chart interaction modes
 */
export const CHART_INTERACTION = {
  mode: 'index' as const,
  intersect: false,
} as const;

/**
 * Chart color palette for light theme
 */
export const LIGHT_CHART_COLORS = {
  positive: '#22c55e',      // green-500
  negative: '#ef4444',      // red-500
  gridLines: '#e5e7eb',     // gray-200
  axisLabels: '#6b7280',    // gray-500
  axisLines: '#e5e7eb',     // gray-200
  tooltipBackground: '#ffffff',
  tooltipText: '#111827',   // gray-900
  tooltipBorder: '#e5e7eb', // gray-200
} as const;

/**
 * Chart color palette for dark theme
 */
export const DARK_CHART_COLORS = {
  positive: '#4ade80',      // green-400 (brighter for dark mode)
  negative: '#f87171',      // red-400 (brighter for dark mode)
  gridLines: '#374151',     // gray-700
  axisLabels: '#9ca3af',    // gray-400
  axisLines: '#374151',     // gray-700
  tooltipBackground: '#1f2937', // gray-800
  tooltipText: '#f9fafb',   // gray-50
  tooltipBorder: '#374151', // gray-700
} as const;

/**
 * Default Chart.js scales configuration
 */
export const DEFAULT_SCALES_CONFIG: ChartOptions['scales'] = {
  x: {
    grid: {
      display: true,
      drawBorder: false,
    },
    ticks: {
      maxRotation: 45,
      minRotation: 0,
      autoSkip: true,
      maxTicksLimit: 12,
    },
  },
  y: {
    grid: {
      display: true,
      drawBorder: false,
    },
    ticks: {
      maxTicksLimit: 8,
    },
  },
};

/**
 * Default Chart.js plugins configuration
 */
export const DEFAULT_PLUGINS_CONFIG: ChartOptions['plugins'] = {
  legend: {
    display: false, // We'll use custom legend if needed
  },
  tooltip: {
    enabled: true,
    mode: 'index',
    intersect: false,
    backgroundColor: LIGHT_CHART_COLORS.tooltipBackground,
    titleColor: LIGHT_CHART_COLORS.tooltipText,
    bodyColor: LIGHT_CHART_COLORS.tooltipText,
    borderColor: LIGHT_CHART_COLORS.tooltipBorder,
    borderWidth: 1,
    padding: 12,
    displayColors: false,
    callbacks: {
      // Custom formatting will be provided by component
    },
  },
};

/**
 * Chart animation configuration respecting user preferences
 */
export function getAnimationConfig(prefersReducedMotion: boolean) {
  if (prefersReducedMotion) {
    return {
      duration: 0,
      easing: 'linear' as const,
    };
  }
  return DEFAULT_CHART_CONFIG.animation;
}

/**
 * Breakpoints for responsive chart sizing
 */
export const CHART_BREAKPOINTS = {
  mobile: 640,   // sm
  tablet: 768,   // md
  desktop: 1024, // lg
} as const;

/**
 * Data point limits for performance
 */
export const DATA_POINT_LIMITS = {
  daily: 30,
  weekly: 12,
  monthly: 12,
  max: 365, // Maximum supported for performance
} as const;
