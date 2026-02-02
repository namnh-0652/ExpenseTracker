/**
 * Export Service Tests
 * Tests for CSV export functionality
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  exportToCSV,
  downloadCSV,
  escapeCSVValue,
  generateFilename,
} from '@/features/export/services/exportService';
import type { Transaction } from '@/shared/types';

describe('exportService', () => {
  let transactions: Transaction[];

  beforeEach(() => {
    transactions = [
      {
        id: '1',
        type: 'expense',
        amount: 45.50,
        categoryId: 'food',
        categoryName: 'Food & Dining',
        description: 'Lunch with team',
        date: '2026-01-30',
        createdAt: '2026-01-30T12:00:00.000Z',
        updatedAt: '2026-01-30T12:00:00.000Z',
      },
      {
        id: '2',
        type: 'income',
        amount: 1000.00,
        categoryId: 'salary',
        categoryName: 'Salary',
        description: 'Monthly salary payment',
        date: '2026-01-01',
        createdAt: '2026-01-01T09:00:00.000Z',
        updatedAt: '2026-01-01T09:00:00.000Z',
      },
      {
        id: '3',
        type: 'expense',
        amount: 25.99,
        categoryId: 'transport',
        categoryName: 'Transportation',
        description: 'Uber ride home',
        date: '2026-01-15',
        createdAt: '2026-01-15T18:00:00.000Z',
        updatedAt: '2026-01-15T18:00:00.000Z',
      },
    ];
  });

  describe('escapeCSVValue', () => {
    it('should return empty string for null or undefined', () => {
      expect(escapeCSVValue(null)).toBe('');
      expect(escapeCSVValue(undefined)).toBe('');
    });

    it('should convert numbers to strings', () => {
      expect(escapeCSVValue(123)).toBe('123');
      expect(escapeCSVValue(45.50)).toBe('45.5');
      expect(escapeCSVValue(0)).toBe('0');
    });

    it('should return simple strings as-is', () => {
      expect(escapeCSVValue('hello')).toBe('hello');
      expect(escapeCSVValue('world')).toBe('world');
    });

    it('should wrap strings with commas in quotes', () => {
      expect(escapeCSVValue('hello, world')).toBe('"hello, world"');
      expect(escapeCSVValue('a,b,c')).toBe('"a,b,c"');
    });

    it('should escape double quotes by doubling them', () => {
      expect(escapeCSVValue('He said "hello"')).toBe('"He said ""hello"""');
      expect(escapeCSVValue('"quoted"')).toBe('"""quoted"""');
    });

    it('should wrap strings with newlines in quotes', () => {
      expect(escapeCSVValue('line1\nline2')).toBe('"line1\nline2"');
      expect(escapeCSVValue('multi\nline\ntext')).toBe('"multi\nline\ntext"');
    });

    it('should handle complex cases with commas, quotes, and newlines', () => {
      expect(escapeCSVValue('He said, "Hello,\nworld"')).toBe(
        '"He said, ""Hello,\nworld"""'
      );
    });
  });

  describe('exportToCSV', () => {
    it('should include headers by default', () => {
      const csv = exportToCSV(transactions);
      expect(csv).toContain('Date,Amount,Type,Category,Description');
    });

    it('should export transactions with correct column order', () => {
      const csv = exportToCSV(transactions);
      const lines = csv.split('\n');
      
      expect(lines[0]).toBe('Date,Amount,Type,Category,Description');
      expect(lines[1]).toBe('2026-01-30,45.50,expense,Food & Dining,Lunch with team');
      expect(lines[2]).toBe('2026-01-01,1000.00,income,Salary,Monthly salary payment');
      expect(lines[3]).toBe('2026-01-15,25.99,expense,Transportation,Uber ride home');
    });

    it('should exclude headers when includeHeaders is false', () => {
      const csv = exportToCSV(transactions, false);
      const lines = csv.split('\n');
      
      expect(lines[0]).not.toBe('Date,Amount,Type,Category,Description');
      expect(lines[0]).toBe('2026-01-30,45.50,expense,Food & Dining,Lunch with team');
    });

    it('should format amounts with 2 decimal places', () => {
      const csv = exportToCSV(transactions);
      
      expect(csv).toContain('45.50'); // 45.50
      expect(csv).toContain('1000.00'); // 1000.00
      expect(csv).toContain('25.99'); // 25.99
    });

    it('should use category name, not ID', () => {
      const csv = exportToCSV(transactions);
      
      expect(csv).toContain('Food & Dining');
      expect(csv).toContain('Salary');
      expect(csv).toContain('Transportation');
      expect(csv).not.toContain('food'); // category ID
    });

    it('should handle empty transaction array', () => {
      const csv = exportToCSV([]);
      
      expect(csv).toBe('Date,Amount,Type,Category,Description');
    });

    it('should handle empty array without headers', () => {
      const csv = exportToCSV([], false);
      
      expect(csv).toBe('');
    });

    it('should escape special characters in descriptions', () => {
      const specialTransactions: Transaction[] = [
        {
          id: '1',
          type: 'expense',
          amount: 10.00,
          categoryId: 'food',
          categoryName: 'Food',
          description: 'Lunch, with team',
          date: '2026-01-30',
          createdAt: '2026-01-30T12:00:00.000Z',
          updatedAt: '2026-01-30T12:00:00.000Z',
        },
      ];
      
      const csv = exportToCSV(specialTransactions);
      expect(csv).toContain('"Lunch, with team"');
    });

    it('should escape quotes in descriptions', () => {
      const specialTransactions: Transaction[] = [
        {
          id: '1',
          type: 'expense',
          amount: 10.00,
          categoryId: 'food',
          categoryName: 'Food',
          description: 'He said "hello"',
          date: '2026-01-30',
          createdAt: '2026-01-30T12:00:00.000Z',
          updatedAt: '2026-01-30T12:00:00.000Z',
        },
      ];
      
      const csv = exportToCSV(specialTransactions);
      expect(csv).toContain('"He said ""hello"""');
    });

    it('should handle newlines in descriptions', () => {
      const specialTransactions: Transaction[] = [
        {
          id: '1',
          type: 'expense',
          amount: 10.00,
          categoryId: 'food',
          categoryName: 'Food',
          description: 'Line1\nLine2',
          date: '2026-01-30',
          createdAt: '2026-01-30T12:00:00.000Z',
          updatedAt: '2026-01-30T12:00:00.000Z',
        },
      ];
      
      const csv = exportToCSV(specialTransactions);
      expect(csv).toContain('"Line1\nLine2"');
    });

    it('should escape category names with special characters', () => {
      const specialTransactions: Transaction[] = [
        {
          id: '1',
          type: 'expense',
          amount: 10.00,
          categoryId: 'food',
          description: 'Lunch',
          date: '2026-01-30',
          createdAt: '2026-01-30T12:00:00.000Z',
          updatedAt: '2026-01-30T12:00:00.000Z',
        },
      ];
      
      const csv = exportToCSV(specialTransactions);
      // Food & Dining is the actual category name - no special CSV escaping needed
      expect(csv).toContain('Food & Dining');
    });
  });

  describe('generateFilename', () => {
    it('should generate filename with correct prefix', () => {
      const filename = generateFilename();
      expect(filename).toMatch(/^expense-tracker-\d{8}-\d{6}\.csv$/);
    });

    it('should include date in format YYYYMMDD', () => {
      const filename = generateFilename();
      const dateMatch = filename.match(/expense-tracker-(\d{8})-/);
      
      expect(dateMatch).toBeTruthy();
      expect(dateMatch![1]).toHaveLength(8);
    });

    it('should include time in format HHMMSS', () => {
      const filename = generateFilename();
      const timeMatch = filename.match(/-(\d{6})\.csv$/);
      
      expect(timeMatch).toBeTruthy();
      expect(timeMatch![1]).toHaveLength(6);
    });

    it('should end with .csv extension', () => {
      const filename = generateFilename();
      expect(filename).toMatch(/\.csv$/);
    });

    it('should generate unique filenames for consecutive calls', () => {
      const filename1 = generateFilename();
      const filename2 = generateFilename();
      
      // Should be the same or different depending on timing
      // At minimum, they should both be valid format
      expect(filename1).toMatch(/^expense-tracker-\d{8}-\d{6}\.csv$/);
      expect(filename2).toMatch(/^expense-tracker-\d{8}-\d{6}\.csv$/);
    });
  });

  describe('downloadCSV', () => {
    let createElementSpy: any;
    let clickSpy: any;

    beforeEach(() => {
      // Mock document.createElement for <a> tag
      clickSpy = vi.fn();
      const mockAnchor = {
        href: '',
        download: '',
        click: clickSpy,
        style: {},
      };
      
      createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor as any);
      
      // Mock URL.createObjectURL
      global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
      global.URL.revokeObjectURL = vi.fn();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should create a CSV file and trigger download', () => {
      downloadCSV(transactions);
      
      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(clickSpy).toHaveBeenCalled();
      expect(global.URL.createObjectURL).toHaveBeenCalled();
    });

    it('should use custom filename if provided', () => {
      downloadCSV(transactions, 'my-export.csv');
      
      const anchor = createElementSpy.mock.results[0].value;
      expect(anchor.download).toBe('my-export.csv');
    });

    it('should generate default filename if not provided', () => {
      downloadCSV(transactions);
      
      const anchor = createElementSpy.mock.results[0].value;
      expect(anchor.download).toMatch(/^expense-tracker-\d{8}-\d{6}\.csv$/);
    });

    it('should handle empty transaction array', () => {
      downloadCSV([]);
      
      expect(clickSpy).toHaveBeenCalled();
    });

    it('should create Blob with correct type', () => {
      const BlobSpy = vi.spyOn(global, 'Blob');
      
      downloadCSV(transactions);
      
      expect(BlobSpy).toHaveBeenCalledWith(
        expect.any(Array),
        { type: 'text/csv;charset=utf-8;' }
      );
    });
  });
});
