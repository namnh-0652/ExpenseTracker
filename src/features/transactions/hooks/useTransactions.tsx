/**
 * Transaction Context
 * Global state management for transactions using React Context API
 */

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { STORAGE_KEYS } from '../../../shared/constants/storageKeys';
import * as storageService from '../../../shared/utils/storageUtils';
import { Transaction, TransactionFormData } from '../../../shared/types';

interface TransactionContextValue {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  addTransaction: (data: TransactionFormData) => Transaction;
  updateTransaction: (id: string, updates: Partial<TransactionFormData>) => Transaction | null;
  deleteTransaction: (id: string) => boolean;
  getTransactionById: (id: string) => Transaction | null;
}

const TransactionContext = createContext<TransactionContextValue | undefined>(undefined);

/**
 * Hook to access transaction context
 * @returns Transaction context value
 * @throws Error if used outside TransactionProvider
 */
export function useTransactions(): TransactionContextValue {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within TransactionProvider');
  }
  return context;
}

interface TransactionProviderProps {
  children: ReactNode;
}

/**
 * Transaction Provider Component
 * Wraps the app to provide transaction state and methods
 */
export function TransactionProvider({ children }: TransactionProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load transactions from localStorage on mount
  useEffect(() => {
    try {
      const loaded = storageService.load<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, []);
      // Sort by date descending (newest first)
      const sorted = loaded.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setTransactions(sorted);
      setError(null);
    } catch (err) {
      console.error('Failed to load transactions:', err);
      setError('Failed to load transactions from storage');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save transactions to localStorage whenever they change
  const saveTransactions = useCallback((newTransactions: Transaction[]) => {
    try {
      storageService.save(STORAGE_KEYS.TRANSACTIONS, newTransactions);
      setError(null);
    } catch (err) {
      console.error('Failed to save transactions:', err);
      setError('Failed to save transactions to storage');
      throw err;
    }
  }, []);

  // Add a new transaction
  const addTransaction = useCallback((transactionData: TransactionFormData): Transaction => {
    const newTransaction = {
      ...transactionData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setTransactions(prev => {
      const updated = [newTransaction, ...prev];
      saveTransactions(updated);
      return updated;
    });

    return newTransaction;
  }, [saveTransactions]);

  // Update an existing transaction
  const updateTransaction = useCallback((id: string, updates: Partial<TransactionFormData>): Transaction | null => {
    let updatedTransaction: Transaction | null = null;

    setTransactions(prev => {
      const updated = prev.map(t => {
        if (t.id === id) {
          updatedTransaction = {
            ...t,
            ...updates,
            id,  // Prevent ID change
            createdAt: t.createdAt,  // Preserve creation time
            updatedAt: new Date().toISOString()
          };
          return updatedTransaction;
        }
        return t;
      });
      saveTransactions(updated);
      return updated;
    });

    return updatedTransaction;
  }, [saveTransactions]);

  // Delete a transaction
  const deleteTransaction = useCallback((id: string): boolean => {
    let success = false;

    setTransactions(prev => {
      const filtered = prev.filter(t => t.id !== id);
      success = filtered.length < prev.length;
      if (success) {
        saveTransactions(filtered);
      }
      return filtered;
    });

    return success;
  }, [saveTransactions]);

  // Get transaction by ID
  const getTransactionById = useCallback((id: string): Transaction | null => {
    return transactions.find(t => t.id === id) || null;
  }, [transactions]);

  const value = {
    transactions,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionById
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}
