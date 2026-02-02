import React from 'react';
import './TimePeriodSelector.css';

interface TimePeriodSelectorProps {
  selectedPeriod: 'day' | 'week' | 'month';
  onPeriodChange: (period: 'day' | 'week' | 'month') => void;
}

export const TimePeriodSelector: React.FC<TimePeriodSelectorProps> = ({
  selectedPeriod,
  onPeriodChange,
}) => {
  return (
    <div className="period-selector">
      <button
        className={`period-btn ${selectedPeriod === 'day' ? 'active' : ''}`}
        onClick={() => onPeriodChange('day')}
      >
        Day
      </button>
      <button
        className={`period-btn ${selectedPeriod === 'week' ? 'active' : ''}`}
        onClick={() => onPeriodChange('week')}
      >
        Week
      </button>
      <button
        className={`period-btn ${selectedPeriod === 'month' ? 'active' : ''}`}
        onClick={() => onPeriodChange('month')}
      >
        Month
      </button>
    </div>
  );
};
