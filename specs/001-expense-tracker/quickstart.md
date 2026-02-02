# Quick Start Guide: ExpenseTracker

**Feature**: 001-expense-tracker  
**Date**: January 30, 2026  
**For**: Developers implementing the feature

---

## Project Setup

### Prerequisites

- Node.js 18+ and npm 9+
- Modern browser (Chrome, Firefox, Safari, or Edge)
- Git
- Code editor (VS Code recommended)

### Initial Setup

```bash
# 1. Create React app with Vite
npm create vite@latest expense-tracker -- --template react
cd expense-tracker

# 2. Install dependencies
npm install

# 3. Install additional dependencies
npm install date-fns uuid

# 4. Install dev dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event vitest jsdom

# 5. Start development server
npm run dev
```

Server starts at `http://localhost:5173`

---

## Project Structure

After setup, create this feature-first structure (Constitution Principle III):

```bash
mkdir -p src/features/{transactions,dashboard,filters,export}
mkdir -p src/features/transactions/{components,services,hooks}
mkdir -p src/features/dashboard/{components,services}
mkdir -p src/features/filters/{components,services}
mkdir -p src/features/export/{components,services}
mkdir -p src/shared/{components,services,utils,constants}
mkdir -p tests/features/{transactions,dashboard,filters,export}
mkdir -p tests/shared/utils
```

**Full structure:**
```
src/
├── features/                      # Feature-first organization
│   ├── transactions/              # P1: Transaction management
│   │   ├── components/
│   │   │   ├── TransactionForm/
│   │   │   └── TransactionList/
│   │   ├── services/
│   │   │   └── transactionService.js
│   │   └── hooks/
│   │       └── useTransactions.js
│   ├── dashboard/                 # P2: Analytics & reporting
│   │   ├── components/
│   │   │   ├── Dashboard/
│   │   │   ├── SummaryCard/
│   │   │   ├── CategoryChart/
│   │   │   └── TimePeriodSelector/
│   │   └── services/
│   │       └── calculationService.js
│   ├── filters/                   # P3: Search & filter
│   │   ├── components/
│   │   │   └── FilterBar/
│   │   └── services/
│   │       └── filterService.js
│   └── export/                    # P3: CSV export
│       ├── components/
│       │   └── ExportButton/
│       └── services/
│           └── exportService.js
├── shared/                        # Cross-feature shared code
│   ├── components/
│   │   ├── Button/
│   │   └── Input/
│   ├── services/
│   │   └── categoryService.js
│   ├── utils/
│   │   ├── storageUtils.js
│   │   ├── validationUtils.js
│   │   └── dateUtils.js
│   └── constants/
│       ├── categories.js
│       └── storageKeys.js
├── App.jsx
├── App.css
└── main.jsx

tests/
├── features/
│   ├── transactions/
│   │   └── services/
│   │       └── transactionService.test.js
│   ├── dashboard/
│   │   └── services/
│   │       └── calculationService.test.js
│   ├── filters/
│   │   └── services/
│   │       └── filterService.test.js
│   └── export/
│       └── services/
│           └── exportService.test.js
└── shared/
    └── utils/
        ├── validationUtils.test.js
        └── dateUtils.test.js
```

---

## Development Workflow

### Phase-by-Phase Implementation

**Progressive Enhancement Strategy:**

1. **Phase P1**: Transaction CRUD + List View
   - Build and test transactionService
   - Build TransactionForm component
   - Build TransactionList component
   - Deploy and validate

2. **Phase P2**: Dashboard with Time Filters
   - Build calculationService
   - Build Dashboard component
   - Add time period filters
   - Deploy and validate

3. **Phase P3**: Search, Filter, and Export
   - Build filterService and exportService
   - Build FilterBar component
   - Add CSV export button
   - Deploy and validate

### TDD Approach

For each service:
1. **Write test** (see [service-contracts.md](./contracts/service-contracts.md) for contract specs)
2. **Run test** → Should fail (red)
3. **Implement service** → Make test pass (green)
4. **Refactor** → Improve code while keeping tests green

Example:
```bash
# 1. Create test file
touch tests/features/transactions/services/transactionService.test.js

# 2. Write test
# (see Testing Examples section below)

# 3. Run test
npm run test

# 4. Implement service
touch src/features/transactions/services/transactionService.js

# 5. Repeat until test passes
```

---

## Key Implementation Files

