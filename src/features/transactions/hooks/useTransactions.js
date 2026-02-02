/**
 * Transaction Context
 * Global state management for transactions using React Context API
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { STORAGE_KEYS } from '../constants/storageKeys.js';
import * as storageService from '../utils/storageUtils.js';

const TransactionContext = createContext(undefined);

/**
 * Hook to access transaction context
 * @returns {Object} Transaction context value
 * @throws {Error} if used outside TransactionProvider
 */
export function useTransactions() {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within TransactionProvider');
  }
  return context;
}

/**
 * Transaction Provider Component
 * Wraps the app to provide transaction state and methods
 */
export function TransactionProvider({ children }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load transactions from localStorage on mount
  useEffect(() => {
    try {
      const loaded = storageService.load(STORAGE_KEYS.TRANSACTIONS, []);
      // Sort by date descending (newest first)
      const sorted = loaded.sort((a, b) => new Date(b.date) - new Date(a.date));
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
  const saveTransactions = useCallback((newTransactions) => {
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
  const addTransaction = useCallback((transactionData) => {
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
  const updateTransaction = useCallback((id, updates) => {
    let updatedTransaction = null;

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
  const deleteTransaction = useCallback((id) => {
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
  const getTransactionById = useCallback((id) => {
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
