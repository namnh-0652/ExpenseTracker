import { useState, useMemo } from 'react';
import { TransactionProvider, useTransactions } from '@/features/transactions/hooks/useTransactions';
import { TransactionForm } from '@/features/transactions/components/TransactionForm/TransactionForm';
import { TransactionList } from '@/features/transactions/components/TransactionList/TransactionList';
import { Dashboard } from '@/features/dashboard/components/Dashboard/Dashboard';
import { FilterBar } from '@/features/filters/components/FilterBar/FilterBar';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog/ConfirmDialog';
import { Header } from '@/shared/components/Header/Header';
import { Footer } from '@/shared/components/Footer/Footer';
import { TabNav } from '@/shared/components/TabNav/TabNav';
import { IncomeAnimation } from '@/shared/components/IncomeAnimation/IncomeAnimation';
import { ThemeProvider } from '@/features/theme/ThemeProvider';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import { TAB_STORAGE_KEY, type TabValue } from '@/shared/constants/theme';
import { applyFilters, type FilterCriteria } from '@/features/filters/services/filterService';
import type { Transaction, TransactionFormData } from '@/shared/types';
import './App.css';

function AppContent() {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useTransactions();
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [activeTab, setActiveTab] = useLocalStorage<TabValue>(TAB_STORAGE_KEY, 'dashboard');
  const [filters, setFilters] = useState<FilterCriteria>({});
  const [showCelebration, setShowCelebration] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; transactionId: string | null }>({
    isOpen: false,
    transactionId: null,
  });

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
      // Trigger celebration animation for income transactions only
      if (data.type === 'income') {
        setShowCelebration(true);
      }
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setActiveTab('transactions');
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditingTransaction(null);
  };

  const handleDelete = (id: string) => {
    setDeleteConfirm({ isOpen: true, transactionId: id });
  };

  const confirmDelete = () => {
    if (deleteConfirm.transactionId) {
      deleteTransaction(deleteConfirm.transactionId);
      if (editingTransaction?.id === deleteConfirm.transactionId) {
        setEditingTransaction(null);
      }
    }
    setDeleteConfirm({ isOpen: false, transactionId: null });
  };

  const cancelDelete = () => {
    setDeleteConfirm({ isOpen: false, transactionId: null });
  };

  return (
    <div className="app-container">
      <Header />

      <TabNav activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="app-main">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div
            role="tabpanel"
            id="dashboard-panel"
            aria-labelledby="dashboard-tab"
            className="tab-content"
          >
            <Dashboard />
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div
            role="tabpanel"
            id="transactions-panel"
            aria-labelledby="transactions-tab"
            className="tab-content"
          >
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
              <h2>Transaction History</h2>
              <TransactionList
                transactions={transactions}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </section>
          </div>
        )}

        {/* Filters Tab */}
        {activeTab === 'filters' && (
          <div
            role="tabpanel"
            id="filters-panel"
            aria-labelledby="filters-tab"
            className="tab-content"
          >
            <section className="filter-section">
              <h2>Filter & Export</h2>
              <FilterBar
                onFilterChange={setFilters}
                activeFilterCount={activeFilterCount}
                transactions={filteredTransactions}
              />
              <div className="filtered-results">
                <h3>Filtered Results ({filteredTransactions.length} transactions)</h3>
                <TransactionList
                  transactions={filteredTransactions}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </div>
            </section>
          </div>
        )}
      </main>

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        type="danger"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
      
      {/* Income Celebration Animation */}
      {showCelebration && (
        <IncomeAnimation onComplete={() => setShowCelebration(false)} />
      )}
      
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <TransactionProvider>
        <AppContent />
      </TransactionProvider>
    </ThemeProvider>
  );
}

export default App;

