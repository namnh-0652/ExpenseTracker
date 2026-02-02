import { useState } from 'react';
import { TransactionProvider, useTransactions } from '@/features/transactions/hooks/useTransactions';
import { TransactionForm } from '@/features/transactions/components/TransactionForm/TransactionForm';
import { TransactionList } from '@/features/transactions/components/TransactionList/TransactionList';
import { Dashboard } from '@/features/dashboard/components/Dashboard/Dashboard';
import type { Transaction, TransactionFormData } from '@/shared/types';
import './App.css';

type View = 'dashboard' | 'transactions';

function AppContent() {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useTransactions();
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [currentView, setCurrentView] = useState<View>('dashboard');

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
              <TransactionList
                transactions={transactions}
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

