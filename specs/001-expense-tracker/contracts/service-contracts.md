# Service Contracts: Personal Expense Tracking and Reporting

**Feature**: 001-expense-tracker  
**Date**: January 30, 2026  
**Type**: Frontend Service Layer Interfaces (TypeScript)

---

## Overview

Since this is a frontend-only application, "contracts" refer to the interfaces between UI components and service layer modules. These contracts define the API that services expose for data operations, calculations, filtering, and export.

All services are synchronous (localStorage is synchronous) and return data directly or throw errors.

---

## 1. Transaction Service Contract

**Module**: `src/services/transactionService.js`  
**Purpose**: CRUD operations for transactions

### Interface

```typescript
interface TransactionService {
  /**
   * Retrieve all transactions from storage
   * @returns Array of all transactions, sorted by date descending
   * @throws Error if storage is corrupted
   */
  getAllTransactions(): Transaction[];

  /**
   * Retrieve a single transaction by ID
   * @param id - Transaction UUID
   * @returns Transaction object or null if not found
   */
  getTransactionById(id: string): Transaction | null;

  /**
   * Create a new transaction
   * @param transactionData - Partial transaction (id, createdAt, updatedAt auto-generated)
   * @returns The created transaction with generated fields
   * @throws ValidationError if data is invalid
   * @throws StorageError if save fails
   */
  createTransaction(transactionData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Transaction;

  /**
   * Update an existing transaction
   * @param id - Transaction UUID to update
   * @param updates - Fields to update (partial)
   * @returns Updated transaction
   * @throws ValidationError if updates are invalid
   * @throws NotFoundError if transaction doesn't exist
   * @throws StorageError if save fails
   */
  updateTransaction(id: string, updates: Partial<Omit<Transaction, 'id' | 'createdAt'>>): Transaction;

  /**
   * Delete a transaction
   * @param id - Transaction UUID to delete
   * @returns true if deleted, false if not found
   * @throws StorageError if delete fails
   */
  deleteTransaction(id: string): boolean;

  /**
   * Validate transaction data
   * @param transaction - Transaction data to validate
   * @returns ValidationResult with errors (if any)
   */
  validateTransaction(transaction: Partial<Transaction>): ValidationResult;
}
```

### Types

```typescript
interface Transaction {
  id: string;
  amount: number;
  date: string;  // YYYY-MM-DD
  type: 'income' | 'expense';
  categoryId: string;
  description: string;
  createdAt: string;  // ISO 8601
  updatedAt: string;  // ISO 8601
}

interface ValidationResult {
  isValid: boolean;
  errors: {
    field: string;
    message: string;
  }[];
}

class ValidationError extends Error {
  constructor(public errors: ValidationResult['errors']) {
    super('Validation failed');
    this.name = 'ValidationError';
  }
}

class StorageError extends Error {
  constructor(message: string, public cause?: Error) {
    super(message);
    this.name = 'StorageError';
  }
}

class NotFoundError extends Error {
  constructor(public id: string) {
    super(`Transaction not found: ${id}`);
    this.name = 'NotFoundError';
  }
}
```

### Example Usage

```javascript
// Create transaction
try {
  const newTransaction = transactionService.createTransaction({
    amount: 50.00,
    date: '2026-01-30',
    type: 'expense',
    categoryId: 'food',
    description: 'Lunch'
  });
  console.log('Created:', newTransaction.id);
} catch (error) {
  if (error instanceof ValidationError) {
    error.errors.forEach(e => console.error(`${e.field}: ${e.message}`));
  }
}

// Update transaction
transactionService.updateTransaction('some-id', {
  amount: 55.00,
  description: 'Lunch with dessert'
});

// Delete transaction
transactionService.deleteTransaction('some-id');
```

---

## 2. Category Service Contract

**Module**: `src/services/categoryService.js`  
**Purpose**: Retrieve and manage categories

### Interface

```typescript
interface CategoryService {
  /**
   * Get all categories for a specific type
   * @param type - 'income', 'expense', or 'all'
   * @returns Array of categories
   */
  getCategories(type: 'income' | 'expense' | 'all'): Category[];

  /**
   * Get a single category by ID
   * @param id - Category ID
   * @returns Category object or null if not found
   */
  getCategoryById(id: string): Category | null;

  /**
   * Get category display name
   * @param id - Category ID
   * @returns Category name or "(Unknown Category)" if not found
   */
  getCategoryName(id: string): string;

  /**
   * Check if a category ID exists
   * @param id - Category ID
   * @returns true if exists
   */
  categoryExists(id: string): boolean;
}
```

