import './Footer.css';

/**
 * Footer Component
 * Application footer with version info and credits
 * Persistent across all views
 */
export function Footer() {
  const currentYear = new Date().getFullYear();
  const version = '0.0.0'; // Should match package.json version

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-info">
          <span className="footer-version">v{version}</span>
          <span className="footer-separator">•</span>
          <span className="footer-copyright">© {currentYear} Expense Tracker</span>
        </div>
        <div className="footer-credits">
          Built with ❤️ using React & TypeScript
        </div>
      </div>
    </footer>
  );
}
