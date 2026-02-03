import { getCategoryName } from '@/shared/services/categoryService';
import { getDateRangeForPeriod as getDateRange } from '@/shared/utils/dateUtils';
import type { Transaction } from '@/shared/types';

export interface CategoryBreakdown {
  categoryId: string;
  categoryName: string;
  amount: number;
  percentage: number;
  transactionCount: number;
}

export interface TimePeriod {
  type: 'day' | 'week' | 'month';
  anchorDate: string; // YYYY-MM-DD
}

export interface DateRange {
  start: string; // YYYY-MM-DD
  end: string; // YYYY-MM-DD
}

export interface DashboardSummary {
  period: {
    start: string;
    end: string;
    type: 'day' | 'week' | 'month';
  };
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  categoryBreakdown: CategoryBreakdown[];
  transactionCount: {
    income: number;
    expense: number;
    total: number;
  };
}

/**
 * Calculate total income for given transactions
 * @param transactions - Array of transactions
 * @returns Total income amount
 */
export function calculateTotalIncome(transactions: Transaction[]): number {
  return transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
}

/**
 * Calculate total expenses for given transactions
 * @param transactions - Array of transactions
 * @returns Total expenses amount
 */
export function calculateTotalExpenses(transactions: Transaction[]): number {
  return transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
}

/**
 * Calculate net balance (income - expenses)
 * @param transactions - Array of transactions
 * @returns Net balance
 */
export function calculateNetBalance(transactions: Transaction[]): number {
  const income = calculateTotalIncome(transactions);
  const expenses = calculateTotalExpenses(transactions);
  return income - expenses;
}

/**
 * Group transactions by category and calculate totals
 * @param transactions - Array of transactions
 * @param type - 'income', 'expense', or 'all'
 * @returns Array of category breakdowns, sorted by amount descending
 */
export function calculateCategoryBreakdown(
  transactions: Transaction[],
  type: 'income' | 'expense' | 'all'
): CategoryBreakdown[] {
  // Filter transactions by type
  const filtered =
    type === 'all'
      ? transactions
      : transactions.filter((t) => t.type === type);

  if (filtered.length === 0) {
    return [];
  }

  // Group by category
  const categoryMap = new Map<string, { amount: number; count: number }>();

  filtered.forEach((transaction) => {
    const existing = categoryMap.get(transaction.categoryId);
    if (existing) {
      existing.amount += transaction.amount;
      existing.count += 1;
    } else {
      categoryMap.set(transaction.categoryId, {
        amount: transaction.amount,
        count: 1,
      });
    }
  });

  // Calculate total for percentages
  const total = filtered.reduce((sum, t) => sum + t.amount, 0);

  // Convert to array and add metadata
  const breakdown: CategoryBreakdown[] = Array.from(categoryMap.entries()).map(
    ([categoryId, data]) => ({
      categoryId,
      categoryName: getCategoryName(categoryId),
      amount: data.amount,
      percentage: total > 0 ? (data.amount / total) * 100 : 0,
      transactionCount: data.count,
    })
  );

  // Sort by amount descending
  breakdown.sort((a, b) => b.amount - a.amount);

  return breakdown;
}

/**
 * Get date range for a time period
 * @param type - 'day', 'week', or 'month'
 * @param anchorDate - Reference date (ISO string or Date)
 * @returns Start and end dates for the period
 */
export function getDateRangeForPeriod(
  type: 'day' | 'week' | 'month',
  anchorDate: string | Date
): DateRange {
  return getDateRange(type, anchorDate);
}

/**
 * Filter transactions by date range
 * @param transactions - Array of transactions
 * @param dateRange - Date range to filter by
 * @returns Filtered transactions
 */
function filterTransactionsByDateRange(
  transactions: Transaction[],
  dateRange: DateRange
): Transaction[] {
  return transactions.filter((t) => {
    return t.date >= dateRange.start && t.date <= dateRange.end;
  });
}

/**
 * Calculate dashboard summary for a time period
 * @param transactions - All transactions
 * @param period - Time period specification
 * @returns Complete dashboard summary
 */
export function calculateDashboardSummary(
  transactions: Transaction[],
  period: TimePeriod
): DashboardSummary {
  // Get date range for the period
  const dateRange = getDateRangeForPeriod(period.type, period.anchorDate);

  // Filter transactions to the date range
  const filteredTransactions = filterTransactionsByDateRange(
    transactions,
    dateRange
  );

  // Calculate all metrics
  const totalIncome = calculateTotalIncome(filteredTransactions);
  const totalExpenses = calculateTotalExpenses(filteredTransactions);
  const netBalance = calculateNetBalance(filteredTransactions);
  const categoryBreakdown = calculateCategoryBreakdown(
    filteredTransactions,
    'all'
  );

  // Count transactions by type
  const incomeCount = filteredTransactions.filter(
    (t) => t.type === 'income'
  ).length;
  const expenseCount = filteredTransactions.filter(
    (t) => t.type === 'expense'
  ).length;

  return {
    period: {
      start: dateRange.start,
      end: dateRange.end,
      type: period.type,
    },
    totalIncome,
    totalExpenses,
    netBalance,
    categoryBreakdown,
    transactionCount: {
      income: incomeCount,
      expense: expenseCount,
      total: filteredTransactions.length,
    },
  };
}
