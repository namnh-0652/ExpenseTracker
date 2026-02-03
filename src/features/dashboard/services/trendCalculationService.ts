/**
 * Balance Trend Calculation Service
 * 
 * Provides functions to calculate balance trends over time periods.
 * Supports daily, weekly, and monthly views with cumulative balance calculations.
 */

import type { Transaction } from '@/shared/types';
import type {
  BalanceTrendData,
  BalanceTrendPoint,
  TimePeriod,
  DateRange,
  TransactionGroup,
} from '../types/trendTypes';

/**
 * Calculate balance trend data for a given time period
 * 
 * @param transactions - Array of all transactions
 * @param period - Time period specification
 * @returns Complete balance trend data with points and statistics
 * @throws Error if period type is invalid or anchor date is invalid/future
 */
export function calculateBalanceTrend(
  transactions: Transaction[],
  period: TimePeriod
): BalanceTrendData {
  // Validate period type
  if (!['day', 'week', 'month'].includes(period.type)) {
    throw new Error(
      `Invalid period type: ${period.type}. Expected 'day', 'week', or 'month'.`
    );
  }

  // Validate anchor date format
  if (!isValidISODate(period.anchorDate)) {
    throw new Error(
      `Invalid anchor date format: ${period.anchorDate}. Expected ISO 8601 (YYYY-MM-DD).`
    );
  }

  // Validate anchor date is not in future
  const today = new Date().toISOString().split('T')[0];
  if (period.anchorDate > today) {
    throw new Error('Anchor date cannot be in the future');
  }

  // Calculate date range for the period
  const dateRange = calculateDateRange(period.type, period.anchorDate);

  // Calculate starting balance (from all transactions before period)
  const startingBalance = calculateStartingBalance(transactions, dateRange.start);

  // Filter transactions within the period
  const periodTransactions = filterTransactionsByDateRange(transactions, dateRange);

  // Group transactions by period type
  const groupedTransactions = groupTransactionsByPeriod(periodTransactions, period.type);

  // Generate balance trend points
  const points = generateBalanceTrendPoints(
    groupedTransactions,
    dateRange,
    period.type,
    startingBalance
  );

  // Calculate summary statistics
  const stats = calculateSummaryStatistics(points, startingBalance);

  return {
    points,
    period: {
      start: dateRange.start,
      end: dateRange.end,
      type: period.type,
    },
    startingBalance,
    endingBalance: stats.endingBalance,
    change: stats.change,
    changePercentage: stats.changePercentage,
  };
}

/**
 * Calculate start and end dates for a given period type
 * 
 * @param periodType - Type of period
 * @param anchorDate - Reference date
 * @returns Date range with start and end dates
 */
export function calculateDateRange(
  periodType: 'day' | 'week' | 'month',
  anchorDate: string
): DateRange {
  const end = anchorDate;
  let start: string;

  switch (periodType) {
    case 'day':
      // Last 30 days
      start = addDays(anchorDate, -29);
      break;
    case 'week':
      // Last 12 weeks (84 days)
      start = addDays(anchorDate, -83);
      break;
    case 'month':
      // Last 12 months (11 months back, plus current month = 12 total)
      const d = new Date(anchorDate);
      d.setMonth(d.getMonth() - 11);
      start = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
      break;
  }

  return { start, end };
}

/**
 * Filter transactions within a date range (inclusive)
 * 
 * @param transactions - All transactions
 * @param dateRange - Date range to filter by
 * @returns Filtered transactions
 */
export function filterTransactionsByDateRange(
  transactions: Transaction[],
  dateRange: DateRange
): Transaction[] {
  return transactions.filter(
    (t) => t.date >= dateRange.start && t.date <= dateRange.end
  );
}

/**
 * Group transactions by date/week/month
 * 
 * @param transactions - Transactions to group
 * @param periodType - Grouping granularity
 * @returns Map with date keys and aggregated transaction data
 */
export function groupTransactionsByPeriod(
  transactions: Transaction[],
  periodType: 'day' | 'week' | 'month'
): Map<string, TransactionGroup> {
  const grouped = new Map<string, TransactionGroup>();

  transactions.forEach((transaction) => {
    let key: string;

    switch (periodType) {
      case 'day':
        key = transaction.date;
        break;
      case 'week':
        key = getWeekStartDate(transaction.date);
        break;
      case 'month':
        key = getMonthStartDate(transaction.date);
        break;
    }

    if (!grouped.has(key)) {
      grouped.set(key, { income: 0, expense: 0, count: 0 });
    }

    const group = grouped.get(key)!;
    if (transaction.type === 'income') {
      group.income += transaction.amount;
    } else {
      group.expense += transaction.amount;
    }
    group.count++;
  });

  return grouped;
}

