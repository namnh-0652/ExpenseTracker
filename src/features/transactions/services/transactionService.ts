import { v4 as uuidv4 } from 'uuid';
import { save, load, StorageError } from '@/shared/utils/storageUtils';
import { STORAGE_KEYS } from '@/shared/constants/storageKeys';
import {
  validateAmount,
  validateDate,
  validateType,
  validateCategoryId,
  validateDescription,
} from '@/shared/utils/validationUtils';
import type { Transaction, TransactionFormData } from '@/shared/types';

// Custom error classes
export class ValidationError extends Error {
  constructor(public errors: { field: string; message: string }[]) {
    super('Validation failed');
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends Error {
  constructor(public id: string) {
    super(`Transaction not found: ${id}`);
    this.name = 'NotFoundError';
  }
}

export interface ValidationResult {
  isValid: boolean;
  errors: { field: string; message: string }[];
}

/**
 * Retrieve all transactions from storage
 * @returns Array of all transactions, sorted by date descending
 * @throws StorageError if storage is corrupted
 */
export function getAllTransactions(): Transaction[] {
  try {
    const transactions = load<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, []);

    // Sort by date descending (newest first)
    return [...transactions].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  } catch (error) {
    if (error instanceof StorageError) {
      throw error;
    }
    throw new StorageError('Failed to load transactions', error as Error);
  }
}

/**
 * Retrieve a single transaction by ID
 * @param id - Transaction UUID
 * @returns Transaction object or null if not found
 */
export function getTransactionById(id: string): Transaction | null {
  const transactions = getAllTransactions();
  return transactions.find(t => t.id === id) || null;
}

/**
 * Validate transaction data
 * @param transaction - Transaction data to validate
 * @returns ValidationResult with errors (if any)
 */
export function validateTransaction(transaction: Partial<Transaction>): ValidationResult {
  const errors: { field: string; message: string }[] = [];

  // Validate amount if provided
  if (transaction.amount !== undefined) {
    const amountError = validateAmount(transaction.amount);
    if (amountError) {
      errors.push({ field: 'amount', message: amountError });
    }
  }

  // Validate date if provided
  if (transaction.date !== undefined) {
    const dateError = validateDate(transaction.date);
    if (dateError) {
      errors.push({ field: 'date', message: dateError });
    }
  }

  // Validate type if provided
  if (transaction.type !== undefined) {
    const typeError = validateType(transaction.type);
    if (typeError) {
      errors.push({ field: 'type', message: typeError });
    }
  }

  // Validate categoryId if provided
  if (transaction.categoryId !== undefined) {
    const categoryError = validateCategoryId(transaction.categoryId);
    if (categoryError) {
      errors.push({ field: 'categoryId', message: categoryError });
    }
  }

  // Validate description if provided
  if (transaction.description !== undefined) {
    const descError = validateDescription(transaction.description);
    if (descError) {
      errors.push({ field: 'description', message: descError });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Create a new transaction
 * @param transactionData - Partial transaction (id, createdAt, updatedAt auto-generated)
 * @returns The created transaction with generated fields
 * @throws ValidationError if data is invalid
 * @throws StorageError if save fails
 */
export function createTransaction(transactionData: TransactionFormData): Transaction {
  // Validate the transaction data
  const validation = validateTransaction(transactionData);
  if (!validation.isValid) {
    throw new ValidationError(validation.errors);
  }

  // Create new transaction with generated fields
  const now = new Date().toISOString();
  const newTransaction: Transaction = {
    id: uuidv4(),
    ...transactionData,
    createdAt: now,
    updatedAt: now,
  };

  // Load existing transactions
  const transactions = getAllTransactions();

  // Add new transaction
  transactions.push(newTransaction);

  // Save to storage
  try {
    save(STORAGE_KEYS.TRANSACTIONS, transactions);
  } catch (error) {
    if (error instanceof StorageError) {
      throw error;
    }
    throw new StorageError('Failed to save transaction', error as Error);
  }

  return newTransaction;
}

/**
 * Update an existing transaction
 * @param id - Transaction UUID to update
 * @param updates - Fields to update (partial)
 * @returns Updated transaction
 * @throws ValidationError if updates are invalid
 * @throws NotFoundError if transaction doesn't exist
 * @throws StorageError if save fails
 */
export function updateTransaction(
  id: string,
  updates: Partial<Omit<Transaction, 'id' | 'createdAt'>>
): Transaction {
  // Load existing transactions
  const transactions = getAllTransactions();

  // Find transaction to update
  const index = transactions.findIndex(t => t.id === id);
  if (index === -1) {
    throw new NotFoundError(id);
  }

  // Validate updates
  const validation = validateTransaction(updates);
  if (!validation.isValid) {
    throw new ValidationError(validation.errors);
  }

  // Update transaction (preserve id and createdAt)
  const existingTransaction = transactions[index];
  const updatedTransaction: Transaction = {
    ...existingTransaction,
    ...updates,
    id: existingTransaction.id, // Preserve original id
    createdAt: existingTransaction.createdAt, // Preserve original createdAt
    updatedAt: new Date().toISOString(),
  };

  // Replace in array
  transactions[index] = updatedTransaction;

  // Save to storage
  try {
    save(STORAGE_KEYS.TRANSACTIONS, transactions);
  } catch (error) {
    if (error instanceof StorageError) {
      throw error;
    }
    throw new StorageError('Failed to update transaction', error as Error);
  }

  return updatedTransaction;
}

/**
 * Delete a transaction
 * @param id - Transaction UUID to delete
 * @returns true if deleted, false if not found
 * @throws StorageError if delete fails
 */
export function deleteTransaction(id: string): boolean {
  // Load existing transactions
  const transactions = getAllTransactions();

  // Find transaction to delete
  const index = transactions.findIndex(t => t.id === id);
  if (index === -1) {
    return false;
  }

  // Remove from array
  transactions.splice(index, 1);

  // Save to storage
  try {
    save(STORAGE_KEYS.TRANSACTIONS, transactions);
  } catch (error) {
    if (error instanceof StorageError) {
      throw error;
    }
    throw new StorageError('Failed to delete transaction', error as Error);
  }

  return true;
}
