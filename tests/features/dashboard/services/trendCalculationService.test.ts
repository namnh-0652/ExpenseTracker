import { describe, it, expect } from 'vitest';
import {
  calculateBalanceTrend,
  groupTransactionsByPeriod,
  calculateStartingBalance,
  calculateDateRange,
  filterTransactionsByDateRange,
} from '@/features/dashboard/services/trendCalculationService';
import type { Transaction } from '@/shared/types';
import type { TimePeriod, DateRange } from '@/features/dashboard/types/trendTypes';

/**
 * Test Suite: Balance Trend Calculation Service
 * 
 * Tests for calculating balance trends over time periods.
 * Follows TDD approach - tests written before implementation.
 */

describe('trendCalculationService', () => {
  // Test data setup
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
    // Before period (for starting balance calculation)
    createTestTransaction({ id: 'tx-1', date: '2025-12-01', amount: 1000, type: 'income' }),
    createTestTransaction({ id: 'tx-2', date: '2025-12-15', amount: 200, type: 'expense' }),
    createTestTransaction({ id: 'tx-3', date: '2026-01-01', amount: 300, type: 'income' }),
    
    // During period (2026-01-05 to 2026-02-03)
    createTestTransaction({ id: 'tx-4', date: '2026-01-05', amount: 150, type: 'income' }),
    createTestTransaction({ id: 'tx-5', date: '2026-01-05', amount: 50, type: 'expense' }),
    createTestTransaction({ id: 'tx-6', date: '2026-01-10', amount: 200, type: 'income' }),
    createTestTransaction({ id: 'tx-7', date: '2026-01-10', amount: 75, type: 'expense' }),
    createTestTransaction({ id: 'tx-8', date: '2026-01-15', amount: 300, type: 'income' }),
    createTestTransaction({ id: 'tx-9', date: '2026-01-20', amount: 100, type: 'expense' }),
    createTestTransaction({ id: 'tx-10', date: '2026-02-01', amount: 250, type: 'income' }),
  ];

  describe('calculateBalanceTrend', () => {
    it('T012: should return correct data structure with all required fields', () => {
      const period: TimePeriod = {
        type: 'day',
        anchorDate: '2026-02-03',
      };

      const result = calculateBalanceTrend(testTransactions, period);

      // Verify data structure
      expect(result).toHaveProperty('points');
      expect(result).toHaveProperty('period');
      expect(result).toHaveProperty('startingBalance');
      expect(result).toHaveProperty('endingBalance');
      expect(result).toHaveProperty('change');
      expect(result).toHaveProperty('changePercentage');

      // Verify points structure
      expect(Array.isArray(result.points)).toBe(true);
      if (result.points.length > 0) {
        const firstPoint = result.points[0];
        expect(firstPoint).toHaveProperty('date');
        expect(firstPoint).toHaveProperty('balance');
        expect(firstPoint).toHaveProperty('income');
        expect(firstPoint).toHaveProperty('expense');
        expect(firstPoint).toHaveProperty('transactionCount');
      }

      // Verify period structure
      expect(result.period).toHaveProperty('start');
      expect(result.period).toHaveProperty('end');
      expect(result.period).toHaveProperty('type');
      expect(result.period.type).toBe('day');
    });

    it('T013: should handle empty transaction array without errors', () => {
      const period: TimePeriod = {
        type: 'day',
        anchorDate: '2026-02-03',
      };

      const result = calculateBalanceTrend([], period);

      // Should return valid structure with zero balances
      expect(result.points).toHaveLength(30); // 30 days
      expect(result.startingBalance).toBe(0);
      expect(result.endingBalance).toBe(0);
      expect(result.change).toBe(0);
      expect(result.changePercentage).toBe(0);

      // All points should have zero values
      result.points.forEach(point => {
        expect(point.balance).toBe(0);
        expect(point.income).toBe(0);
        expect(point.expense).toBe(0);
        expect(point.transactionCount).toBe(0);
      });
    });

    it('T018: should generate exactly 30 data points for daily view', () => {
      const period: TimePeriod = {
        type: 'day',
        anchorDate: '2026-02-03',
      };

      const result = calculateBalanceTrend(testTransactions, period);

      expect(result.points).toHaveLength(30);
      expect(result.period.type).toBe('day');
      
      // Verify date range: 30 days ending on anchor date
      expect(result.period.end).toBe('2026-02-03');
      expect(result.period.start).toBe('2026-01-05'); // 29 days before
    });

    it('T019: should generate exactly 12 data points for weekly view', () => {
      const period: TimePeriod = {
        type: 'week',
        anchorDate: '2026-02-03',
      };

      const result = calculateBalanceTrend(testTransactions, period);

      expect(result.points).toHaveLength(12);
      expect(result.period.type).toBe('week');
      
      // Weekly view should span 12 weeks (84 days)
      const expectedStart = new Date('2026-02-03');
      expectedStart.setDate(expectedStart.getDate() - 83);
      expect(result.period.end).toBe('2026-02-03');
    });

    it('T020: should generate exactly 12 data points for monthly view', () => {
      const period: TimePeriod = {
        type: 'month',
        anchorDate: '2026-02-03',
      };

      const result = calculateBalanceTrend(testTransactions, period);

      expect(result.points).toHaveLength(12);
      expect(result.period.type).toBe('month');
      
      // Monthly view should span 12 months
      expect(result.period.end).toBe('2026-02-03');
    });

    it('T021: should calculate cumulative balance correctly across data points', () => {
      const period: TimePeriod = {
        type: 'day',
        anchorDate: '2026-02-03',
      };

      const result = calculateBalanceTrend(testTransactions, period);

      // Verify balance is cumulative (each point includes all previous transactions)
      let expectedBalance = result.startingBalance;
      
      result.points.forEach(point => {
        expectedBalance += point.income - point.expense;
        expect(point.balance).toBe(expectedBalance);
      });

      // Final point balance should equal ending balance
      expect(result.points[result.points.length - 1].balance).toBe(result.endingBalance);
    });

    it('T022: should handle decimal amounts without rounding errors', () => {
      const decimalTransactions: Transaction[] = [
        createTestTransaction({ id: 'dec-1', date: '2026-01-10', amount: 99.99, type: 'income' }),
        createTestTransaction({ id: 'dec-2', date: '2026-01-11', amount: 0.01, type: 'income' }),
        createTestTransaction({ id: 'dec-3', date: '2026-01-12', amount: 33.33, type: 'expense' }),
        createTestTransaction({ id: 'dec-4', date: '2026-01-13', amount: 66.67, type: 'expense' }),
      ];

      const period: TimePeriod = {
        type: 'day',
        anchorDate: '2026-02-03',
      };

      const result = calculateBalanceTrend(decimalTransactions, period);

      // Should not have rounding errors
      // 99.99 + 0.01 - 33.33 - 66.67 = 0
      const expectedTotal = 99.99 + 0.01 - 33.33 - 66.67;
      expect(result.endingBalance).toBeCloseTo(expectedTotal, 2);
      expect(result.change).toBeCloseTo(expectedTotal, 2);
    });

    it('should throw error for invalid period type', () => {
      const invalidPeriod = {
        type: 'quarter' as any,
        anchorDate: '2026-02-03',
      };

      expect(() => calculateBalanceTrend(testTransactions, invalidPeriod)).toThrow('Invalid period type');
    });

    it('should throw error for invalid anchor date format', () => {
      const invalidPeriod: TimePeriod = {
        type: 'day',
        anchorDate: '02/03/2026', // Invalid format
      };

      expect(() => calculateBalanceTrend(testTransactions, invalidPeriod)).toThrow('Invalid anchor date');
    });

    it('should throw error for future anchor date', () => {
      const futurePeriod: TimePeriod = {
        type: 'day',
        anchorDate: '2027-12-31', // Future date
      };

      expect(() => calculateBalanceTrend(testTransactions, futurePeriod)).toThrow('future');
    });

    it('should calculate change percentage correctly', () => {
      const period: TimePeriod = {
        type: 'day',
        anchorDate: '2026-02-03',
      };

      const result = calculateBalanceTrend(testTransactions, period);

      const expectedPercentage = result.startingBalance === 0
        ? 0
        : (result.change / Math.abs(result.startingBalance)) * 100;

      expect(result.changePercentage).toBeCloseTo(expectedPercentage, 2);
    });

    it('should handle zero starting balance without division error', () => {
      const noInitialTransactions: Transaction[] = [
        createTestTransaction({ id: 'new-1', date: '2026-01-10', amount: 100, type: 'income' }),
        createTestTransaction({ id: 'new-2', date: '2026-01-15', amount: 50, type: 'expense' }),
      ];

      const period: TimePeriod = {
        type: 'day',
        anchorDate: '2026-02-03',
      };

      const result = calculateBalanceTrend(noInitialTransactions, period);

      // Should not throw error, changePercentage should be 0 when starting balance is 0
      expect(result.changePercentage).toBe(0);
      expect(result.startingBalance).toBe(0);
    });
  });

  describe('groupTransactionsByPeriod', () => {
    it('T014: should aggregate transactions correctly by date', () => {
      const transactions: Transaction[] = [
        createTestTransaction({ id: 'g-1', date: '2026-01-10', amount: 100, type: 'income' }),
        createTestTransaction({ id: 'g-2', date: '2026-01-10', amount: 50, type: 'expense' }),
        createTestTransaction({ id: 'g-3', date: '2026-01-11', amount: 200, type: 'income' }),
      ];

      const grouped = groupTransactionsByPeriod(transactions, 'day');

      // Check 2026-01-10 grouping
      expect(grouped.has('2026-01-10')).toBe(true);
      const group1 = grouped.get('2026-01-10')!;
      expect(group1.income).toBe(100);
      expect(group1.expense).toBe(50);
      expect(group1.count).toBe(2);

      // Check 2026-01-11 grouping
      expect(grouped.has('2026-01-11')).toBe(true);
      const group2 = grouped.get('2026-01-11')!;
      expect(group2.income).toBe(200);
      expect(group2.expense).toBe(0);
      expect(group2.count).toBe(1);
    });

    it('T015: should handle multiple transactions on same date', () => {
      const transactions: Transaction[] = [
        createTestTransaction({ id: 's-1', date: '2026-01-10', amount: 100, type: 'income' }),
        createTestTransaction({ id: 's-2', date: '2026-01-10', amount: 150, type: 'income' }),
        createTestTransaction({ id: 's-3', date: '2026-01-10', amount: 50, type: 'expense' }),
        createTestTransaction({ id: 's-4', date: '2026-01-10', amount: 75, type: 'expense' }),
      ];

      const grouped = groupTransactionsByPeriod(transactions, 'day');

      expect(grouped.size).toBe(1);
      const group = grouped.get('2026-01-10')!;
      expect(group.income).toBe(250); // 100 + 150
      expect(group.expense).toBe(125); // 50 + 75
      expect(group.count).toBe(4);
    });

    it('should group transactions by week (Monday as start)', () => {
      const transactions: Transaction[] = [
        createTestTransaction({ id: 'w-1', date: '2026-01-05', amount: 100, type: 'income' }), // Monday
        createTestTransaction({ id: 'w-2', date: '2026-01-06', amount: 50, type: 'expense' }),  // Tuesday
        createTestTransaction({ id: 'w-3', date: '2026-01-11', amount: 200, type: 'income' }), // Sunday (next week)
      ];

      const grouped = groupTransactionsByPeriod(transactions, 'week');

      // Should have 2 weeks
      expect(grouped.size).toBeGreaterThanOrEqual(1);
      
      // First week should have Monday as key
      const weekKeys = Array.from(grouped.keys());
      weekKeys.forEach(key => {
        const date = new Date(key);
        // Should be Monday (day 1)
        expect([0, 1]).toContain(date.getDay()); // 0=Sunday, 1=Monday
      });
    });

    it('should group transactions by month (first day as key)', () => {
      const transactions: Transaction[] = [
        createTestTransaction({ id: 'm-1', date: '2026-01-05', amount: 100, type: 'income' }),
        createTestTransaction({ id: 'm-2', date: '2026-01-15', amount: 50, type: 'expense' }),
        createTestTransaction({ id: 'm-3', date: '2026-02-01', amount: 200, type: 'income' }),
      ];

      const grouped = groupTransactionsByPeriod(transactions, 'month');

      // Should have 2 months
      expect(grouped.size).toBe(2);
      
      // Keys should be first day of month
      expect(grouped.has('2026-01-01')).toBe(true);
      expect(grouped.has('2026-02-01')).toBe(true);

      const jan = grouped.get('2026-01-01')!;
      expect(jan.income).toBe(100);
      expect(jan.expense).toBe(50);
      expect(jan.count).toBe(2);
    });
  });

  describe('calculateStartingBalance', () => {
    it('T016: should return zero when no transactions before period start', () => {
      const transactions: Transaction[] = [
        createTestTransaction({ id: 'n-1', date: '2026-01-10', amount: 100, type: 'income' }),
        createTestTransaction({ id: 'n-2', date: '2026-01-15', amount: 50, type: 'expense' }),
      ];

      const startingBalance = calculateStartingBalance(transactions, '2026-01-05');

      expect(startingBalance).toBe(0);
    });

    it('T017: should calculate correct balance from transactions before period start', () => {
      const transactions: Transaction[] = [
        createTestTransaction({ id: 'b-1', date: '2025-12-01', amount: 1000, type: 'income' }),
        createTestTransaction({ id: 'b-2', date: '2025-12-15', amount: 200, type: 'expense' }),
        createTestTransaction({ id: 'b-3', date: '2026-01-01', amount: 300, type: 'income' }),
        createTestTransaction({ id: 'b-4', date: '2026-01-10', amount: 100, type: 'income' }), // After period start
      ];

      const startingBalance = calculateStartingBalance(transactions, '2026-01-05');

      // Should only include transactions before 2026-01-05
      // 1000 - 200 + 300 = 1100
      expect(startingBalance).toBe(1100);
    });

    it('should handle negative starting balance', () => {
      const transactions: Transaction[] = [
        createTestTransaction({ id: 'neg-1', date: '2025-12-01', amount: 100, type: 'income' }),
        createTestTransaction({ id: 'neg-2', date: '2025-12-15', amount: 500, type: 'expense' }),
      ];

      const startingBalance = calculateStartingBalance(transactions, '2026-01-01');

      expect(startingBalance).toBe(-400); // 100 - 500
    });
  });

  describe('calculateDateRange', () => {
    it('should calculate correct date range for daily period', () => {
      const dateRange = calculateDateRange('day', '2026-02-03');

      expect(dateRange.end).toBe('2026-02-03');
      expect(dateRange.start).toBe('2026-01-05'); // 29 days before
    });

    it('should calculate correct date range for weekly period', () => {
      const dateRange = calculateDateRange('week', '2026-02-03');

      expect(dateRange.end).toBe('2026-02-03');
      // 12 weeks = 84 days, so start should be 83 days before
      const expectedStart = new Date('2026-02-03');
      expectedStart.setDate(expectedStart.getDate() - 83);
      expect(dateRange.start).toBe(expectedStart.toISOString().split('T')[0]);
    });

    it('should calculate correct date range for monthly period', () => {
      const dateRange = calculateDateRange('month', '2026-02-03');

      expect(dateRange.end).toBe('2026-02-03');
      // 12 months back from Feb 2026: Feb 2026 back to March 2025 (inclusive = 12 months)
      // Feb 3, 2026 - 11 months = March 3, 2025, first day = March 1, 2025
      expect(dateRange.start).toBe('2025-03-01');
    });
  });

  describe('filterTransactionsByDateRange', () => {
    it('should filter transactions within date range (inclusive)', () => {
      const transactions: Transaction[] = [
        createTestTransaction({ id: 'f-1', date: '2026-01-01', amount: 100, type: 'income' }),
        createTestTransaction({ id: 'f-2', date: '2026-01-05', amount: 50, type: 'expense' }),
        createTestTransaction({ id: 'f-3', date: '2026-01-10', amount: 200, type: 'income' }),
        createTestTransaction({ id: 'f-4', date: '2026-01-15', amount: 75, type: 'expense' }),
        createTestTransaction({ id: 'f-5', date: '2026-01-20', amount: 150, type: 'income' }),
      ];

      const dateRange: DateRange = {
        start: '2026-01-05',
        end: '2026-01-15',
      };

      const filtered = filterTransactionsByDateRange(transactions, dateRange);

      expect(filtered).toHaveLength(3);
      expect(filtered.map(t => t.id)).toEqual(['f-2', 'f-3', 'f-4']);
    });

    it('should include boundary dates (start and end)', () => {
      const transactions: Transaction[] = [
        createTestTransaction({ id: 'bd-1', date: '2026-01-01', amount: 100, type: 'income' }),
        createTestTransaction({ id: 'bd-2', date: '2026-01-05', amount: 50, type: 'expense' }),
        createTestTransaction({ id: 'bd-3', date: '2026-01-10', amount: 200, type: 'income' }),
      ];

      const dateRange: DateRange = {
        start: '2026-01-01',
        end: '2026-01-10',
      };

      const filtered = filterTransactionsByDateRange(transactions, dateRange);

      // Should include both boundary dates
      expect(filtered).toHaveLength(3);
    });

    it('should return empty array when no transactions in range', () => {
      const transactions: Transaction[] = [
        createTestTransaction({ id: 'nr-1', date: '2025-12-01', amount: 100, type: 'income' }),
        createTestTransaction({ id: 'nr-2', date: '2026-02-15', amount: 50, type: 'expense' }),
      ];

      const dateRange: DateRange = {
        start: '2026-01-01',
        end: '2026-01-31',
      };

      const filtered = filterTransactionsByDateRange(transactions, dateRange);

      expect(filtered).toHaveLength(0);
    });
  });

  describe('edge cases and validation', () => {
    it('should handle single transaction', () => {
      const transactions: Transaction[] = [
        createTestTransaction({ id: 'single', date: '2026-01-15', amount: 100, type: 'income' }),
      ];

      const period: TimePeriod = {
        type: 'day',
        anchorDate: '2026-02-03',
      };

      const result = calculateBalanceTrend(transactions, period);

      expect(result.points).toHaveLength(30);
      expect(result.endingBalance).toBe(100);
      expect(result.change).toBe(100);
    });

    it('should handle transactions on period boundaries', () => {
      const period: TimePeriod = {
        type: 'day',
        anchorDate: '2026-02-03',
      };

      const dateRange = calculateDateRange('day', '2026-02-03');

      const transactions: Transaction[] = [
        createTestTransaction({ id: 'bound-1', date: dateRange.start, amount: 100, type: 'income' }),
        createTestTransaction({ id: 'bound-2', date: dateRange.end, amount: 50, type: 'expense' }),
      ];

      const result = calculateBalanceTrend(transactions, period);

      // Both boundary transactions should be included
      expect(result.points[0].income).toBe(100);
      expect(result.points[result.points.length - 1].expense).toBe(50);
    });

    it('should maintain balance accuracy with large numbers', () => {
      const transactions: Transaction[] = [
        createTestTransaction({ id: 'large-1', date: '2026-01-10', amount: 1000000, type: 'income' }),
        createTestTransaction({ id: 'large-2', date: '2026-01-15', amount: 999999.99, type: 'expense' }),
      ];

      const period: TimePeriod = {
        type: 'day',
        anchorDate: '2026-02-03',
      };

      const result = calculateBalanceTrend(transactions, period);

      expect(result.endingBalance).toBeCloseTo(0.01, 2);
    });

    it('should sort points chronologically', () => {
      const period: TimePeriod = {
        type: 'day',
        anchorDate: '2026-02-03',
      };

      const result = calculateBalanceTrend(testTransactions, period);

      // Verify points are in chronological order
      for (let i = 1; i < result.points.length; i++) {
        expect(result.points[i].date >= result.points[i - 1].date).toBe(true);
      }
    });
  });
});
