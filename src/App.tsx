import { useState, useMemo } from 'react';
import { TransactionProvider, useTransactions } from '@/features/transactions/hooks/useTransactions';
import { TransactionForm } from '@/features/transactions/components/TransactionForm/TransactionForm';
import { TransactionList } from '@/features/transactions/components/TransactionList/TransactionList';
import { Dashboard } from '@/features/dashboard/components/Dashboard/Dashboard';
import { FilterBar } from '@/features/filters/components/FilterBar/FilterBar';
import { applyFilters, type FilterCriteria } from '@/features/filters/services/filterService';
import type { Transaction, TransactionFormData } from '@/shared/types';
import './App.css';

type View = 'dashboard' | 'transactions';

function AppContent() {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useTransactions();
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [filters, setFilters] = useState<FilterCriteria>({});

  // Apply filters to transactions with useMemo optimization
  const filteredTransactions = useMemo(() => {
    return applyFilters(transactions, filters);
  }, [transactions, filters]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.searchText) count++;
    if (filters.type && filters.type !== 'all') count++;
    if (filters.categoryId) count++;
    if (filters.dateRange?.start || filters.dateRange?.end) count++;
    return count;
  }, [filters]);

  const handleSubmit = (data: TransactionFormData) => {
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, data);
      setEditingTransaction(null);
    } else {
      addTransaction(data);
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setCurrentView('transactions');
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditingTransaction(null);
  };

  const handleDelete = (id: string) => {
    deleteTransaction(id);
    if (editingTransaction?.id === id) {
      setEditingTransaction(null);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>💰 Expense Tracker</h1>
        <p>Track your income and expenses</p>
        
        <nav className="app-nav">
          <button
            className={`nav-btn ${currentView === 'dashboard' ? 'active' : ''}`}
            onClick={() => setCurrentView('dashboard')}
          >
            📊 Dashboard
          </button>
          <button
            className={`nav-btn ${currentView === 'transactions' ? 'active' : ''}`}
            onClick={() => setCurrentView('transactions')}
          >
            📝 Transactions
          </button>
        </nav>
      </header>

      <main className="app-main">
        {currentView === 'dashboard' ? (
          <Dashboard />
        ) : (
          <>
            <section className="form-section">
              <h2>{editingTransaction ? 'Edit Transaction' : 'Add Transaction'}</h2>
              <TransactionForm
                onSubmit={handleSubmit}
                onCancel={editingTransaction ? handleCancel : undefined}
                initialData={editingTransaction}
                submitLabel={editingTransaction ? 'Update' : 'Add Transaction'}
              />
            </section>

            <section className="list-section">
              <FilterBar
                onFilterChange={setFilters}
                activeFilterCount={activeFilterCount}
              />
              <TransactionList
                transactions={filteredTransactions}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <TransactionProvider>
      <AppContent />
    </TransactionProvider>
  );
}

export default App;

