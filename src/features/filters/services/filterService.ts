/**
 * Filter Service
 * Provides filtering, searching, and sorting functionality for transactions
 */

import type { Transaction } from '@/shared/types';

export interface DateRange {
  start: string | null;
  end: string | null;
}

export interface FilterCriteria {
  searchText?: string;
  type?: 'income' | 'expense' | 'all';
  categoryId?: string | null;
  dateRange?: DateRange | null;
  sortBy?: 'date' | 'amount' | 'category';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Search transactions by description text (case-insensitive)
 * @param transactions - Array of transactions
 * @param searchText - Search query
 * @returns Matching transactions
 */
export function searchTransactions(
  transactions: Transaction[],
  searchText: string
): Transaction[] {
  if (!searchText || searchText.trim() === '') {
    return transactions;
  }

  const query = searchText.trim().toLowerCase();
  return transactions.filter(transaction =>
    transaction.description.toLowerCase().includes(query)
  );
}

/**
 * Filter transactions by type
 * @param transactions - Array of transactions
 * @param type - 'income', 'expense', or 'all'
 * @returns Filtered transactions
 */
export function filterByType(
  transactions: Transaction[],
  type: 'income' | 'expense' | 'all'
): Transaction[] {
  if (type === 'all') {
    return transactions;
  }

  return transactions.filter(transaction => transaction.type === type);
}

/**
 * Filter transactions by category
 * @param transactions - Array of transactions
 * @param categoryId - Category ID (null for all)
 * @returns Filtered transactions
 */
export function filterByCategory(
  transactions: Transaction[],
  categoryId: string | null
): Transaction[] {
  if (!categoryId) {
    return transactions;
  }

  return transactions.filter(transaction => transaction.categoryId === categoryId);
}

/**
 * Filter transactions by date range (inclusive)
 * @param transactions - Array of transactions
 * @param dateRange - Start and end dates (null for no filter)
 * @returns Filtered transactions
 */
export function filterByDateRange(
  transactions: Transaction[],
  dateRange: DateRange | null
): Transaction[] {
  if (!dateRange) {
    return transactions;
  }

  const { start, end } = dateRange;

  return transactions.filter(transaction => {
    const transactionDate = transaction.date;

    // If only start date is provided
    if (start && !end) {
      return transactionDate >= start;
    }

    // If only end date is provided
    if (!start && end) {
      return transactionDate <= end;
    }

    // If both dates are provided
    if (start && end) {
      return transactionDate >= start && transactionDate <= end;
    }

    // No date filter
    return true;
  });
}

/**
 * Sort transactions by specified field
 * @param transactions - Array of transactions
 * @param sortBy - Field to sort by
 * @param order - 'asc' or 'desc'
 * @returns Sorted transaction array (new array, does not mutate original)
 */
export function sortTransactions(
  transactions: Transaction[],
  sortBy: 'date' | 'amount' | 'category',
  order: 'asc' | 'desc'
): Transaction[] {
  const sorted = [...transactions];

  sorted.sort((a, b) => {
    let compareValue = 0;

    switch (sortBy) {
      case 'date':
        compareValue = a.date.localeCompare(b.date);
        break;
      case 'amount':
        compareValue = a.amount - b.amount;
        break;
      case 'category':
        compareValue = a.categoryId.localeCompare(b.categoryId);
        break;
    }

    return order === 'asc' ? compareValue : -compareValue;
  });

  return sorted;
}

/**
 * Apply multiple filters to transaction list
 * @param transactions - Array of all transactions
 * @param filters - Filter criteria
 * @returns Filtered and sorted transaction array
 */
export function applyFilters(
  transactions: Transaction[],
  filters: FilterCriteria
): Transaction[] {
  let result = transactions;

  // Apply search filter
  if (filters.searchText) {
    result = searchTransactions(result, filters.searchText);
  }

  // Apply type filter
  if (filters.type && filters.type !== 'all') {
    result = filterByType(result, filters.type);
  }

  // Apply category filter
  if (filters.categoryId) {
    result = filterByCategory(result, filters.categoryId);
  }

  // Apply date range filter
  if (filters.dateRange) {
    result = filterByDateRange(result, filters.dateRange);
  }

  // Apply sorting
  if (filters.sortBy) {
    result = sortTransactions(
      result,
      filters.sortBy,
      filters.sortOrder || 'desc'
    );
  }

  return result;
}
