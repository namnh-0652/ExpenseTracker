import { useTheme } from '@/shared/hooks/useTheme';
import './Header.css';

/**
 * Header Component
 * Application header with branding (logo and title) and theme toggle
 * Persistent across all views
 */
export function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-branding">
          <span className="header-logo" role="img" aria-label="Money bag">💰</span>
          <h1 className="header-title">Expense Tracker</h1>
        </div>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
        >
          <span className="theme-icon" role="img" aria-hidden="true">
            {theme === 'light' ? '🌙' : '☀️'}
          </span>
        </button>
      </div>
    </header>
  );
}
