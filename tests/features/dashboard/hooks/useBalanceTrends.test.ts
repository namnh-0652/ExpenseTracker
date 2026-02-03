import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useBalanceTrends } from '@/features/dashboard/hooks/useBalanceTrends';
import type { Transaction } from '@/shared/types';

/**
 * Test Suite: useBalanceTrends Hook
 * 
 * Tests for custom React hook that calculates balance trends.
 */

describe('useBalanceTrends', () => {
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

  describe('T038: hook returns balance trend data for given period', () => {
    it('should return valid balance trend data structure', () => {
      const { result } = renderHook(() =>
        useBalanceTrends(testTransactions, 'day')
      );

      expect(result.current.data).toBeDefined();
      expect(result.current.data).toHaveProperty('points');
      expect(result.current.data).toHaveProperty('period');
      expect(result.current.data).toHaveProperty('startingBalance');
      expect(result.current.data).toHaveProperty('endingBalance');
      expect(result.current.data).toHaveProperty('change');
      expect(result.current.data).toHaveProperty('changePercentage');
    });

    it('should return data for daily period', () => {
      const { result } = renderHook(() =>
        useBalanceTrends(testTransactions, 'day')
      );

      expect(result.current.data?.period.type).toBe('day');
      expect(result.current.data?.points).toHaveLength(30);
    });

    it('should return data for weekly period', () => {
      const { result } = renderHook(() =>
        useBalanceTrends(testTransactions, 'week')
      );

      expect(result.current.data?.period.type).toBe('week');
      expect(result.current.data?.points).toHaveLength(12);
    });

    it('should return data for monthly period', () => {
      const { result } = renderHook(() =>
        useBalanceTrends(testTransactions, 'month')
      );

      expect(result.current.data?.period.type).toBe('month');
      expect(result.current.data?.points).toHaveLength(12);
    });

    it('should handle empty transactions array', () => {
      const { result } = renderHook(() =>
        useBalanceTrends([], 'day')
      );

      expect(result.current.data).toBeDefined();
      expect(result.current.data?.points).toHaveLength(30);
      expect(result.current.data?.startingBalance).toBe(0);
      expect(result.current.data?.endingBalance).toBe(0);
    });

    it('should not be in loading state', () => {
      const { result } = renderHook(() =>
        useBalanceTrends(testTransactions, 'day')
      );

      expect(result.current.isLoading).toBe(false);
    });

    it('should not have error initially', () => {
      const { result } = renderHook(() =>
        useBalanceTrends(testTransactions, 'day')
      );

      expect(result.current.error).toBeNull();
    });
  });

  describe('T039: hook recalculates when transactions change', () => {
    it('should recalculate when transactions are added', () => {
      const { result, rerender } = renderHook(
        ({ transactions }) => useBalanceTrends(transactions, 'day'),
        { initialProps: { transactions: testTransactions } }
      );

      const initialEndingBalance = result.current.data?.endingBalance;

      // Add new transaction
      const newTransactions = [
        ...testTransactions,
        createTestTransaction({ id: 'tx-new', date: '2026-01-25', amount: 500, type: 'income' }),
      ];

      rerender({ transactions: newTransactions });

      const newEndingBalance = result.current.data?.endingBalance;
      expect(newEndingBalance).not.toBe(initialEndingBalance);
      expect(newEndingBalance).toBeGreaterThan(initialEndingBalance!);
    });

    it('should recalculate when transactions are removed', () => {
      const { result, rerender } = renderHook(
        ({ transactions }) => useBalanceTrends(transactions, 'day'),
        { initialProps: { transactions: testTransactions } }
      );

      const initialEndingBalance = result.current.data?.endingBalance;

      // Remove last transaction
      const fewerTransactions = testTransactions.slice(0, -1);

      rerender({ transactions: fewerTransactions });

      const newEndingBalance = result.current.data?.endingBalance;
      expect(newEndingBalance).not.toBe(initialEndingBalance);
    });

    it('should recalculate when transaction amounts change', () => {
      const { result, rerender } = renderHook(
        ({ transactions }) => useBalanceTrends(transactions, 'day'),
        { initialProps: { transactions: testTransactions } }
      );

      const initialEndingBalance = result.current.data?.endingBalance;

      // Modify transaction amount
      const modifiedTransactions = testTransactions.map(t =>
        t.id === 'tx-3' ? { ...t, amount: 1000 } : t
      );

      rerender({ transactions: modifiedTransactions });

      const newEndingBalance = result.current.data?.endingBalance;
      expect(newEndingBalance).not.toBe(initialEndingBalance);
    });
  });

  describe('T040: hook recalculates when period type changes', () => {
    it('should recalculate when switching from day to week', () => {
      const { result, rerender } = renderHook(
        ({ periodType }) => useBalanceTrends(testTransactions, periodType),
        { initialProps: { periodType: 'day' as const } }
      );

      expect(result.current.data?.period.type).toBe('day');
      expect(result.current.data?.points).toHaveLength(30);

      rerender({ periodType: 'week' as const });

      expect(result.current.data?.period.type).toBe('week');
      expect(result.current.data?.points).toHaveLength(12);
    });

    it('should recalculate when switching from week to month', () => {
      const { result, rerender } = renderHook(
        ({ periodType }) => useBalanceTrends(testTransactions, periodType),
        { initialProps: { periodType: 'week' as const } }
      );

      expect(result.current.data?.period.type).toBe('week');

      rerender({ periodType: 'month' as const });

      expect(result.current.data?.period.type).toBe('month');
    });

    it('should maintain correct data after multiple period changes', () => {
      const { result, rerender } = renderHook(
        ({ periodType }) => useBalanceTrends(testTransactions, periodType),
        { initialProps: { periodType: 'day' as const } }
      );

      // Day -> Week
      rerender({ periodType: 'week' as const });
      expect(result.current.data?.points).toHaveLength(12);

      // Week -> Month
      rerender({ periodType: 'month' as const });
      expect(result.current.data?.points).toHaveLength(12);

      // Month -> Day (back to original)
      rerender({ periodType: 'day' as const });
      expect(result.current.data?.points).toHaveLength(30);
    });
  });

  describe('T041: hook memoizes results to prevent unnecessary recalculations', () => {
    it('should return same data reference when inputs unchanged', () => {
      const { result, rerender } = renderHook(() =>
        useBalanceTrends(testTransactions, 'day')
      );

      const firstData = result.current.data;

      // Rerender without changing inputs
      rerender();

      const secondData = result.current.data;

      // Should be same reference (memoized)
      expect(secondData).toBe(firstData);
    });

    it('should return new data reference when transactions change', () => {
      const { result, rerender } = renderHook(
        ({ transactions }) => useBalanceTrends(transactions, 'day'),
        { initialProps: { transactions: testTransactions } }
      );

      const firstData = result.current.data;

      // Change transactions
      const newTransactions = [...testTransactions];
      rerender({ transactions: newTransactions });

      const secondData = result.current.data;

      // Should be different reference (recalculated)
      expect(secondData).not.toBe(firstData);
    });

    it('should return new data reference when period type changes', () => {
      const { result, rerender } = renderHook(
        ({ periodType }) => useBalanceTrends(testTransactions, periodType),
        { initialProps: { periodType: 'day' as const } }
      );

      const firstData = result.current.data;

      // Change period type
      rerender({ periodType: 'week' as const });

      const secondData = result.current.data;

      // Should be different reference (recalculated)
      expect(secondData).not.toBe(firstData);
    });
  });

  describe('edge cases', () => {
    it('should handle null/undefined transactions gracefully', () => {
      const { result } = renderHook(() =>
        useBalanceTrends(null as any, 'day')
      );

      expect(result.current.error).toBeDefined();
    });

    it('should handle single transaction', () => {
      const singleTransaction = [testTransactions[0]];
      const { result } = renderHook(() =>
        useBalanceTrends(singleTransaction, 'day')
      );

      expect(result.current.data).toBeDefined();
      expect(result.current.error).toBeNull();
    });

    it('should handle very large transaction arrays', () => {
      const largeTransactionArray = Array.from({ length: 1000 }, (_, i) =>
        createTestTransaction({ id: `large-${i}`, date: '2026-01-15' })
      );

      const { result } = renderHook(() =>
        useBalanceTrends(largeTransactionArray, 'day')
      );

      expect(result.current.data).toBeDefined();
      expect(result.current.error).toBeNull();
    });

    it('should handle transactions with decimal amounts', () => {
      const decimalTransactions = [
        createTestTransaction({ amount: 99.99, type: 'income' }),
        createTestTransaction({ amount: 33.33, type: 'expense' }),
      ];

      const { result } = renderHook(() =>
        useBalanceTrends(decimalTransactions, 'day')
      );

      expect(result.current.data).toBeDefined();
      expect(result.current.error).toBeNull();
    });
  });

  describe('return type validation', () => {
    it('should return correct TypeScript types', () => {
      const { result } = renderHook(() =>
        useBalanceTrends(testTransactions, 'day')
      );

      // Type assertions to ensure TypeScript types are correct
      expect(typeof result.current.isLoading).toBe('boolean');
      expect(result.current.error === null || result.current.error instanceof Error).toBe(true);
      
      if (result.current.data) {
        expect(Array.isArray(result.current.data.points)).toBe(true);
        expect(typeof result.current.data.startingBalance).toBe('number');
        expect(typeof result.current.data.endingBalance).toBe('number');
        expect(typeof result.current.data.change).toBe('number');
        expect(typeof result.current.data.changePercentage).toBe('number');
      }
    });
  });
});