/**
 * Calculate cumulative balance from transactions before period start
 * 
 * @param transactions - All transactions
 * @param periodStart - Start date of period
 * @returns Cumulative balance before period
 */
export function calculateStartingBalance(
  transactions: Transaction[],
  periodStart: string
): number {
  return transactions
    .filter((t) => t.date < periodStart)
    .reduce((balance, t) => {
      return balance + (t.type === 'income' ? t.amount : -t.amount);
    }, 0);
}

/**
 * Generate array of BalanceTrendPoint objects with cumulative balances
 * 
 * @param groupedTransactions - Grouped transaction data
 * @param dateRange - Date range for points
 * @param periodType - Type of period
 * @param startingBalance - Initial balance
 * @returns Array of balance trend points
 */
function generateBalanceTrendPoints(
  groupedTransactions: Map<string, TransactionGroup>,
  dateRange: DateRange,
  periodType: 'day' | 'week' | 'month',
  startingBalance: number
): BalanceTrendPoint[] {
  const points: BalanceTrendPoint[] = [];
  const dates = generateDateList(dateRange, periodType);
  let cumulativeBalance = startingBalance;

  dates.forEach((date) => {
    const group = groupedTransactions.get(date) || {
      income: 0,
      expense: 0,
      count: 0,
    };

    cumulativeBalance += group.income - group.expense;

    points.push({
      date,
      balance: cumulativeBalance,
      income: group.income,
      expense: group.expense,
      transactionCount: group.count,
    });
  });

  return points;
}

/**
 * Generate list of all dates in range based on period type
 * 
 * @param dateRange - Date range
 * @param periodType - Type of period
 * @returns Array of date strings
 */
function generateDateList(
  dateRange: DateRange,
  periodType: 'day' | 'week' | 'month'
): string[] {
  const dates: string[] = [];
  let current = new Date(dateRange.start);
  const end = new Date(dateRange.end);

  while (current <= end) {
    let key: string;

    switch (periodType) {
      case 'day':
        key = current.toISOString().split('T')[0];
        current.setDate(current.getDate() + 1);
        break;
      case 'week':
        key = getWeekStartDate(current.toISOString().split('T')[0]);
        current.setDate(current.getDate() + 7);
        // Skip duplicates (if we already have this week)
        if (dates.includes(key)) continue;
        break;
      case 'month':
        key = getMonthStartDate(current.toISOString().split('T')[0]);
        current.setMonth(current.getMonth() + 1);
        // Skip duplicates
        if (dates.includes(key)) continue;
        break;
    }

    dates.push(key);
  }

  return dates;
}

/**
 * Calculate summary statistics from balance trend points
 * 
 * @param points - Array of balance trend points
 * @param startingBalance - Balance before first point
 * @returns Summary statistics
 */
function calculateSummaryStatistics(
  points: BalanceTrendPoint[],
  startingBalance: number
): {
  endingBalance: number;
  change: number;
  changePercentage: number;
} {
  const endingBalance = points.length > 0 ? points[points.length - 1].balance : startingBalance;
  const change = endingBalance - startingBalance;
  const changePercentage =
    startingBalance === 0 ? 0 : (change / Math.abs(startingBalance)) * 100;

  return {
    endingBalance,
    change,
    changePercentage,
  };
}

/**
 * Get the Monday of the week containing a given date
 * 
 * @param date - Any date (ISO 8601)
 * @returns Monday of that week (ISO 8601)
 */
function getWeekStartDate(date: string): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Adjust to Monday
  d.setDate(d.getDate() + diff);
  return d.toISOString().split('T')[0];
}

/**
 * Get the first day of the month containing a given date
 * 
 * @param date - Any date (ISO 8601)
 * @returns First day of that month (YYYY-MM-01)
 */
function getMonthStartDate(date: string): string {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
}

/**
 * Add days to a date
 * 
 * @param date - Starting date (ISO 8601)
 * @param days - Number of days to add (can be negative)
 * @returns New date (ISO 8601)
 */
function addDays(date: string, days: number): string {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

/**
 * Add months to a date
 * 
 * @param date - Starting date (ISO 8601)
 * @param months - Number of months to add (can be negative)
 * @returns New date (ISO 8601)
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function addMonths(date: string, months: number): string {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().split('T')[0];
}

/**
 * Validate ISO 8601 date format (YYYY-MM-DD)
 * 
 * @param date - Date string to validate
 * @returns True if valid
 */
function isValidISODate(date: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(date)) return false;

  const d = new Date(date);
  return d.toISOString().split('T')[0] === date;
}
