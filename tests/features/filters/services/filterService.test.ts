/**
 * Filter Service Tests
 * Tests for transaction filtering, searching, and sorting
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  applyFilters,
  searchTransactions,
  filterByType,
  filterByCategory,
  filterByDateRange,
  sortTransactions,
} from '@/features/filters/services/filterService';
import type { Transaction } from '@/shared/types';

describe('filterService', () => {
  let transactions: Transaction[];

  beforeEach(() => {
    transactions = [
      {
        id: '1',
        type: 'expense',
        amount: 50.00,
        categoryId: 'food',
        categoryName: 'Food & Dining',
        description: 'Lunch at restaurant',
        date: '2026-01-15',
        createdAt: '2026-01-15T12:00:00.000Z',
        updatedAt: '2026-01-15T12:00:00.000Z',
      },
      {
        id: '2',
        type: 'income',
        amount: 1000.00,
        categoryId: 'salary',
        categoryName: 'Salary',
        description: 'Monthly salary',
        date: '2026-01-01',
        createdAt: '2026-01-01T09:00:00.000Z',
        updatedAt: '2026-01-01T09:00:00.000Z',
      },
      {
        id: '3',
        type: 'expense',
        amount: 25.50,
        categoryId: 'transport',
        categoryName: 'Transportation',
        description: 'Uber ride',
        date: '2026-01-20',
        createdAt: '2026-01-20T18:00:00.000Z',
        updatedAt: '2026-01-20T18:00:00.000Z',
      },
      {
        id: '4',
        type: 'expense',
        amount: 100.00,
        categoryId: 'food',
        categoryName: 'Food & Dining',
        description: 'Grocery shopping',
        date: '2026-02-05',
        createdAt: '2026-02-05T10:00:00.000Z',
        updatedAt: '2026-02-05T10:00:00.000Z',
      },
      {
        id: '5',
        type: 'income',
        amount: 500.00,
        categoryId: 'freelance',
        categoryName: 'Freelance',
        description: 'Client project payment',
        date: '2026-01-25',
        createdAt: '2026-01-25T14:00:00.000Z',
        updatedAt: '2026-01-25T14:00:00.000Z',
      },
    ];
  });

  describe('searchTransactions', () => {
    it('should return all transactions when search text is empty', () => {
      const result = searchTransactions(transactions, '');
      expect(result).toHaveLength(5);
    });

    it('should search case-insensitively in description', () => {
      const result = searchTransactions(transactions, 'lunch');
      expect(result).toHaveLength(1);
      expect(result[0].description).toBe('Lunch at restaurant');
    });

    it('should search in uppercase', () => {
      const result = searchTransactions(transactions, 'UBER');
      expect(result).toHaveLength(1);
      expect(result[0].description).toBe('Uber ride');
    });

    it('should search by partial match', () => {
      const result = searchTransactions(transactions, 'pay');
      expect(result).toHaveLength(1);
      expect(result[0].description).toBe('Client project payment');
    });

    it('should return empty array when no match found', () => {
      const result = searchTransactions(transactions, 'xyz123');
      expect(result).toHaveLength(0);
    });

    it('should trim whitespace from search text', () => {
      const result = searchTransactions(transactions, '  salary  ');
      expect(result).toHaveLength(1);
      expect(result[0].description).toBe('Monthly salary');
    });
  });

  describe('filterByType', () => {
    it('should return all transactions when type is "all"', () => {
      const result = filterByType(transactions, 'all');
      expect(result).toHaveLength(5);
    });

    it('should filter by income type', () => {
      const result = filterByType(transactions, 'income');
      expect(result).toHaveLength(2);
      expect(result.every(t => t.type === 'income')).toBe(true);
    });

    it('should filter by expense type', () => {
      const result = filterByType(transactions, 'expense');
      expect(result).toHaveLength(3);
      expect(result.every(t => t.type === 'expense')).toBe(true);
    });

    it('should return empty array for empty input', () => {
      const result = filterByType([], 'income');
      expect(result).toHaveLength(0);
    });
  });

  describe('filterByCategory', () => {
    it('should return all transactions when categoryId is null', () => {
      const result = filterByCategory(transactions, null);
      expect(result).toHaveLength(5);
    });

    it('should filter by specific category', () => {
      const result = filterByCategory(transactions, 'food');
      expect(result).toHaveLength(2);
      expect(result.every(t => t.categoryId === 'food')).toBe(true);
    });

    it('should return empty array when category has no transactions', () => {
      const result = filterByCategory(transactions, 'nonexistent');
      expect(result).toHaveLength(0);
    });

    it('should return empty array for empty input', () => {
      const result = filterByCategory([], 'food');
      expect(result).toHaveLength(0);
    });
  });

  describe('filterByDateRange', () => {
    it('should return all transactions when dateRange is null', () => {
      const result = filterByDateRange(transactions, null);
      expect(result).toHaveLength(5);
    });

    it('should filter by date range (inclusive)', () => {
      const result = filterByDateRange(transactions, {
        start: '2026-01-15',
        end: '2026-01-25',
      });
      expect(result).toHaveLength(3); // Lunch, Uber, Freelance
      expect(result.map(t => t.id).sort()).toEqual(['1', '3', '5']);
    });

    it('should include start date boundary', () => {
      const result = filterByDateRange(transactions, {
        start: '2026-01-01',
        end: '2026-01-01',
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('2');
    });

    it('should include end date boundary', () => {
      const result = filterByDateRange(transactions, {
        start: '2026-02-05',
        end: '2026-02-05',
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('4');
    });

    it('should return empty array when no transactions in range', () => {
      const result = filterByDateRange(transactions, {
        start: '2026-03-01',
        end: '2026-03-31',
      });
      expect(result).toHaveLength(0);
    });

    it('should handle date range with only start date', () => {
      const result = filterByDateRange(transactions, {
        start: '2026-01-20',
        end: null,
      });
      expect(result).toHaveLength(3); // Uber, Grocery, Freelance
    });

    it('should handle date range with only end date', () => {
      const result = filterByDateRange(transactions, {
        start: null,
        end: '2026-01-15',
      });
      expect(result).toHaveLength(2); // Salary, Lunch
    });
  });

  describe('sortTransactions', () => {
    it('should sort by date ascending', () => {
      const result = sortTransactions(transactions, 'date', 'asc');
      expect(result[0].date).toBe('2026-01-01');
      expect(result[4].date).toBe('2026-02-05');
    });

    it('should sort by date descending', () => {
      const result = sortTransactions(transactions, 'date', 'desc');
      expect(result[0].date).toBe('2026-02-05');
      expect(result[4].date).toBe('2026-01-01');
    });

    it('should sort by amount ascending', () => {
      const result = sortTransactions(transactions, 'amount', 'asc');
      expect(result[0].amount).toBe(25.50);
      expect(result[4].amount).toBe(1000.00);
    });

    it('should sort by amount descending', () => {
      const result = sortTransactions(transactions, 'amount', 'desc');
      expect(result[0].amount).toBe(1000.00);
      expect(result[4].amount).toBe(25.50);
    });

    it('should sort by category ascending', () => {
      const result = sortTransactions(transactions, 'category', 'asc');
      expect(result[0].categoryName).toBe('Food & Dining');
      expect(result[4].categoryName).toBe('Transportation');
    });

    it('should sort by category descending', () => {
      const result = sortTransactions(transactions, 'category', 'desc');
      expect(result[0].categoryName).toBe('Transportation');
      expect(result[4].categoryName).toBe('Food & Dining');
    });

    it('should not mutate original array', () => {
      const original = [...transactions];
      sortTransactions(transactions, 'date', 'desc');
      expect(transactions).toEqual(original);
    });
  });

  describe('applyFilters', () => {
    it('should return all transactions when no filters applied', () => {
      const result = applyFilters(transactions, {});
      expect(result).toHaveLength(5);
    });

    it('should apply search text filter', () => {
      const result = applyFilters(transactions, {
        searchText: 'lunch',
      });
      expect(result).toHaveLength(1);
      expect(result[0].description).toBe('Lunch at restaurant');
    });

    it('should apply type filter', () => {
      const result = applyFilters(transactions, {
        type: 'income',
      });
      expect(result).toHaveLength(2);
    });

    it('should apply category filter', () => {
      const result = applyFilters(transactions, {
        categoryId: 'food',
      });
      expect(result).toHaveLength(2);
    });

    it('should apply date range filter', () => {
      const result = applyFilters(transactions, {
        dateRange: {
          start: '2026-01-01',
          end: '2026-01-31',
        },
      });
      expect(result).toHaveLength(4); // All January transactions
    });

    it('should combine multiple filters', () => {
      const result = applyFilters(transactions, {
        type: 'expense',
        categoryId: 'food',
        searchText: 'lunch',
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    it('should apply filters and sort', () => {
      const result = applyFilters(transactions, {
        type: 'expense',
        sortBy: 'amount',
        sortOrder: 'desc',
      });
      expect(result).toHaveLength(3);
      expect(result[0].amount).toBe(100.00);
      expect(result[2].amount).toBe(25.50);
    });

    it('should return empty array when filters match nothing', () => {
      const result = applyFilters(transactions, {
        type: 'income',
        categoryId: 'transport', // No income transactions in transport category
      });
      expect(result).toHaveLength(0);
    });

    it('should handle complex filter combination', () => {
      const result = applyFilters(transactions, {
        type: 'expense',
        dateRange: {
          start: '2026-01-01',
          end: '2026-01-31',
        },
        sortBy: 'date',
        sortOrder: 'asc',
      });
      expect(result).toHaveLength(2); // Lunch and Uber
      expect(result[0].date).toBe('2026-01-15');
      expect(result[1].date).toBe('2026-01-20');
    });
  });
});
