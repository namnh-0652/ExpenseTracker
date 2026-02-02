import { useContext } from 'react';
import { ThemeContext, type ThemeContextType } from '@/features/theme/ThemeContext';

/**
 * useTheme Hook
 * Custom hook to access theme context
 * 
 * @returns Theme context with current theme and toggleTheme function
 * @throws Error if used outside ThemeProvider
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { theme, toggleTheme } = useTheme();
 *   
 *   return (
 *     <button onClick={toggleTheme}>
 *       Current theme: {theme}
 *     </button>
 *   );
 * }
 * ```
 */
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
}
