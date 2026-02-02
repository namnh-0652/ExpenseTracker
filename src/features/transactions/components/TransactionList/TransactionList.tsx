import React from 'react';
import { getCategoryById } from '@/shared/services/categoryService';
import { formatDate, formatCurrency } from '@/shared/utils/dateUtils';
import type { Transaction } from '@/shared/types';
import './TransactionList.css';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (id: string) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onEdit,
  onDelete,
}) => {
  if (transactions.length === 0) {
    return (
      <div className="transaction-list-empty">
        <p>No transactions yet. Add your first transaction to get started!</p>
      </div>
    );
  }

  const handleDelete = (id: string, description: string) => {
    if (window.confirm(`Are you sure you want to delete "${description}"?`)) {
      onDelete?.(id);
    }
  };

  return (
    <div className="transaction-list">
      <div className="transaction-list-header">
        <h2>Recent Transactions</h2>
        <span className="transaction-count">{transactions.length} transaction{transactions.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="transaction-items">
        {transactions.map((transaction) => {
          const category = getCategoryById(transaction.categoryId);
          const isIncome = transaction.type === 'income';

          return (
            <div
              key={transaction.id}
              className={`transaction-item ${isIncome ? 'income' : 'expense'}`}
            >
              <div className="transaction-icon">
                {category?.icon || '💰'}
              </div>

              <div className="transaction-details">
                <div className="transaction-main">
                  <span className="transaction-description">
                    {transaction.description || '(No description)'}
                  </span>
                  <span className="transaction-category">
                    {category?.name || 'Unknown'}
                  </span>
                </div>
                <div className="transaction-meta">
                  <span className="transaction-date">
                    {formatDate(transaction.date, 'MMM dd, yyyy')}
                  </span>
                </div>
              </div>

              <div className="transaction-amount">
                <span className={`amount ${isIncome ? 'positive' : 'negative'}`}>
                  {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
                </span>
              </div>

              {(onEdit || onDelete) && (
                <div className="transaction-actions">
                  {onEdit && (
                    <button
                      className="btn-icon"
                      onClick={() => onEdit(transaction)}
                      aria-label="Edit transaction"
                      title="Edit"
                    >
                      ✏️
                    </button>
                  )}
                  {onDelete && (
                    <button
                      className="btn-icon btn-delete"
                      onClick={() => handleDelete(transaction.id, transaction.description || 'this transaction')}
                      aria-label="Delete transaction"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
