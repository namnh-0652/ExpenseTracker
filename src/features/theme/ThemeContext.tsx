import { createContext } from 'react';

/**
 * Theme types
 */
export type Theme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

/**
 * Theme Context
 * Provides theme state and toggle function to all components
 */
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
