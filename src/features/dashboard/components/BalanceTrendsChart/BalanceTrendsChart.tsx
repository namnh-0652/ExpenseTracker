/**
 * BalanceTrendsChart Component
 * 
 * Main chart component for displaying balance trends over time.
 * Integrates Chart.js with custom hooks and utilities.
 */

import React, { useState, useMemo } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from 'chart.js';
import { useBalanceTrends } from '@/features/dashboard/hooks/useBalanceTrends';
import { ChartTypeToggle, ChartType } from './ChartTypeToggle';
import {
  getChartColorsByTheme,
  formatChartDate,
  formatChartCurrency,
  getResponsiveChartHeight,
  formatTooltipLabel,
  createChartDataset,
} from '@/shared/utils/chartUtils';
import { DEFAULT_CHART_CONFIG, CHART_HEIGHTS } from '@/shared/constants/chartConstants';
import type { Transaction } from '@/shared/types';
import './BalanceTrendsChart.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

/**
 * Component props
 */
export interface BalanceTrendsChartProps {
  /**
   * Array of transactions to calculate trends from
   */
  transactions: Transaction[];

  /**
   * Period type for trend calculation
   */
  periodType: 'day' | 'week' | 'month';

  /**
   * Theme for chart colors (light or dark)
   * @default 'light'
   */
  theme?: 'light' | 'dark';

  /**
   * Optional custom height in pixels
   */
  height?: number;

  /**
   * Optional className for styling
   */
  className?: string;
}

/**
 * BalanceTrendsChart - Displays balance trends over time
 * 
 * @param props - Component props
 * @returns Balance trends chart component
 * 
 * @example
 * ```tsx
 * <BalanceTrendsChart
 *   transactions={transactions}
 *   periodType="day"
 *   theme="light"
 * />
 * ```
 */
export function BalanceTrendsChart({
  transactions,
  periodType,
  theme = 'light',
  height,
  className = '',
}: BalanceTrendsChartProps): JSX.Element {
  // Chart type state (line or bar)
  const [chartType, setChartType] = useState<ChartType>('line');

  // Calculate balance trends using custom hook
  const { data, isLoading, error } = useBalanceTrends(transactions, periodType);

  // Get theme colors
  const colors = getChartColorsByTheme(theme);

  // Determine chart height
  const chartHeight = useMemo(() => {
    if (height) return height;
    if (typeof window !== 'undefined') {
      return getResponsiveChartHeight(window.innerWidth);
    }
    return CHART_HEIGHTS.desktop;
  }, [height]);

  // Prepare chart data
  const chartData = useMemo(() => {
    if (!data) return null;

    const labels = data.points.map(point =>
      formatChartDate(point.date, periodType)
    );

    const balanceData = data.points.map(point => point.balance);

    return {
      labels,
      datasets: [
        createChartDataset(
          'Balance',
          balanceData,
          theme,
          chartType
        ),
      ],
    };
  }, [data, periodType, theme, chartType]);

  // Chart options
  const chartOptions = useMemo<ChartOptions<'line' | 'bar'>>(() => {
    return {
      ...DEFAULT_CHART_CONFIG,
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: true,
          backgroundColor: colors.tooltipBackground,
          titleColor: colors.tooltipText,
          bodyColor: colors.tooltipText,
          borderColor: colors.gridLines,
          borderWidth: 1,
          padding: 12,
          displayColors: false,
          callbacks: {
            label: (context) => {
              const value = context.parsed.y;
              const index = context.dataIndex;
              const previousValue = index > 0 
                ? (context.dataset.data[index - 1] as number)
                : undefined;
              return formatTooltipLabel(value, previousValue);
            },
          },
        },
        title: {
          display: false,
        },
      },
      scales: {
        x: {
          grid: {
            color: colors.gridLines,
            display: true,
          },
          ticks: {
            color: colors.axisLabels,
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 8,
          },
        },
        y: {
          grid: {
            color: colors.gridLines,
            display: true,
          },
          ticks: {
            color: colors.axisLabels,
            callback: (value) => formatChartCurrency(Number(value), { abbreviated: true }),
          },
          beginAtZero: false,
        },
      },
      interaction: {
        mode: 'index',
        intersect: false,
      },
    };
  }, [colors, periodType]);

  // Handle loading state
  if (isLoading) {
    return (
      <div className={`balance-trends-chart ${className}`.trim()}>
        <div className="balance-trends-chart__header">
          <ChartTypeToggle
            chartType={chartType}
            onTypeChange={setChartType}
          />
        </div>
        <div 
          className="balance-trends-chart__loading"
          data-testid="loading-state"
        >
          Loading chart data...
        </div>
      </div>
    );
  }

  // Check if there are no transactions (empty state)
  const hasTransactions = transactions && transactions.length > 0;

  // Handle error state or empty data
  if (error || !data || !chartData || !hasTransactions) {
    return (
      <div className={`balance-trends-chart ${className}`.trim()}>
        <div className="balance-trends-chart__header">
          <ChartTypeToggle
            chartType={chartType}
            onTypeChange={setChartType}
          />
        </div>
        <div 
          className="balance-trends-chart__empty"
          data-testid="empty-state"
        >
          <div className="empty-state-icon">📊</div>
          <p className="empty-state-message">No data to display</p>
          <p className="empty-state-hint">
            {error ? 'An error occurred while loading the chart' : 'Add transactions to see your balance trends'}
          </p>
        </div>
      </div>
    );
  }

  // Render chart
  const ChartComponent = chartType === 'line' ? Line : Bar;

  return (
    <div className={`balance-trends-chart ${className}`.trim()}>
      <div className="balance-trends-chart__header">
        <ChartTypeToggle
          chartType={chartType}
          onTypeChange={setChartType}
        />
      </div>

      <div 
        className="balance-trends-chart__container"
        style={{ height: `${chartHeight}px` }}
        data-testid="chart-container"
        role="img"
        aria-label={`Balance trends ${periodType}ly chart showing data from ${data.period.start} to ${data.period.end}`}
      >
        <ChartComponent
          data={chartData}
          options={chartOptions as any}
        />
      </div>

      {/* Summary statistics */}
      <div className="balance-trends-chart__summary">
        <div className="summary-stat">
          <span className="summary-stat__label">Starting</span>
          <span className="summary-stat__value">
            {formatChartCurrency(data.startingBalance)}
          </span>
        </div>
        <div className="summary-stat">
          <span className="summary-stat__label">Ending</span>
          <span className="summary-stat__value">
            {formatChartCurrency(data.endingBalance)}
          </span>
        </div>
        <div className="summary-stat">
          <span className="summary-stat__label">Change</span>
          <span 
            className={`summary-stat__value ${
              data.change >= 0 ? 'summary-stat__value--positive' : 'summary-stat__value--negative'
            }`}
          >
            {data.change >= 0 ? '+' : ''}
            {formatChartCurrency(data.change)}
            {' '}
            ({data.changePercentage >= 0 ? '+' : ''}
            {data.changePercentage.toFixed(1)}%)
          </span>
        </div>
      </div>
    </div>
  );
}
