import { useEffect, useRef } from 'react';
import type { TabValue } from '@/shared/constants/theme';
import './TabNav.css';

interface TabNavProps {
  activeTab: TabValue;
  onTabChange: (tab: TabValue) => void;
}

/**
 * TabNav Component
 * Navigation tabs for Dashboard, Transactions, and Filters
 * Supports keyboard navigation and localStorage persistence
 */
export function TabNav({ activeTab, onTabChange }: TabNavProps) {
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tabs: TabValue[] = ['dashboard', 'transactions', 'filters'];
      const currentIndex = tabs.indexOf(activeTab);

      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        e.preventDefault();
        onTabChange(tabs[currentIndex - 1]);
      } else if (e.key === 'ArrowRight' && currentIndex < tabs.length - 1) {
        e.preventDefault();
        onTabChange(tabs[currentIndex + 1]);
      }
    };

    const activeButton = tabRefs.current[activeTab];
    if (activeButton && document.activeElement?.classList.contains('tab-button')) {
      activeButton.addEventListener('keydown', handleKeyDown);
      return () => activeButton.removeEventListener('keydown', handleKeyDown);
    }
  }, [activeTab, onTabChange]);

  const handleTabClick = (tab: TabValue) => {
    onTabChange(tab);
    // Focus the clicked tab for keyboard navigation
    tabRefs.current[tab]?.focus();
  };

  return (
    <nav className="tab-nav" role="tablist" aria-label="Content navigation">
      <button
        ref={(el) => {
          tabRefs.current['dashboard'] = el;
        }}
        role="tab"
        aria-selected={activeTab === 'dashboard'}
        aria-controls="dashboard-panel"
        id="dashboard-tab"
        className={`tab-button ${activeTab === 'dashboard' ? 'active' : ''}`}
        onClick={() => handleTabClick('dashboard')}
        tabIndex={activeTab === 'dashboard' ? 0 : -1}
      >
        <span className="tab-icon">📊</span>
        <span className="tab-label">Dashboard</span>
      </button>

      <button
        ref={(el) => {
          tabRefs.current['transactions'] = el;
        }}
        role="tab"
        aria-selected={activeTab === 'transactions'}
        aria-controls="transactions-panel"
        id="transactions-tab"
        className={`tab-button ${activeTab === 'transactions' ? 'active' : ''}`}
        onClick={() => handleTabClick('transactions')}
        tabIndex={activeTab === 'transactions' ? 0 : -1}
      >
        <span className="tab-icon">📝</span>
        <span className="tab-label">Transactions</span>
      </button>

      <button
        ref={(el) => {
          tabRefs.current['filters'] = el;
        }}
        role="tab"
        aria-selected={activeTab === 'filters'}
        aria-controls="filters-panel"
        id="filters-tab"
        className={`tab-button ${activeTab === 'filters' ? 'active' : ''}`}
        onClick={() => handleTabClick('filters')}
        tabIndex={activeTab === 'filters' ? 0 : -1}
      >
        <span className="tab-icon">🔍</span>
        <span className="tab-label">Filters</span>
      </button>
    </nav>
  );
}
