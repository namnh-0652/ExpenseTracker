/**
 * Theme Constants
 * Design system values for consistent styling across the application
 */

// Spacing scale (in pixels)
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

// Transition timing (in milliseconds)
export const TRANSITIONS = {
  fast: 150,
  normal: 200,
  slow: 300,
} as const;

// Transition easing functions
export const EASINGS = {
  easeOut: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  easeInOut: 'cubic-bezier(0.645, 0.045, 0.355, 1.000)',
  spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const;

// Border radius values
export const RADIUS = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  full: '9999px',
} as const;

// Box shadow levels
export const SHADOWS = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
} as const;

// Light theme colors
export const LIGHT_COLORS = {
  background: '#ffffff',
  backgroundAlt: '#f7fafc',
  surface: '#ffffff',
  surfaceAlt: '#edf2f7',
  
  text: '#1a202c',
  textSecondary: '#4a5568',
  textTertiary: '#718096',
  
  primary: '#4299e1',
  primaryHover: '#3182ce',
  primaryLight: '#bee3f8',
  
  success: '#48bb78',
  successLight: '#c6f6d5',
  
  danger: '#f56565',
  dangerLight: '#fed7d7',
  
  warning: '#ed8936',
  warningLight: '#feebc8',
  
  border: '#e2e8f0',
  borderDark: '#cbd5e0',
  
  shadow: 'rgba(0, 0, 0, 0.1)',
} as const;

// Dark theme colors
export const DARK_COLORS = {
  background: '#1a202c',
  backgroundAlt: '#2d3748',
  surface: '#2d3748',
  surfaceAlt: '#4a5568',
  
  text: '#f7fafc',
  textSecondary: '#e2e8f0',
  textTertiary: '#cbd5e0',
  
  primary: '#63b3ed',
  primaryHover: '#4299e1',
  primaryLight: '#2c5282',
  
  success: '#68d391',
  successLight: '#2f855a',
  
  danger: '#fc8181',
  dangerLight: '#c53030',
  
  warning: '#f6ad55',
  warningLight: '#c05621',
  
  border: '#4a5568',
  borderDark: '#2d3748',
  
  shadow: 'rgba(0, 0, 0, 0.3)',
} as const;

// LocalStorage keys for theme system
export const THEME_STORAGE_KEY = 'expense-tracker-theme';
export const TAB_STORAGE_KEY = 'expense-tracker-active-tab';

// Valid tab values
export type TabValue = 'dashboard' | 'transactions' | 'filters';

export const TABS: readonly TabValue[] = ['dashboard', 'transactions', 'filters'] as const;

// Animation durations (in milliseconds)
export const ANIMATION_DURATION = {
  celebration: 2500,
  fadeIn: 300,
  slideIn: 400,
} as const;

/**
 * Detects the user's system theme preference
 * @returns 'dark' if system prefers dark mode, 'light' otherwise
 */
export const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') {
    return 'light';
  }
  
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
};

/**
 * Checks if user prefers reduced motion for accessibility
 * @returns true if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};
