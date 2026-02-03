/**
 * useBalanceTrends Hook
 * 
 * Custom React hook for calculating and managing balance trend data.
 * Integrates with trendCalculationService and provides memoization for performance.
 */

import { useMemo } from 'react';
import { calculateBalanceTrend } from '@/features/dashboard/services/trendCalculationService';
import type { Transaction } from '@/shared/types';
import type { BalanceTrendData } from '@/features/dashboard/types/trendTypes';

/**
 * Hook return type
 */
export interface UseBalanceTrendsReturn {
  /**
   * Calculated balance trend data
   * Null if calculation fails or no data available
   */
  data: BalanceTrendData | null;

  /**
   * Loading state for async operations
   * Currently always false (calculations are synchronous)
   * Included for future enhancement if calculations move to worker
   */
  isLoading: boolean;

  /**
   * Error state if calculation fails
   * Null if no error
   */
  error: Error | null;
}

/**
 * Custom hook to calculate balance trends from transactions
 * 
 * @param transactions - Array of all transactions
 * @param periodType - Type of period ('day', 'week', or 'month')
 * @returns Balance trend data with loading and error states
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { data, isLoading, error } = useBalanceTrends(transactions, 'day');
 *   
 *   if (isLoading) return <LoadingSpinner />;
 *   if (error) return <ErrorMessage error={error} />;
 *   if (!data) return <EmptyState />;
 *   
 *   return <Chart data={data} />;
 * }
 * ```
 */
export function useBalanceTrends(
  transactions: Transaction[],
  periodType: 'day' | 'week' | 'month'
): UseBalanceTrendsReturn {
  // Memoize the calculation to prevent unnecessary recalculations
  const result = useMemo<UseBalanceTrendsReturn>(() => {
    try {
      // Validate inputs
      if (!transactions) {
        throw new Error('Transactions array is required');
      }

      if (!Array.isArray(transactions)) {
        throw new Error('Transactions must be an array');
      }

      // Get current date as anchor for period calculation
      const anchorDate = new Date().toISOString().split('T')[0];

      // Calculate balance trend data
      const data = calculateBalanceTrend(transactions, {
        type: periodType,
        anchorDate,
      });

      return {
        data,
        isLoading: false,
        error: null,
      };
    } catch (error) {
      console.error('Error calculating balance trends:', error);
      
      return {
        data: null,
        isLoading: false,
        error: error instanceof Error ? error : new Error('Unknown error occurred'),
      };
    }
  }, [transactions, periodType]);

  return result;
}
