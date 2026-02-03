import { ReactNode, useEffect } from 'react';
import { ThemeContext, type Theme } from './ThemeContext';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import { THEME_STORAGE_KEY, getSystemTheme } from '@/shared/constants/theme';

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * ThemeProvider Component
 * Provides theme state and toggle function to the entire application
 * Persists theme preference to localStorage and syncs with system preference on first visit
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  // Initialize with system theme preference, then persist user choice
  const [theme, setTheme] = useLocalStorage<Theme>(THEME_STORAGE_KEY, getSystemTheme());

  // Apply theme to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Listen for system theme changes (optional enhancement)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only auto-switch if user hasn't set a preference yet
      const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (!storedTheme) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [setTheme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