### 1. Storage Key Constants

**File**: `src/shared/constants/storageKeys.js`

```javascript
export const STORAGE_KEYS = {
  TRANSACTIONS: 'expense-tracker-transactions',
  SCHEMA_VERSION: 'expense-tracker-schema-version'
};

export const SCHEMA_VERSION = 1;
```

### 2. Default Categories

**File**: `src/shared/constants/categories.js`

```javascript
export const DEFAULT_CATEGORIES = {
  expense: [
    { id: 'food', name: 'Food & Dining', type: 'expense', icon: '🍔', isDefault: true },
    { id: 'transport', name: 'Transportation', type: 'expense', icon: '🚗', isDefault: true },
    { id: 'entertainment', name: 'Entertainment', type: 'expense', icon: '🎬', isDefault: true },
    { id: 'utilities', name: 'Utilities', type: 'expense', icon: '⚡', isDefault: true },
    { id: 'shopping', name: 'Shopping', type: 'expense', icon: '🛍️', isDefault: true },
    { id: 'healthcare', name: 'Healthcare', type: 'expense', icon: '🏥', isDefault: true },
    { id: 'education', name: 'Education', type: 'expense', icon: '📚', isDefault: true },
    { id: 'personal', name: 'Personal Care', type: 'expense', icon: '💇', isDefault: true },
    { id: 'housing', name: 'Housing', type: 'expense', icon: '🏠', isDefault: true },
    { id: 'other-expense', name: 'Other', type: 'expense', icon: '📦', isDefault: true }
  ],
  income: [
    { id: 'salary', name: 'Salary', type: 'income', icon: '💼', isDefault: true },
    { id: 'freelance', name: 'Freelance', type: 'income', icon: '💻', isDefault: true },
    { id: 'investment', name: 'Investment', type: 'income', icon: '📈', isDefault: true },
    { id: 'gift', name: 'Gift', type: 'income', icon: '🎁', isDefault: true },
    { id: 'bonus', name: 'Bonus', type: 'income', icon: '💰', isDefault: true },
    { id: 'other-income', name: 'Other', type: 'income', icon: '💵', isDefault: true }
  ]
};

export function getAllCategories() {
  return [...DEFAULT_CATEGORIES.expense, ...DEFAULT_CATEGORIES.income];
}

export function getCategoriesByType(type) {
  if (type === 'all') return getAllCategories();
  return DEFAULT_CATEGORIES[type] || [];
}
```

### 3. Transaction Context (Global State)

**File**: `src/shared/contexts/TransactionContext.jsx`

```javascript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { transactionService } from '../../features/transactions/services/transactionService.js';

const TransactionContext = createContext();

export function useTransactions() {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within TransactionProvider');
  }
  return context;
}

export function TransactionProvider({ children }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load transactions on mount
  useEffect(() => {
    try {
      const loaded = transactionService.getAllTransactions();
      setTransactions(loaded);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addTransaction = (transactionData) => {
    const newTransaction = transactionService.createTransaction(transactionData);
    setTransactions(prev => [newTransaction, ...prev]);
    return newTransaction;
  };

  const updateTransaction = (id, updates) => {
    const updated = transactionService.updateTransaction(id, updates);
    setTransactions(prev => 
      prev.map(t => t.id === id ? updated : t)
    );
    return updated;
  };

  const deleteTransaction = (id) => {
    const success = transactionService.deleteTransaction(id);
    if (success) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
    return success;
  };

  const value = {
    transactions,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}
```

**Usage in App.jsx:**
```javascript
import { TransactionProvider } from './shared/contexts/TransactionContext';

function App() {
  return (
    <TransactionProvider>
      <div className="app">
        {/* Your components */}
      </div>
    </TransactionProvider>
  );
}
```

---

## Testing Examples

### Service Test Example

**File**: `tests/features/dashboard/services/calculationService.test.js`

