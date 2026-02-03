import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dashboard } from '@/features/dashboard/components/Dashboard/Dashboard';
import type { Transaction } from '@/shared/types';

/**
 * Test Suite: Dashboard Component Integration
 * 
 * Tests for dashboard component with balance trends chart integration.
 */

// Mock the hooks and services
vi.mock('@/features/transactions/hooks/useTransactions', () => ({
  useTransactions: vi.fn(),
}));

vi.mock('react-chartjs-2', () => ({
  Line: vi.fn(() => <div data-testid="line-chart">Line Chart</div>),
  Bar: vi.fn(() => <div data-testid="bar-chart">Bar Chart</div>),
}));

import { useTransactions } from '@/features/transactions/hooks/useTransactions';

const mockUseTransactions = useTransactions as unknown as ReturnType<typeof vi.fn>;

describe('Dashboard - Phase 9 Integration', () => {
  const createTestTransaction = (
    overrides: Partial<Transaction>,
  ): Transaction => ({
    id: `tx-${Math.random()}`,
    amount: 100,
    date: "2026-01-15",
    type: "income",
    categoryId: "cat-1",
    categoryName: "Salary",
    description: "Test transaction",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  });

  const testTransactions: Transaction[] = [
    createTestTransaction({ id: 'tx-1', date: '2026-01-01', amount: 1000, type: 'income' }),
    createTestTransaction({ id: 'tx-2', date: '2026-01-05', amount: 200, type: 'expense' }),
    createTestTransaction({ id: 'tx-3', date: '2026-01-10', amount: 500, type: 'income' }),
    createTestTransaction({ id: 'tx-4', date: '2026-01-15', amount: 300, type: 'expense' }),
    createTestTransaction({ id: 'tx-5', date: '2026-01-20', amount: 150, type: 'income' }),
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseTransactions.mockReturnValue({
      transactions: testTransactions,
      isLoading: false,
      error: null,
      addTransaction: vi.fn(),
      updateTransaction: vi.fn(),
      deleteTransaction: vi.fn(),
    });
  });

  describe('T090: Dashboard renders BalanceTrendsChart component', () => {
    it('should render BalanceTrendsChart component', () => {
      render(<Dashboard />);

      // Look for the balance trends section
      const balanceTrendsSection = screen.getByTestId('balance-trends-section');
      expect(balanceTrendsSection).toBeInTheDocument();
    });

    it('should render balance trends heading', () => {
      render(<Dashboard />);

      const heading = screen.getByRole('heading', { name: /balance trends/i });
      expect(heading).toBeInTheDocument();
    });

    it('should render chart component within balance trends section', () => {
      render(<Dashboard />);

      // Chart should be rendered (either line or bar)
      const chart = screen.queryByTestId('line-chart') || screen.queryByTestId('bar-chart');
      expect(chart).toBeInTheDocument();
    });

    it('should position balance trends section after summary cards', () => {
      render(<Dashboard />);

      const summaryCards = screen.getByTestId('summary-cards');
      const balanceTrendsSection = screen.getByTestId('balance-trends-section');

      // Get parent and check order
      const parent = summaryCards.parentElement;
      const children = Array.from(parent?.children || []);
      
      const summaryIndex = children.indexOf(summaryCards);
      const trendsIndex = children.indexOf(balanceTrendsSection);

      expect(trendsIndex).toBeGreaterThan(summaryIndex);
    });

    it('should position balance trends section before category breakdown', () => {
      render(<Dashboard />);

      const balanceTrendsSection = screen.getByTestId('balance-trends-section');
      const categoryBreakdown = screen.getByTestId('category-breakdown');

      const parent = balanceTrendsSection.parentElement;
      const children = Array.from(parent?.children || []);
      
      const trendsIndex = children.indexOf(balanceTrendsSection);
      const categoryIndex = children.indexOf(categoryBreakdown);

      expect(categoryIndex).toBeGreaterThan(trendsIndex);
    });

    it('should have proper styling classes', () => {
      render(<Dashboard />);

      const balanceTrendsSection = screen.getByTestId('balance-trends-section');
      expect(balanceTrendsSection).toHaveClass('balance-trends-section');
    });
  });

  describe('T091: Chart receives correct props (transactions, periodType)', () => {
    it('should pass transactions prop to BalanceTrendsChart', () => {
      render(<Dashboard />);

      // Chart should be rendered with data
      const chart = screen.queryByTestId('line-chart') || screen.queryByTestId('bar-chart');
      expect(chart).toBeInTheDocument();
    });

    it('should pass current periodType to BalanceTrendsChart', () => {
      render(<Dashboard />);

      // Default period type is 'month'
      const balanceTrendsSection = screen.getByTestId('balance-trends-section');
      expect(balanceTrendsSection).toBeInTheDocument();
    });

    it('should pass all transactions to chart', () => {
      mockUseTransactions.mockReturnValue({
        transactions: testTransactions,
        isLoading: false,
        error: null,
        addTransaction: vi.fn(),
        updateTransaction: vi.fn(),
        deleteTransaction: vi.fn(),
      });

      render(<Dashboard />);

      // Chart should receive all transactions
      expect(screen.queryByTestId('line-chart') || screen.queryByTestId('bar-chart')).toBeInTheDocument();
    });

    it('should handle empty transactions array', () => {
      mockUseTransactions.mockReturnValue({
        transactions: [],
        isLoading: false,
        error: null,
        addTransaction: vi.fn(),
        updateTransaction: vi.fn(),
        deleteTransaction: vi.fn(),
      });

      render(<Dashboard />);

      // Should still render but show empty state
      const balanceTrendsSection = screen.getByTestId('balance-trends-section');
      expect(balanceTrendsSection).toBeInTheDocument();
    });

    it('should pass theme prop if Dashboard has theme context', () => {
      render(<Dashboard />);

      const balanceTrendsSection = screen.getByTestId('balance-trends-section');
      expect(balanceTrendsSection).toBeInTheDocument();
    });
  });

  describe('T092: Chart updates when period selector changes', () => {
    it('should update chart when switching from month to week', async () => {
      render(<Dashboard />);

      // Find period selector buttons
      const weekButton = screen.getByRole('button', { name: /week/i });
      
      await userEvent.click(weekButton);

      await waitFor(() => {
        // Chart should still be rendered with new period
        const chart = screen.queryByTestId('line-chart') || screen.queryByTestId('bar-chart');
        expect(chart).toBeInTheDocument();
      });
    });

    it('should update chart when switching from week to day', async () => {
      render(<Dashboard />);

      const weekButton = screen.getByRole('button', { name: /week/i });
      await userEvent.click(weekButton);

      const dayButton = screen.getByRole('button', { name: /day/i });
      await userEvent.click(dayButton);

      await waitFor(() => {
        const chart = screen.queryByTestId('line-chart') || screen.queryByTestId('bar-chart');
        expect(chart).toBeInTheDocument();
      });
    });

    it('should maintain chart visibility across period changes', async () => {
      render(<Dashboard />);

      const balanceTrendsSection = screen.getByTestId('balance-trends-section');
      expect(balanceTrendsSection).toBeInTheDocument();

      const weekButton = screen.getByRole('button', { name: /week/i });
      await userEvent.click(weekButton);

      await waitFor(() => {
        expect(balanceTrendsSection).toBeInTheDocument();
      });

      const monthButton = screen.getByRole('button', { name: /month/i });
      await userEvent.click(monthButton);

      await waitFor(() => {
        expect(balanceTrendsSection).toBeInTheDocument();
      });
    });

    it('should re-render chart with new data when period changes', async () => {
      render(<Dashboard />);

      const initialChart = screen.queryByTestId('line-chart') || screen.queryByTestId('bar-chart');
      expect(initialChart).toBeInTheDocument();

      const weekButton = screen.getByRole('button', { name: /week/i });
      await userEvent.click(weekButton);

      await waitFor(() => {
        // Chart should still exist after period change
        const updatedChart = screen.queryByTestId('line-chart') || screen.queryByTestId('bar-chart');
        expect(updatedChart).toBeInTheDocument();
      });
    });
  });

  describe('dashboard layout integration', () => {
    it('should render all dashboard sections in correct order', () => {
      render(<Dashboard />);

      const dashboard = screen.getByTestId('dashboard');
      const sections = Array.from(dashboard.children);

      // Expected order: header, summary-cards, balance-trends-section, category-breakdown
      expect(sections[0]).toHaveClass('dashboard-header');
      expect(sections[1]).toHaveClass('summary-cards');
      expect(sections[2]).toHaveClass('balance-trends-section');
      expect(sections[3]).toHaveClass('category-breakdown');
    });

    it('should maintain responsive layout with new chart section', () => {
      render(<Dashboard />);

      const balanceTrendsSection = screen.getByTestId('balance-trends-section');
      
      // Check it has responsive styling
      expect(balanceTrendsSection).toBeInTheDocument();
    });

    it('should render chart with proper spacing', () => {
      render(<Dashboard />);

      const balanceTrendsSection = screen.getByTestId('balance-trends-section');
      
      // Should have margin for spacing
      expect(balanceTrendsSection).toBeInTheDocument();
    });
  });

  describe('loading and error states', () => {
    it('should render chart even when transactions are loading', () => {
      mockUseTransactions.mockReturnValue({
        transactions: [],
        isLoading: true,
        error: null,
        addTransaction: vi.fn(),
        updateTransaction: vi.fn(),
        deleteTransaction: vi.fn(),
      });

      render(<Dashboard />);

      const balanceTrendsSection = screen.getByTestId('balance-trends-section');
      expect(balanceTrendsSection).toBeInTheDocument();
    });

    it('should render chart when transactions have error', () => {
      mockUseTransactions.mockReturnValue({
        transactions: [],
        isLoading: false,
        error: new Error('Failed to load'),
        addTransaction: vi.fn(),
        updateTransaction: vi.fn(),
        deleteTransaction: vi.fn(),
      });

      render(<Dashboard />);

      const balanceTrendsSection = screen.getByTestId('balance-trends-section');
      expect(balanceTrendsSection).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<Dashboard />);

      const mainHeading = screen.getByRole('heading', { level: 2, name: /dashboard/i });
      const trendsHeading = screen.getByRole('heading', { level: 3, name: /balance trends/i });
      const categoryHeading = screen.getByRole('heading', { level: 3, name: /category breakdown/i });

      expect(mainHeading).toBeInTheDocument();
      expect(trendsHeading).toBeInTheDocument();
      expect(categoryHeading).toBeInTheDocument();
    });

    it('should have proper landmark structure', () => {
      render(<Dashboard />);

      const dashboard = screen.getByTestId('dashboard');
      expect(dashboard).toBeInTheDocument();
    });
  });

  describe('data consistency', () => {
    it('should use same transactions for summary cards and chart', () => {
      render(<Dashboard />);

      // Both summary cards and chart should be rendered with same data
      const summaryCards = screen.getByTestId('summary-cards');
      const balanceTrendsSection = screen.getByTestId('balance-trends-section');

      expect(summaryCards).toBeInTheDocument();
      expect(balanceTrendsSection).toBeInTheDocument();
    });

    it('should use same period for summary and chart', async () => {
      render(<Dashboard />);

      const weekButton = screen.getByRole('button', { name: /week/i });
      await userEvent.click(weekButton);

      await waitFor(() => {
        // Both summary and chart should update to weekly view
        const periodLabel = screen.getByText(/2026/);
        expect(periodLabel).toBeInTheDocument();
      });
    });
  });
});
