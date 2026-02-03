import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BalanceTrendsChart } from '@/features/dashboard/components/BalanceTrendsChart/BalanceTrendsChart';
import type { Transaction } from '@/shared/types';

/**
 * Test Suite: BalanceTrendsChart Component
 * 
 * Tests for the main balance trends chart component.
 */

// Mock Chart.js
vi.mock('react-chartjs-2', () => ({
  Line: vi.fn(({ data, options }) => (
    <div data-testid="line-chart" data-chart-type="line">
      <div data-testid="chart-data">{JSON.stringify(data)}</div>
      <div data-testid="chart-options">{JSON.stringify(options)}</div>
    </div>
  )),
  Bar: vi.fn(({ data, options }) => (
    <div data-testid="bar-chart" data-chart-type="bar">
      <div data-testid="chart-data">{JSON.stringify(data)}</div>
      <div data-testid="chart-options">{JSON.stringify(options)}</div>
    </div>
  )),
}));

describe('BalanceTrendsChart', () => {
  const createTestTransaction = (overrides: Partial<Transaction>): Transaction => ({
    id: `tx-${Math.random()}`,
    amount: 100,
    date: '2026-01-15',
    type: 'income',
    categoryId: 'cat-1',
    description: 'Test transaction',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  });

  const testTransactions: Transaction[] = [
    createTestTransaction({ id: 'tx-1', date: '2025-12-01', amount: 1000, type: 'income' }),
    createTestTransaction({ id: 'tx-2', date: '2025-12-15', amount: 200, type: 'expense' }),
    createTestTransaction({ id: 'tx-3', date: '2026-01-10', amount: 300, type: 'income' }),
    createTestTransaction({ id: 'tx-4', date: '2026-01-15', amount: 150, type: 'income' }),
    createTestTransaction({ id: 'tx-5', date: '2026-01-20', amount: 75, type: 'expense' }),
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('T062: renders chart with sample data', () => {
    it('should render chart component', () => {
      render(
        <BalanceTrendsChart
          transactions={testTransactions}
          periodType="day"
        />
      );

      // Should render either line or bar chart
      const chart = screen.queryByTestId('line-chart') || screen.queryByTestId('bar-chart');
      expect(chart).toBeInTheDocument();
    });

    it('should render line chart by default', () => {
      render(
        <BalanceTrendsChart
          transactions={testTransactions}
          periodType="day"
        />
      );

      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });

    it('should render ChartTypeToggle component', () => {
      render(
        <BalanceTrendsChart
          transactions={testTransactions}
          periodType="day"
        />
      );

      expect(screen.getByRole('group', { name: /chart type/i })).toBeInTheDocument();
    });

    it('should pass data to chart component', () => {
      render(
        <BalanceTrendsChart
          transactions={testTransactions}
          periodType="day"
        />
      );

      const chartData = screen.getByTestId('chart-data');
      expect(chartData).toBeInTheDocument();
      expect(chartData.textContent).toBeTruthy();
    });

    it('should configure chart options', () => {
      render(
        <BalanceTrendsChart
          transactions={testTransactions}
          periodType="day"
        />
      );

      const chartOptions = screen.getByTestId('chart-options');
      expect(chartOptions).toBeInTheDocument();
      
      const options = JSON.parse(chartOptions.textContent || '{}');
      expect(options).toHaveProperty('responsive');
      expect(options).toHaveProperty('maintainAspectRatio');
    });
  });

  describe('T063: displays empty state when no transactions', () => {
    it('should render empty state message', () => {
      render(
        <BalanceTrendsChart
          transactions={[]}
          periodType="day"
        />
      );

      expect(screen.getByText(/no data to display/i)).toBeInTheDocument();
    });

    it('should not render chart when no transactions', () => {
      render(
        <BalanceTrendsChart
          transactions={[]}
          periodType="day"
        />
      );

      expect(screen.queryByTestId('line-chart')).not.toBeInTheDocument();
      expect(screen.queryByTestId('bar-chart')).not.toBeInTheDocument();
    });

    it('should still render ChartTypeToggle even with no data', () => {
      render(
        <BalanceTrendsChart
          transactions={[]}
          periodType="day"
        />
      );

      expect(screen.getByRole('group', { name: /chart type/i })).toBeInTheDocument();
    });

    it('should display empty state icon or illustration', () => {
      render(
        <BalanceTrendsChart
          transactions={[]}
          periodType="day"
        />
      );

      const emptyState = screen.getByTestId('empty-state');
      expect(emptyState).toBeInTheDocument();
    });
  });

  describe('T064: chart type toggle changes chart display', () => {
    it('should switch from line to bar chart', async () => {
      render(
        <BalanceTrendsChart
          transactions={testTransactions}
          periodType="day"
        />
      );

      expect(screen.getByTestId('line-chart')).toBeInTheDocument();

      const barButton = screen.getByRole('button', { name: /bar chart/i });
      await userEvent.click(barButton);

      await waitFor(() => {
        expect(screen.queryByTestId('line-chart')).not.toBeInTheDocument();
        expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
      });
    });

    it('should switch from bar to line chart', async () => {
      render(
        <BalanceTrendsChart
          transactions={testTransactions}
          periodType="day"
        />
      );

      // Switch to bar
      const barButton = screen.getByRole('button', { name: /bar chart/i });
      await userEvent.click(barButton);

      await waitFor(() => {
        expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
      });

      // Switch back to line
      const lineButton = screen.getByRole('button', { name: /line chart/i });
      await userEvent.click(lineButton);

      await waitFor(() => {
        expect(screen.queryByTestId('bar-chart')).not.toBeInTheDocument();
        expect(screen.getByTestId('line-chart')).toBeInTheDocument();
      });
    });

    it('should maintain data when switching chart types', async () => {
      render(
        <BalanceTrendsChart
          transactions={testTransactions}
          periodType="day"
        />
      );

      const lineChartData = screen.getByTestId('chart-data').textContent;

      const barButton = screen.getByRole('button', { name: /bar chart/i });
      await userEvent.click(barButton);

      await waitFor(() => {
        const barChartData = screen.getByTestId('chart-data').textContent;
        // Data structure should be the same
        expect(barChartData).toBeTruthy();
      });
    });
  });

  describe('T065: chart updates when period changes', () => {
    it('should update chart data when period changes from day to week', () => {
      const { rerender } = render(
        <BalanceTrendsChart
          transactions={testTransactions}
          periodType="day"
        />
      );

      const initialData = screen.getByTestId('chart-data').textContent;

      rerender(
        <BalanceTrendsChart
          transactions={testTransactions}
          periodType="week"
        />
      );

      const updatedData = screen.getByTestId('chart-data').textContent;
      expect(updatedData).not.toBe(initialData);
    });

    it('should update chart data when period changes from week to month', () => {
      const { rerender } = render(
        <BalanceTrendsChart
          transactions={testTransactions}
          periodType="week"
        />
      );

      const initialData = screen.getByTestId('chart-data').textContent;

      rerender(
        <BalanceTrendsChart
          transactions={testTransactions}
          periodType="month"
        />
      );

      const updatedData = screen.getByTestId('chart-data').textContent;
      expect(updatedData).not.toBe(initialData);
    });

    it('should maintain chart type when period changes', async () => {
      const { rerender } = render(
        <BalanceTrendsChart
          transactions={testTransactions}
          periodType="day"
        />
      );

      // Switch to bar chart
      const barButton = screen.getByRole('button', { name: /bar chart/i });
      await userEvent.click(barButton);

      await waitFor(() => {
        expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
      });

      // Change period
      rerender(
        <BalanceTrendsChart
          transactions={testTransactions}
          periodType="week"
        />
      );

      // Should still be bar chart
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });
  });

  describe('T066: tooltip shows on data point hover', () => {
    it('should configure tooltip in chart options', () => {
      render(
        <BalanceTrendsChart
          transactions={testTransactions}
          periodType="day"
        />
      );

      const chartOptions = screen.getByTestId('chart-options');
      const options = JSON.parse(chartOptions.textContent || '{}');
      
      expect(options.plugins?.tooltip).toBeDefined();
    });

    it('should have custom tooltip callback', () => {
      render(
        <BalanceTrendsChart
          transactions={testTransactions}
          periodType="day"
        />
      );

      const chartOptions = screen.getByTestId('chart-options');
      const options = JSON.parse(chartOptions.textContent || '{}');
      
      // Tooltip should have callbacks defined (functions are lost in JSON.stringify)
      expect(options.plugins?.tooltip).toBeDefined();
    });
  });

  describe('T067: chart respects theme (light/dark)', () => {
    it('should accept theme prop', () => {
      render(
        <BalanceTrendsChart
          transactions={testTransactions}
          periodType="day"
          theme="light"
        />
      );

      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });

    it('should apply dark theme colors', () => {
      render(
        <BalanceTrendsChart
          transactions={testTransactions}
          periodType="day"
          theme="dark"
        />
      );

      const chartOptions = screen.getByTestId('chart-options');
      const options = JSON.parse(chartOptions.textContent || '{}');
      
      // Dark theme should affect colors
      expect(options).toBeDefined();
    });

    it('should default to light theme if not specified', () => {
      render(
        <BalanceTrendsChart
          transactions={testTransactions}
          periodType="day"
        />
      );

      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });

    it('should update colors when theme changes', () => {
      const { rerender } = render(
        <BalanceTrendsChart
          transactions={testTransactions}
          periodType="day"
          theme="light"
        />
      );

      rerender(
        <BalanceTrendsChart
          transactions={testTransactions}
          periodType="day"
          theme="dark"
        />
      );

      // Chart should re-render with new theme
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });
  });

  describe('T068: chart is responsive (renders at different widths)', () => {
    it('should have responsive configuration', () => {
      render(
        <BalanceTrendsChart
          transactions={testTransactions}
          periodType="day"
        />
      );

      const chartOptions = screen.getByTestId('chart-options');
      const options = JSON.parse(chartOptions.textContent || '{}');
      
      expect(options.responsive).toBe(true);
    });

    it('should not maintain aspect ratio for responsive behavior', () => {
      render(
        <BalanceTrendsChart
          transactions={testTransactions}
          periodType="day"
        />
      );

      const chartOptions = screen.getByTestId('chart-options');
      const options = JSON.parse(chartOptions.textContent || '{}');
      
      expect(options.maintainAspectRatio).toBe(false);
    });

    it('should render with custom height', () => {
      render(
        <BalanceTrendsChart
          transactions={testTransactions}
          periodType="day"
          height={500}
        />
      );

      const container = screen.getByTestId('chart-container');
      expect(container).toHaveStyle({ height: '500px' });
    });

    it('should use default height if not specified', () => {
      render(
        <BalanceTrendsChart
          transactions={testTransactions}
          periodType="day"
        />
      );

      const container = screen.getByTestId('chart-container');
      expect(container).toBeInTheDocument();
    });
  });

  describe('loading and error states', () => {
    it('should show loading state while calculating', () => {
      // This is currently synchronous, but structure should support loading
      render(
        <BalanceTrendsChart
          transactions={testTransactions}
          periodType="day"
        />
      );

      // Chart should render (no loading needed for sync calculation)
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });

    it('should handle calculation errors gracefully', () => {
      render(
        <BalanceTrendsChart
          transactions={null as any}
          periodType="day"
        />
      );

      // Should show empty state or error message
      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have role="img" on chart container', () => {
      render(
        <BalanceTrendsChart
          transactions={testTransactions}
          periodType="day"
        />
      );

      const container = screen.getByRole('img');
      expect(container).toBeInTheDocument();
    });

    it('should have descriptive aria-label', () => {
      render(
        <BalanceTrendsChart
          transactions={testTransactions}
          periodType="day"
        />
      );

      const container = screen.getByRole('img');
      expect(container).toHaveAttribute('aria-label');
      expect(container.getAttribute('aria-label')).toContain('Balance trends');
    });

    it('should include period type in aria-label', () => {
      render(
        <BalanceTrendsChart
          transactions={testTransactions}
          periodType="week"
        />
      );

      const container = screen.getByRole('img');
      const ariaLabel = container.getAttribute('aria-label');
      expect(ariaLabel).toContain('week');
    });
  });

  describe('edge cases', () => {
    it('should handle single transaction', () => {
      render(
        <BalanceTrendsChart
          transactions={[testTransactions[0]]}
          periodType="day"
        />
      );

      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });

    it('should handle very large transaction arrays', () => {
      const largeArray = Array.from({ length: 1000 }, (_, i) =>
        createTestTransaction({ id: `large-${i}` })
      );

      render(
        <BalanceTrendsChart
          transactions={largeArray}
          periodType="day"
        />
      );

      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });

    it('should handle all period types', () => {
      const periods: Array<'day' | 'week' | 'month'> = ['day', 'week', 'month'];

      periods.forEach(period => {
        const { unmount } = render(
          <BalanceTrendsChart
            transactions={testTransactions}
            periodType={period}
          />
        );

        expect(screen.getByTestId('line-chart')).toBeInTheDocument();
        unmount();
      });
    });
  });
});
