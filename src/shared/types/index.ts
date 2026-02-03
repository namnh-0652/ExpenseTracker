/**
 * Core Types
 * Shared type definitions for the application
 */

export interface Transaction {
  id: string;
  amount: number;
  date: string;  // YYYY-MM-DD
  type: 'income' | 'expense';
  categoryId: string;
  categoryName: string;
  description: string;
  createdAt: string;  // ISO 8601
  updatedAt: string;  // ISO 8601
}

export type TransactionFormData = Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>;
