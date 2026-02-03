import { useEffect, useState } from 'react';
import './IncomeAnimation.css';

interface IncomeAnimationProps {
  onComplete: () => void;
}

/**
 * IncomeAnimation Component
 * Displays a celebratory animation when income is added
 * Features confetti particles and success message
 * Respects prefers-reduced-motion for accessibility
 */
export function IncomeAnimation({ onComplete }: IncomeAnimationProps) {
  const [isVisible, setIsVisible] = useState(true);
  
  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    // Auto-cleanup after 2.5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 300); // Wait for fade-out
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className="income-animation-overlay" aria-live="polite" aria-atomic="true">
      <div className={`celebration-content ${prefersReducedMotion ? 'reduced-motion' : ''}`}>
        {/* Success Icon */}
        <div className="celebration-icon">
          <span role="img" aria-label="Party popper">🎉</span>
        </div>

        {/* Success Message */}
        <div className="celebration-message">
          <h2>Income Added!</h2>
          <p>Great job tracking your earnings!</p>
        </div>

        {/* Confetti Particles */}
        {!prefersReducedMotion && (
          <div className="confetti-container">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="confetti-particle"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  animationDuration: `${2 + Math.random()}s`,
                  backgroundColor: [
                    '#48bb78', // green
                    '#667eea', // purple
                    '#f6ad55', // orange
                    '#63b3ed', // blue
                    '#fc8181', // red
                  ][i % 5],
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