```javascript
import { describe, it, expect } from 'vitest';
import { calculationService } from '../../../../src/features/dashboard/services/calculationService.js';

describe('calculationService', () => {
  const sampleTransactions = [
    { id: '1', amount: 1000, type: 'income', categoryId: 'salary', date: '2026-01-15' },
    { id: '2', amount: 300, type: 'expense', categoryId: 'food', date: '2026-01-16' },
    { id: '3', amount: 500, type: 'income', categoryId: 'freelance', date: '2026-01-18' },
    { id: '4', amount: 200, type: 'expense', categoryId: 'transport', date: '2026-01-20' }
  ];

  it('calculates total income correctly', () => {
    const result = calculationService.calculateTotalIncome(sampleTransactions);
    expect(result).toBe(1500); // 1000 + 500
  });

  it('calculates total expenses correctly', () => {
    const result = calculationService.calculateTotalExpenses(sampleTransactions);
    expect(result).toBe(500); // 300 + 200
  });

  it('calculates net balance correctly', () => {
    const result = calculationService.calculateNetBalance(sampleTransactions);
    expect(result).toBe(1000); // 1500 - 500
  });

  it('handles empty transaction array', () => {
    expect(calculationService.calculateTotalIncome([])).toBe(0);
    expect(calculationService.calculateTotalExpenses([])).toBe(0);
    expect(calculationService.calculateNetBalance([])).toBe(0);
  });

  it('calculates category breakdown', () => {
    const breakdown = calculationService.calculateCategoryBreakdown(sampleTransactions, 'expense');
    
    expect(breakdown).toHaveLength(2);
    expect(breakdown[0]).toMatchObject({
      categoryId: 'food',
      amount: 300,
      percentage: 60,
      transactionCount: 1
    });
    expect(breakdown[1]).toMatchObject({
      categoryId: 'transport',
      amount: 200,
      percentage: 40,
      transactionCount: 1
    });
  });
});
```

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

**Configure Vitest:**

**File**: `vite.config.js`

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['node_modules/', 'tests/']
    }
  }
});
```

**File**: `tests/setup.js`

```javascript
import '@testing-library/jest-dom';
```

---

## Component Examples

### TransactionForm Component (P1)

**File**: `src/features/transactions/components/TransactionForm/TransactionForm.jsx`

```javascript
import React, { useState } from 'react';
import { useTransactions } from '../../../../shared/contexts/TransactionContext';
import { getCategoriesByType } from '../../../../shared/constants/categories';
import { validationService } from '../../../../shared/utils/validationUtils';
import './TransactionForm.css';

export default function TransactionForm({ onSuccess }) {
  const { addTransaction } = useTransactions();
  const [formData, setFormData] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    type: 'expense',
    categoryId: '',
    description: ''
  });
  const [errors, setErrors] = useState({});

  const categories = getCategoriesByType(formData.type);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate
    const validationResult = validationService.validateTransactionObject({
      ...formData,
      amount: parseFloat(formData.amount)
    });

    if (!validationResult.isValid) {
      const errorMap = {};
      validationResult.errors.forEach(err => {
        errorMap[err.field] = err.message;
      });
      setErrors(errorMap);
      return;
    }

    // Submit
    try {
      addTransaction({
        amount: parseFloat(formData.amount),
        date: formData.date,
        type: formData.type,
        categoryId: formData.categoryId,
        description: formData.description
      });

      // Reset form
      setFormData({
        amount: '',
        date: new Date().toISOString().split('T')[0],
        type: 'expense',
        categoryId: '',
        description: ''
      });
      setErrors({});
      
      if (onSuccess) onSuccess();
    } catch (error) {
      setErrors({ submit: error.message });
    }
  };

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      <h2>Add Transaction</h2>
      
      <div className="form-group">
        <label htmlFor="type">Type</label>
        <select
          id="type"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value, categoryId: '' })}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="amount">Amount</label>
        <input
          id="amount"
          type="number"
          step="0.01"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          placeholder="0.00"
        />
        {errors.amount && <span className="error">{errors.amount}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="date">Date</label>
        <input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        />
        {errors.date && <span className="error">{errors.date}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          value={formData.categoryId}
          onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
        >
          <option value="">Select category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.icon} {cat.name}
            </option>
          ))}
        </select>
        {errors.categoryId && <span className="error">{errors.categoryId}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description (optional)</label>
        <input
          id="description"
          type="text"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="What was this for?"
          maxLength="200"
        />
        {errors.description && <span className="error">{errors.description}</span>}
      </div>

      {errors.submit && <div className="error">{errors.submit}</div>}

      <button type="submit" className="btn-primary">Add Transaction</button>
    </form>
  );
}
```

---

## Configuration Files

### Package.json Scripts

Add these scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage"
  }
}
```

### ESLint (Optional but Recommended)

```bash
npm install --save-dev eslint eslint-plugin-react eslint-plugin-react-hooks
```