### Types

```typescript
interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  icon: string;
  isDefault: boolean;
}
```

### Example Usage

```javascript
// Get all expense categories
const expenseCategories = categoryService.getCategories('expense');

// Get category details
const category = categoryService.getCategoryById('food');
console.log(category.name, category.icon);  // "Food & Dining 🍔"

// Get display name (handles missing categories)
const name = categoryService.getCategoryName('deleted-category');  // "(Unknown Category)"
```

---

## 3. Calculation Service Contract

**Module**: `src/services/calculationService.js`  
**Purpose**: Financial calculations and aggregations

### Interface

```typescript
interface CalculationService {
  /**
   * Calculate total income for given transactions
   * @param transactions - Array of transactions
   * @returns Total income amount
   */
  calculateTotalIncome(transactions: Transaction[]): number;

  /**
   * Calculate total expenses for given transactions
   * @param transactions - Array of transactions
   * @returns Total expenses amount
   */
  calculateTotalExpenses(transactions: Transaction[]): number;

  /**
   * Calculate net balance (income - expenses)
   * @param transactions - Array of transactions
   * @returns Net balance
   */
  calculateNetBalance(transactions: Transaction[]): number;

  /**
   * Group transactions by category and calculate totals
   * @param transactions - Array of transactions
   * @param type - 'income', 'expense', or 'all'
   * @returns Array of category breakdowns, sorted by amount descending
   */
  calculateCategoryBreakdown(transactions: Transaction[], type: 'income' | 'expense' | 'all'): CategoryBreakdown[];

  /**
   * Calculate dashboard summary for a time period
   * @param transactions - All transactions
   * @param period - Time period specification
   * @returns Complete dashboard summary
   */
  calculateDashboardSummary(transactions: Transaction[], period: TimePeriod): DashboardSummary;

  /**
   * Get date range for a time period
   * @param type - 'day', 'week', or 'month'
   * @param anchorDate - Reference date (ISO string or Date)
   * @returns Start and end dates for the period
   */
  getDateRangeForPeriod(type: 'day' | 'week' | 'month', anchorDate: string | Date): DateRange;
}
```

### Types

```typescript
interface CategoryBreakdown {
  categoryId: string;
  categoryName: string;
  amount: number;
  percentage: number;
  transactionCount: number;
}

interface TimePeriod {
  type: 'day' | 'week' | 'month';
  anchorDate: string;  // YYYY-MM-DD
}

interface DateRange {
  start: string;  // YYYY-MM-DD
  end: string;    // YYYY-MM-DD
}

interface DashboardSummary {
  period: {
    start: string;
    end: string;
    type: 'day' | 'week' | 'month';
  };
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  categoryBreakdown: CategoryBreakdown[];
  transactionCount: {
    income: number;
    expense: number;
    total: number;
  };
}
```

### Example Usage

```javascript
// Calculate totals
const income = calculationService.calculateTotalIncome(transactions);
const expenses = calculationService.calculateTotalExpenses(transactions);
const balance = calculationService.calculateNetBalance(transactions);

// Category breakdown
const breakdown = calculationService.calculateCategoryBreakdown(transactions, 'expense');
breakdown.forEach(cat => {
  console.log(`${cat.categoryName}: $${cat.amount} (${cat.percentage}%)`);
});

// Dashboard summary for current month
const summary = calculationService.calculateDashboardSummary(transactions, {
  type: 'month',
  anchorDate: '2026-01-30'
});
```

---

## 4. Filter Service Contract

**Module**: `src/services/filterService.js`  
**Purpose**: Search and filter transaction lists

### Interface

