import './Header.css';

/**
 * Header Component
 * Application header with branding (logo and title)
 * Persistent across all views
 */
export function Header() {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-branding">
          <span className="header-logo" role="img" aria-label="Money bag">💰</span>
          <h1 className="header-title">Expense Tracker</h1>
        </div>
      </div>
    </header>
  );
}