**File**: `.eslintrc.json`

```json
{
  "extends": ["eslint:recommended", "plugin:react/recommended", "plugin:react-hooks/recommended"],
  "parserOptions": {
    "ecmaVersion": 2022,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "rules": {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off"
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}
```

---

## Common Tasks

### Add a New Transaction

```javascript
import { useTransactions } from './shared/contexts/TransactionContext';

function MyComponent() {
  const { addTransaction } = useTransactions();

  const handleAdd = () => {
    addTransaction({
      amount: 50.00,
      date: '2026-01-30',
      type: 'expense',
      categoryId: 'food',
      description: 'Lunch'
    });
  };

  return <button onClick={handleAdd}>Add Transaction</button>;
}
```

### Filter Transactions

```javascript
import { useTransactions } from './shared/contexts/TransactionContext';
import { filterService } from './features/filters/services/filterService';

function MyComponent() {
  const { transactions } = useTransactions();

  const expenseOnly = filterService.filterByType(transactions, 'expense');
  const foodExpenses = filterService.filterByCategory(expenseOnly, 'food');

  return <div>{/* render filtered transactions */}</div>;
}
```

### Calculate Dashboard Summary

```javascript
import { useTransactions } from './shared/contexts/TransactionContext';
import { calculationService } from './features/dashboard/services/calculationService';

function Dashboard() {
  const { transactions } = useTransactions();

  const summary = calculationService.calculateDashboardSummary(transactions, {
    type: 'month',
    anchorDate: new Date().toISOString().split('T')[0]
  });

  return (
    <div>
      <h2>This Month</h2>
      <p>Income: ${summary.totalIncome}</p>
      <p>Expenses: ${summary.totalExpenses}</p>
      <p>Balance: ${summary.netBalance}</p>
    </div>
  );
}
```

### Export to CSV

```javascript
import { useTransactions } from './shared/contexts/TransactionContext';
import { exportService } from './features/export/services/exportService';

function ExportButton() {
  const { transactions } = useTransactions();

  const handleExport = () => {
    exportService.downloadCSV(transactions);
  };

  return <button onClick={handleExport}>Export CSV</button>;
}
```

---

## Debugging Tips

### View localStorage Data

Open browser DevTools → Application → Local Storage → `http://localhost:5173`

Look for key: `expense-tracker-transactions`

### Clear All Data

```javascript
localStorage.removeItem('expense-tracker-transactions');
```

Or from DevTools: Right-click → Delete

### Console Logging

Add to service methods:
```javascript
export function createTransaction(data) {
  console.log('Creating transaction:', data);
  // ... implementation
}
```

### React DevTools

Install React DevTools extension to inspect:
- Component tree
- Props and state
- Context values

---

## Performance Optimization

### Use React.memo for Expensive Components

```javascript
import React, { memo } from 'react';

const TransactionList = memo(function TransactionList({ transactions }) {
  // Component implementation
});
```

### Memoize Filtered/Sorted Data

```javascript
import { useMemo } from 'react';

function TransactionList() {
  const { transactions } = useTransactions();
  const [filters, setFilters] = useState({});

  const filteredTransactions = useMemo(() => {
    return filterService.applyFilters(transactions, filters);
  }, [transactions, filters]);

  return <div>{/* render filteredTransactions */}</div>;
}
```

---

## Troubleshooting

**Issue**: Tests fail with "localStorage is not defined"

**Solution**: Ensure `vitest.config.js` has `environment: 'jsdom'`

---

**Issue**: Transactions not persisting

**Solution**: Check browser console for storage errors. Verify localStorage is enabled.

---

**Issue**: Category not found

**Solution**: Ensure categoryId exists in DEFAULT_CATEGORIES. Check for typos.

---

## Next Steps

After quick start:
1. ✅ Implement P1: Transaction CRUD (see [data-model.md](./data-model.md))
2. ✅ Write tests for services (see [service-contracts.md](./contracts/service-contracts.md))
3. ✅ Build UI components
4. ⏭️ Deploy P1 and validate
5. ⏭️ Move to P2: Dashboard
6. ⏭️ Move to P3: Filters and Export

Refer to:
- [spec.md](./spec.md) - Feature requirements
- [data-model.md](./data-model.md) - Data structures
- [service-contracts.md](./contracts/service-contracts.md) - Service APIs
- [research.md](./research.md) - Technical decisions