```typescript
interface FilterService {
  /**
   * Apply filters to transaction list
   * @param transactions - Array of all transactions
   * @param filters - Filter criteria
   * @returns Filtered transaction array
   */
  applyFilters(transactions: Transaction[], filters: FilterCriteria): Transaction[];

  /**
   * Search transactions by description text
   * @param transactions - Array of transactions
   * @param searchText - Search query (case-insensitive)
   * @returns Matching transactions
   */
  searchTransactions(transactions: Transaction[], searchText: string): Transaction[];

  /**
   * Filter transactions by type
   * @param transactions - Array of transactions
   * @param type - 'income', 'expense', or 'all'
   * @returns Filtered transactions
   */
  filterByType(transactions: Transaction[], type: 'income' | 'expense' | 'all'): Transaction[];

  /**
   * Filter transactions by category
   * @param transactions - Array of transactions
   * @param categoryId - Category ID (null for all)
   * @returns Filtered transactions
   */
  filterByCategory(transactions: Transaction[], categoryId: string | null): Transaction[];

  /**
   * Filter transactions by date range
   * @param transactions - Array of transactions
   * @param dateRange - Start and end dates (null for no filter)
   * @returns Filtered transactions
   */
  filterByDateRange(transactions: Transaction[], dateRange: DateRange | null): Transaction[];

  /**
   * Sort transactions
   * @param transactions - Array of transactions
   * @param sortBy - Field to sort by
   * @param order - 'asc' or 'desc'
   * @returns Sorted transaction array
   */
  sortTransactions(
    transactions: Transaction[], 
    sortBy: 'date' | 'amount' | 'category',
    order: 'asc' | 'desc'
  ): Transaction[];
}
```

### Types

```typescript
interface FilterCriteria {
  searchText?: string;
  type?: 'income' | 'expense' | 'all';
  categoryId?: string | null;
  dateRange?: DateRange | null;
  sortBy?: 'date' | 'amount' | 'category';
  sortOrder?: 'asc' | 'desc';
}
```

### Example Usage

```javascript
// Apply multiple filters
const filtered = filterService.applyFilters(transactions, {
  searchText: 'lunch',
  type: 'expense',
  categoryId: 'food',
  dateRange: { start: '2026-01-01', end: '2026-01-31' },
  sortBy: 'date',
  sortOrder: 'desc'
});

// Individual filters
const expenseOnly = filterService.filterByType(transactions, 'expense');
const foodTransactions = filterService.filterByCategory(transactions, 'food');
const januaryTransactions = filterService.filterByDateRange(transactions, {
  start: '2026-01-01',
  end: '2026-01-31'
});
```

---

## 5. Export Service Contract

**Module**: `src/services/exportService.js`  
**Purpose**: Export data to CSV format

### Interface

```typescript
interface ExportService {
  /**
   * Export transactions to CSV format
   * @param transactions - Array of transactions to export
   * @param includeHeaders - Whether to include column headers (default: true)
   * @returns CSV string
   */
  exportToCSV(transactions: Transaction[], includeHeaders?: boolean): string;

  /**
   * Download transactions as CSV file
   * @param transactions - Array of transactions to export
   * @param filename - Optional custom filename (default: "expense-tracker-TIMESTAMP.csv")
   */
  downloadCSV(transactions: Transaction[], filename?: string): void;

  /**
   * Escape a value for CSV format
   * @param value - Value to escape
   * @returns CSV-safe string
   */
  escapeCSVValue(value: string | number | null | undefined): string;

  /**
   * Generate a default filename with timestamp
   * @returns Filename string (e.g., "expense-tracker-20260130-120000.csv")
   */
  generateFilename(): string;
}
```

### CSV Format Specification

```
Column Order: Date, Amount, Type, Category, Description
Date Format: YYYY-MM-DD
Amount Format: Decimal with 2 places (e.g., 45.50)
Type: "income" or "expense" (lowercase)
Category: Display name (not ID)
Description: Escaped for CSV
```

### Example Usage

```javascript
// Export to CSV string
const csvContent = exportService.exportToCSV(transactions);
console.log(csvContent);
// Output:
// Date,Amount,Type,Category,Description
// 2026-01-30,45.50,expense,Food & Dining,Lunch with team

// Download CSV file
exportService.downloadCSV(filteredTransactions, 'january-expenses.csv');

// Custom export without headers
const csvData = exportService.exportToCSV(transactions, false);
```

---

## 6. Storage Service Contract

**Module**: `src/utils/storageUtils.js`  
**Purpose**: localStorage wrapper with error handling

### Interface

```typescript
interface StorageService {
  /**
   * Save data to localStorage
   * @param key - Storage key
   * @param data - Data to store (will be JSON.stringify'd)
   * @throws StorageError if save fails
   */
  save<T>(key: string, data: T): void;

  /**
   * Load data from localStorage
   * @param key - Storage key
   * @param defaultValue - Value to return if key doesn't exist
   * @returns Parsed data or defaultValue
   * @throws StorageError if parsing fails
   */
  load<T>(key: string, defaultValue: T): T;

  /**
   * Remove data from localStorage
   * @param key - Storage key
   */
  remove(key: string): void;

  /**
   * Check if a key exists
   * @param key - Storage key
   * @returns true if exists
   */
  exists(key: string): boolean;

  /**
   * Get storage size estimate in bytes
   * @param key - Storage key
   * @returns Size in bytes
   */
  getSize(key: string): number;

  /**
   * Backup data with timestamp
   * @param key - Storage key to backup
   * @returns Backup key name
   */
  backup(key: string): string;
}
```

