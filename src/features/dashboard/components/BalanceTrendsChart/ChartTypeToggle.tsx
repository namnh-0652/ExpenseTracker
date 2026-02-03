/**
 * ChartTypeToggle Component
 * 
 * Toggle buttons to switch between line and bar chart types.
 */

import React from 'react';
import './ChartTypeToggle.css';

/**
 * Chart type options
 */
export type ChartType = 'line' | 'bar';

/**
 * Component props
 */
export interface ChartTypeToggleProps {
  /**
   * Currently active chart type
   */
  chartType: ChartType;

  /**
   * Callback when chart type changes
   */
  onTypeChange: (type: ChartType) => void;

  /**
   * Optional custom className
   */
  className?: string;
}

/**
 * ChartTypeToggle - Toggle between line and bar chart types
 * 
 * @param props - Component props
 * @returns Chart type toggle component
 * 
 * @example
 * ```tsx
 * function MyChart() {
 *   const [chartType, setChartType] = useState<ChartType>('line');
 *   
 *   return (
 *     <ChartTypeToggle 
 *       chartType={chartType}
 *       onTypeChange={setChartType}
 *     />
 *   );
 * }
 * ```
 */
export function ChartTypeToggle({
  chartType,
  onTypeChange,
  className = '',
}: ChartTypeToggleProps): JSX.Element {
  /**
   * Handle button click
   */
  const handleClick = (type: ChartType) => {
    // Only call onChange if type is different
    if (type !== chartType && onTypeChange) {
      onTypeChange(type);
    }
  };

  /**
   * Handle keyboard events
   */
  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    type: ChartType
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick(type);
    }
  };

  return (
    <div
      className={`chart-type-toggle ${className}`.trim()}
      role="group"
      aria-label="Chart type selection"
    >
      <button
        type="button"
        className={`chart-type-button ${
          chartType === 'line' ? 'chart-type-button--active' : ''
        }`.trim()}
        onClick={() => handleClick('line')}
        onKeyDown={(e) => handleKeyDown(e, 'line')}
        aria-label="Line chart"
        aria-pressed={chartType === 'line'}
        title="Line chart"
      >
        <span className="chart-type-icon" aria-hidden="true">
          📈
        </span>
        <span className="chart-type-label">Line</span>
      </button>

      <button
        type="button"
        className={`chart-type-button ${
          chartType === 'bar' ? 'chart-type-button--active' : ''
        }`.trim()}
        onClick={() => handleClick('bar')}
        onKeyDown={(e) => handleKeyDown(e, 'bar')}
        aria-label="Bar chart"
        aria-pressed={chartType === 'bar'}
        title="Bar chart"
      >
        <span className="chart-type-icon" aria-hidden="true">
          📊
        </span>
        <span className="chart-type-label">Bar</span>
      </button>
    </div>
  );
}
