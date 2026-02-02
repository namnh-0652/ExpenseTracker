import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as transactionService from '@/features/transactions/services/transactionService';
import * as storageUtils from '@/shared/utils/storageUtils';
import { STORAGE_KEYS } from '@/shared/constants/storageKeys';
import type { Transaction, TransactionFormData } from '@/shared/types';

// Mock the storageUtils module
vi.mock('@/shared/utils/storageUtils', () => ({
  save: vi.fn(),
  load: vi.fn(),
  StorageError: class StorageError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'StorageError';
    }
  },
}));

// Mock the categoryService to avoid circular dependencies
vi.mock('@/shared/services/categoryService', () => ({
  categoryExists: vi.fn((id: string) => {
    const validCategories = ['food', 'salary', 'transport', 'freelance'];
    return validCategories.includes(id);
  }),
}));

describe('transactionService', () => {
  const mockTransactions: Transaction[] = [
    {
      id: '1',
      amount: 50.5,
      date: '2026-01-30',
      type: 'expense',
      categoryId: 'food',
      description: 'Lunch',
      createdAt: '2026-01-30T10:00:00.000Z',
      updatedAt: '2026-01-30T10:00:00.000Z',
    },
    {
      id: '2',
      amount: 1000,
      date: '2026-01-25',
      type: 'income',
      categoryId: 'salary',
      description: 'Monthly salary',
      createdAt: '2026-01-25T09:00:00.000Z',
      updatedAt: '2026-01-25T09:00:00.000Z',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset the module state
    vi.resetModules();
  });

  describe('getAllTransactions', () => {
    it('should return all transactions sorted by date descending', () => {
      vi.mocked(storageUtils.load).mockReturnValue(mockTransactions);

      const result = transactionService.getAllTransactions();

      expect(storageUtils.load).toHaveBeenCalledWith(STORAGE_KEYS.TRANSACTIONS, []);
      expect(result).toHaveLength(2);
      // Newest first (2026-01-30 before 2026-01-25)
      expect(result[0].date).toBe('2026-01-30');
      expect(result[1].date).toBe('2026-01-25');
    });

    it('should return empty array when no transactions exist', () => {
      vi.mocked(storageUtils.load).mockReturnValue([]);

      const result = transactionService.getAllTransactions();

      expect(result).toEqual([]);
    });

    it('should throw StorageError when storage is corrupted', () => {
      vi.mocked(storageUtils.load).mockImplementation(() => {
        throw new storageUtils.StorageError('Corrupted data');
      });

      expect(() => transactionService.getAllTransactions()).toThrow('Corrupted data');
    });
  });

  describe('getTransactionById', () => {
    beforeEach(() => {
      vi.mocked(storageUtils.load).mockReturnValue(mockTransactions);
    });

    it('should return transaction when found', () => {
      const result = transactionService.getTransactionById('1');

      expect(result).not.toBeNull();
      expect(result?.id).toBe('1');
      expect(result?.description).toBe('Lunch');
    });

    it('should return null when transaction not found', () => {
      const result = transactionService.getTransactionById('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('createTransaction', () => {
    const validTransactionData: TransactionFormData = {
      amount: 75.25,
      date: '2026-01-31',
      type: 'expense',
      categoryId: 'food',
      description: 'Dinner',
    };

    beforeEach(() => {
      vi.mocked(storageUtils.load).mockReturnValue(mockTransactions);
      vi.mocked(storageUtils.save).mockImplementation(() => {});
    });

    it('should create a new transaction with generated id and timestamps', () => {
      const result = transactionService.createTransaction(validTransactionData);

      expect(result.id).toBeDefined();
      expect(result.id).not.toBe('');
      expect(result.amount).toBe(75.25);
      expect(result.date).toBe('2026-01-31');
      expect(result.type).toBe('expense');
      expect(result.categoryId).toBe('food');
      expect(result.description).toBe('Dinner');
      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();
      expect(result.createdAt).toBe(result.updatedAt); // Initially same
    });

    it('should save transaction to storage', () => {
      const result = transactionService.createTransaction(validTransactionData);

      expect(storageUtils.save).toHaveBeenCalledWith(
        STORAGE_KEYS.TRANSACTIONS,
        expect.arrayContaining([
          expect.objectContaining({
            id: result.id,
            amount: 75.25,
          }),
        ])
      );
    });

    it('should throw ValidationError for invalid amount', () => {
      const invalidData = { ...validTransactionData, amount: -10 };

      expect(() => transactionService.createTransaction(invalidData)).toThrow('Validation failed');
    });

    it('should throw ValidationError for zero amount', () => {
      const invalidData = { ...validTransactionData, amount: 0 };

      expect(() => transactionService.createTransaction(invalidData)).toThrow('Validation failed');
    });

    it('should throw ValidationError for non-numeric amount', () => {
      const invalidData = { ...validTransactionData, amount: NaN };

      expect(() => transactionService.createTransaction(invalidData)).toThrow('Validation failed');
    });

    it('should throw ValidationError for invalid date format', () => {
      const invalidData = { ...validTransactionData, date: '31/01/2026' };

      expect(() => transactionService.createTransaction(invalidData)).toThrow('Validation failed');
    });

    it('should throw ValidationError for invalid type', () => {
      const invalidData = { ...validTransactionData, type: 'transfer' as 'expense' };

      expect(() => transactionService.createTransaction(invalidData)).toThrow('Validation failed');
    });

    it('should throw ValidationError for invalid categoryId', () => {
      const invalidData = { ...validTransactionData, categoryId: 'nonexistent' };

      expect(() => transactionService.createTransaction(invalidData)).toThrow('Validation failed');
    });

    it('should allow empty description (optional field)', () => {
      const dataWithEmptyDesc = { ...validTransactionData, description: '' };

      const result = transactionService.createTransaction(dataWithEmptyDesc);

      expect(result.description).toBe('');
    });

    it('should allow whitespace-only description (optional field)', () => {
      const dataWithWhitespace = { ...validTransactionData, description: '   ' };

      const result = transactionService.createTransaction(dataWithWhitespace);

      expect(result.description).toBe('   ');
    });

    it('should throw StorageError when save fails', () => {
      vi.mocked(storageUtils.save).mockImplementation(() => {
        throw new storageUtils.StorageError('Storage full');
      });

      expect(() => transactionService.createTransaction(validTransactionData)).toThrow('Storage full');
    });
  });

  describe('updateTransaction', () => {
    beforeEach(() => {
      vi.mocked(storageUtils.load).mockReturnValue(mockTransactions);
      vi.mocked(storageUtils.save).mockImplementation(() => {});
    });

    it('should update existing transaction', () => {
      const updates = {
        amount: 60,
        description: 'Updated lunch',
      };

      const result = transactionService.updateTransaction('1', updates);

      expect(result.id).toBe('1');
      expect(result.amount).toBe(60);
      expect(result.description).toBe('Updated lunch');
      expect(result.updatedAt).not.toBe(mockTransactions[0].updatedAt);
    });

    it('should preserve unchanged fields', () => {
      const updates = { amount: 60 };

      const result = transactionService.updateTransaction('1', updates);

      expect(result.date).toBe('2026-01-30');
      expect(result.type).toBe('expense');
      expect(result.categoryId).toBe('food');
      expect(result.createdAt).toBe('2026-01-30T10:00:00.000Z');
    });

    it('should throw NotFoundError when transaction does not exist', () => {
      expect(() => transactionService.updateTransaction('nonexistent', { amount: 100 })).toThrow(
        'Transaction not found'
      );
    });

    it('should throw ValidationError for invalid updates', () => {
      const invalidUpdates = { amount: -50 };

      expect(() => transactionService.updateTransaction('1', invalidUpdates)).toThrow('Validation failed');
    });

    it('should save updated transaction to storage', () => {
      const updates = { amount: 60 };

      transactionService.updateTransaction('1', updates);

      expect(storageUtils.save).toHaveBeenCalledWith(
        STORAGE_KEYS.TRANSACTIONS,
        expect.arrayContaining([
          expect.objectContaining({
            id: '1',
            amount: 60,
          }),
        ])
      );
    });

    it('should not allow updating id', () => {
      const updates = { id: 'new-id' } as any;

      const result = transactionService.updateTransaction('1', updates);

      // ID should remain unchanged
      expect(result.id).toBe('1');
    });

    it('should not allow updating createdAt', () => {
      const updates = { createdAt: '2026-02-01T00:00:00.000Z' } as any;

      const result = transactionService.updateTransaction('1', updates);

      // createdAt should remain unchanged
      expect(result.createdAt).toBe('2026-01-30T10:00:00.000Z');
    });
  });

  describe('deleteTransaction', () => {
    beforeEach(() => {
      vi.mocked(storageUtils.load).mockReturnValue(mockTransactions);
      vi.mocked(storageUtils.save).mockImplementation(() => {});
    });

    it('should delete existing transaction', () => {
      const result = transactionService.deleteTransaction('1');

      expect(result).toBe(true);
      expect(storageUtils.save).toHaveBeenCalledWith(
        STORAGE_KEYS.TRANSACTIONS,
        expect.not.arrayContaining([expect.objectContaining({ id: '1' })])
      );
    });

    it('should return false when transaction not found', () => {
      const result = transactionService.deleteTransaction('nonexistent');

      expect(result).toBe(false);
      expect(storageUtils.save).not.toHaveBeenCalled();
    });

    it('should throw StorageError when save fails', () => {
      vi.mocked(storageUtils.save).mockImplementation(() => {
        throw new storageUtils.StorageError('Storage error');
      });

      expect(() => transactionService.deleteTransaction('1')).toThrow('Storage error');
    });
  });

  describe('validateTransaction', () => {
    it('should return valid for correct transaction data', () => {
      const validData: Partial<Transaction> = {
        amount: 50,
        date: '2026-01-30',
        type: 'expense',
        categoryId: 'food',
        description: 'Valid description',
      };

      const result = transactionService.validateTransaction(validData);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return errors for multiple invalid fields', () => {
      const invalidData: Partial<Transaction> = {
        amount: -50,
        date: 'invalid-date',
        type: 'invalid' as 'expense',
        categoryId: 'nonexistent',
        // Description is optional, so we don't test it here
      };

      const result = transactionService.validateTransaction(invalidData);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some(e => e.field === 'amount')).toBe(true);
      expect(result.errors.some(e => e.field === 'date')).toBe(true);
      expect(result.errors.some(e => e.field === 'type')).toBe(true);
      expect(result.errors.some(e => e.field === 'categoryId')).toBe(true);
    });

    it('should validate partial transaction data', () => {
      const partialData: Partial<Transaction> = {
        amount: 100,
      };

      const result = transactionService.validateTransaction(partialData);

      // Only amount is provided and it's valid, so should be valid
      expect(result.isValid).toBe(true);
    });
  });
});
