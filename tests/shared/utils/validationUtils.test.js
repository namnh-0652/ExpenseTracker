import { describe, it, expect } from 'vitest';
import {
  validateAmount,
  validateDate,
  validateType,
  validateCategoryId,
  validateDescription,
  validateTransactionObject
} from '../../../src/shared/utils/validationUtils.js';

describe('validationUtils', () => {
  describe('validateAmount', () => {
    it('returns null for valid amounts', () => {
      expect(validateAmount(0.01)).toBeNull();
      expect(validateAmount(100)).toBeNull();
      expect(validateAmount(999999999.99)).toBeNull();
      expect(validateAmount('50.50')).toBeNull();
    });

    it('returns error for missing amount', () => {
      expect(validateAmount(null)).toBe('Amount is required');
      expect(validateAmount(undefined)).toBe('Amount is required');
      expect(validateAmount('')).toBe('Amount is required');
    });

    it('returns error for non-numeric amount', () => {
      expect(validateAmount('abc')).toBe('Amount must be a valid number');
      expect(validateAmount('12.34.56')).toBe('Amount must be a valid number');
    });

    it('returns error for negative amount', () => {
      expect(validateAmount(-1)).toBe('Amount must be at least 0.01');
      expect(validateAmount(-100.50)).toBe('Amount must be at least 0.01');
    });

    it('returns error for zero amount', () => {
      expect(validateAmount(0)).toBe('Amount must be at least 0.01');
    });

    it('returns error for amount below minimum', () => {
      expect(validateAmount(0.001)).toBe('Amount must be at least 0.01');
    });

    it('returns error for amount above maximum', () => {
      expect(validateAmount(1000000000)).toBe('Amount must not exceed 999999999.99');
    });

    it('returns error for more than 2 decimal places', () => {
      expect(validateAmount(10.123)).toBe('Amount must have at most 2 decimal places');
      expect(validateAmount('50.999')).toBe('Amount must have at most 2 decimal places');
    });
  });

  describe('validateDate', () => {
    it('returns null for valid dates', () => {
      expect(validateDate('2026-01-30')).toBeNull();
      expect(validateDate('2000-12-31')).toBeNull();
      expect(validateDate('2050-06-15')).toBeNull();
    });

    it('returns error for missing date', () => {
      expect(validateDate(null)).toBe('Date is required');
      expect(validateDate(undefined)).toBe('Date is required');
      expect(validateDate('')).toBe('Date is required');
    });

    it('returns error for invalid format', () => {
      expect(validateDate('30-01-2026')).toBe('Date must be in YYYY-MM-DD format');
      expect(validateDate('2026/01/30')).toBe('Date must be in YYYY-MM-DD format');
      expect(validateDate('Jan 30, 2026')).toBe('Date must be in YYYY-MM-DD format');
      expect(validateDate('2026-1-30')).toBe('Date must be in YYYY-MM-DD format');
    });

    it('returns error for invalid dates', () => {
      expect(validateDate('2026-13-01')).toBe('Invalid date');
      expect(validateDate('2026-02-30')).toBe('Invalid date');
      expect(validateDate('2026-00-01')).toBe('Invalid date');
      expect(validateDate('2026-01-32')).toBe('Invalid date');
    });

    it('returns error for dates with invalid years', () => {
      expect(validateDate('1899-01-01')).toBe('Year must be between 1900 and 2100');
      expect(validateDate('2101-01-01')).toBe('Year must be between 1900 and 2100');
    });
  });

  describe('validateType', () => {
    it('returns null for valid types', () => {
      expect(validateType('income')).toBeNull();
      expect(validateType('expense')).toBeNull();
    });

    it('returns error for missing type', () => {
      expect(validateType(null)).toBe('Type is required');
      expect(validateType(undefined)).toBe('Type is required');
      expect(validateType('')).toBe('Type is required');
    });

    it('returns error for invalid types', () => {
      expect(validateType('purchase')).toBe('Type must be either "income" or "expense"');
      expect(validateType('INCOME')).toBe('Type must be either "income" or "expense"');
      expect(validateType('Expense')).toBe('Type must be either "income" or "expense"');
    });
  });

  describe('validateCategoryId', () => {
    it('returns null for valid category IDs', () => {
      expect(validateCategoryId('food')).toBeNull();
      expect(validateCategoryId('salary')).toBeNull();
      expect(validateCategoryId('transport')).toBeNull();
    });

    it('returns error for missing category', () => {
      expect(validateCategoryId(null)).toBe('Category is required');
      expect(validateCategoryId(undefined)).toBe('Category is required');
      expect(validateCategoryId('')).toBe('Category is required');
    });

    it('returns error for non-existent category', () => {
      expect(validateCategoryId('nonexistent')).toBe('Category does not exist');
      expect(validateCategoryId('invalid-id')).toBe('Category does not exist');
    });
  });

  describe('validateDescription', () => {
    it('returns null for valid descriptions', () => {
      expect(validateDescription('')).toBeNull();  // Optional field
      expect(validateDescription('Lunch with team')).toBeNull();
      expect(validateDescription('A'.repeat(200))).toBeNull();
    });

    it('returns error for description exceeding max length', () => {
      expect(validateDescription('A'.repeat(201))).toBe('Description must not exceed 200 characters');
    });

    it('handles null and undefined as valid (optional field)', () => {
      expect(validateDescription(null)).toBeNull();
      expect(validateDescription(undefined)).toBeNull();
    });
  });

  describe('validateTransactionObject', () => {
    it('returns valid result for complete valid transaction', () => {
      const result = validateTransactionObject({
        amount: 50.50,
        date: '2026-01-30',
        type: 'expense',
        categoryId: 'food',
        description: 'Lunch'
      });

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('returns errors for multiple invalid fields', () => {
      const result = validateTransactionObject({
        amount: -10,
        date: 'invalid',
        type: 'purchase',
        categoryId: 'nonexistent',
        description: 'A'.repeat(300)
      });

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(5);
      expect(result.errors).toContainEqual({ field: 'amount', message: 'Amount must be at least 0.01' });
      expect(result.errors).toContainEqual({ field: 'date', message: 'Date must be in YYYY-MM-DD format' });
      expect(result.errors).toContainEqual({ field: 'type', message: 'Type must be either "income" or "expense"' });
      expect(result.errors).toContainEqual({ field: 'categoryId', message: 'Category does not exist' });
      expect(result.errors).toContainEqual({ field: 'description', message: 'Description must not exceed 200 characters' });
    });

    it('returns errors for missing required fields', () => {
      const result = validateTransactionObject({});

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some(e => e.field === 'amount')).toBe(true);
      expect(result.errors.some(e => e.field === 'date')).toBe(true);
      expect(result.errors.some(e => e.field === 'type')).toBe(true);
      expect(result.errors.some(e => e.field === 'categoryId')).toBe(true);
    });

    it('allows optional description to be omitted', () => {
      const result = validateTransactionObject({
        amount: 100,
        date: '2026-01-30',
        type: 'income',
        categoryId: 'salary'
      });

      expect(result.isValid).toBe(true);
      expect(result.errors.some(e => e.field === 'description')).toBe(false);
    });
  });
});