### Example Usage

```javascript
// Save transactions
storageService.save('expense-tracker-transactions', transactions);

// Load transactions with default
const transactions = storageService.load('expense-tracker-transactions', []);

// Check if data exists
if (storageService.exists('expense-tracker-transactions')) {
  console.log('Data found');
}

// Backup before risky operation
const backupKey = storageService.backup('expense-tracker-transactions');
console.log('Backed up to:', backupKey);  // "expense-tracker-transactions-backup-1706616000000"
```

---

## 7. Validation Service Contract

**Module**: `src/utils/validationUtils.js`  
**Purpose**: Input validation helpers

### Interface

```typescript
interface ValidationService {
  /**
   * Validate amount field
   * @param amount - Amount to validate
   * @returns Error message or null if valid
   */
  validateAmount(amount: number | string): string | null;

  /**
   * Validate date field
   * @param date - Date string to validate (YYYY-MM-DD)
   * @returns Error message or null if valid
   */
  validateDate(date: string): string | null;

  /**
   * Validate transaction type
   * @param type - Type to validate
   * @returns Error message or null if valid
   */
  validateType(type: string): string | null;

  /**
   * Validate category ID
   * @param categoryId - Category ID to validate
   * @returns Error message or null if valid
   */
  validateCategoryId(categoryId: string): string | null;

  /**
   * Validate description field
   * @param description - Description to validate
   * @returns Error message or null if valid
   */
  validateDescription(description: string): string | null;

  /**
   * Validate entire transaction object
   * @param transaction - Transaction to validate
   * @returns ValidationResult with all errors
   */
  validateTransactionObject(transaction: Partial<Transaction>): ValidationResult;
}
```

### Validation Rules

```typescript
const VALIDATION_RULES = {
  amount: {
    required: true,
    min: 0.01,
    max: 999999999.99,
    decimals: 2
  },
  date: {
    required: true,
    format: /^\d{4}-\d{2}-\d{2}$/,
    minYear: 1900,
    maxYear: 2100
  },
  type: {
    required: true,
    allowedValues: ['income', 'expense']
  },
  categoryId: {
    required: true,
    mustExist: true
  },
  description: {
    required: false,
    maxLength: 200
  }
};
```

### Example Usage

```javascript
// Validate individual fields
const amountError = validationService.validateAmount(50.123);  // "Amount must have max 2 decimal places"
const dateError = validationService.validateDate('2026-13-01');  // "Invalid date"

// Validate entire transaction
const result = validationService.validateTransactionObject({
  amount: -10,
  date: 'invalid',
  type: 'purchase',
  categoryId: 'nonexistent',
  description: 'a'.repeat(300)
});

if (!result.isValid) {
  result.errors.forEach(error => {
    console.error(`${error.field}: ${error.message}`);
  });
}
```

---

## Contract Testing

Each service contract MUST have corresponding unit tests that verify:

1. **Happy path**: All methods work with valid inputs
2. **Error handling**: Invalid inputs throw appropriate errors
3. **Edge cases**: Boundary values, empty arrays, null values
4. **Data integrity**: Operations don't corrupt data

### Test Coverage Requirements

- **transactionService**: 80%+ coverage (critical path)
- **calculationService**: 90%+ coverage (financial accuracy critical)
- **filterService**: 80%+ coverage (complex logic)
- **exportService**: 80%+ coverage (data accuracy critical)
- **validationService**: 90%+ coverage (guards data integrity)
- **storageService**: 70%+ coverage (thin wrapper, but critical)

---

## Contract Evolution

When modifying contracts:

1. **Add optional parameters** (non-breaking)
2. **Add new methods** (non-breaking)
3. **Change return types** (breaking - requires migration)
4. **Remove methods** (breaking - requires migration)

For breaking changes:
1. Create new contract version (e.g., `TransactionServiceV2`)
2. Keep old contract for one release cycle
3. Update all consumers
4. Deprecate old contract

---

## Summary

All service contracts are designed to:
- ✅ Support constitution principles (data integrity, testability)
- ✅ Provide clear error handling
- ✅ Enable easy testing
- ✅ Support progressive enhancement (simple now, extensible later)
- ✅ Maintain type safety (TypeScript-ready)
