# Data Model: Personal Expense Tracking and Reporting

**Feature**: 001-expense-tracker  
**Date**: January 30, 2026  
**Storage**: localStorage (JSON serialization)

---

## Overview

The application manages three primary entities: **Transactions**, **Categories**, and **Filter State**. All data is stored in localStorage as JSON-serialized arrays/objects. No backend database required for MVP.

---

## 1. Transaction Entity

**Purpose**: Represents a single financial activity (income or expense)

### Schema

```typescript
interface Transaction {
  id: string;              // UUID v4, generated on creation
  amount: number;          // Positive decimal (max 2 decimal places)
  date: string;            // ISO 8601 date string (YYYY-MM-DD)
  type: 'income' | 'expense';  // Transaction type
  categoryId: string;      // References Category.id
  description: string;     // Optional user note (max 200 chars)
  createdAt: string;       // ISO 8601 timestamp (YYYY-MM-DDTHH:mm:ssZ)
  updatedAt: string;       // ISO 8601 timestamp (YYYY-MM-DDTHH:mm:ssZ)
}
```

### Example

```json
{
  "id": "a3f8d9c2-1234-5678-9abc-def012345678",
  "amount": 45.50,
  "date": "2026-01-30",
  "type": "expense",
  "categoryId": "food",
  "description": "Lunch with team",
  "createdAt": "2026-01-30T12:15:00Z",
  "updatedAt": "2026-01-30T12:15:00Z"
}
```

### Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| id | Required, UUID format | "Invalid transaction ID" |
| amount | Required, positive number, max 2 decimals | "Amount must be a positive number" |
| date | Required, valid date, between 1900-2100 | "Please enter a valid date" |
| type | Required, must be 'income' or 'expense' | "Transaction type must be income or expense" |
| categoryId | Required, must exist in categories | "Please select a valid category" |
| description | Optional, max 200 chars | "Description too long (max 200 characters)" |
| createdAt | Auto-generated, ISO 8601 timestamp | N/A |
| updatedAt | Auto-updated on edit, ISO 8601 timestamp | N/A |

### Storage Key

- **Key**: `expense-tracker-transactions`
- **Format**: `JSON.stringify(Transaction[])`
- **Size Estimate**: ~250 bytes per transaction, ~2.5MB for 10K transactions

### Relationships

- **Many-to-One with Category**: Each transaction references exactly one category via `categoryId`

---

## 2. Category Entity

**Purpose**: Classification for grouping transactions

### Schema

```typescript
interface Category {
  id: string;              // Unique identifier (kebab-case)
  name: string;            // Display name
  type: 'income' | 'expense';  // Category applies to which transaction type
  icon: string;            // Emoji icon for visual identification
  isDefault: boolean;      // True for system defaults, false for user-created
  createdAt: string;       // ISO 8601 timestamp (only for user-created)
}
```

### Default Categories

**Expense Categories:**
```json
[
  { "id": "food", "name": "Food & Dining", "type": "expense", "icon": "🍔", "isDefault": true },
  { "id": "transport", "name": "Transportation", "type": "expense", "icon": "🚗", "isDefault": true },
  { "id": "entertainment", "name": "Entertainment", "type": "expense", "icon": "🎬", "isDefault": true },
  { "id": "utilities", "name": "Utilities", "type": "expense", "icon": "⚡", "isDefault": true },
  { "id": "shopping", "name": "Shopping", "type": "expense", "icon": "🛍️", "isDefault": true },
  { "id": "healthcare", "name": "Healthcare", "type": "expense", "icon": "🏥", "isDefault": true },
  { "id": "education", "name": "Education", "type": "expense", "icon": "📚", "isDefault": true },
  { "id": "personal", "name": "Personal Care", "type": "expense", "icon": "💇", "isDefault": true },
  { "id": "housing", "name": "Housing", "type": "expense", "icon": "🏠", "isDefault": true },
  { "id": "other-expense", "name": "Other", "type": "expense", "icon": "📦", "isDefault": true }
]
```

**Income Categories:**
```json
[
  { "id": "salary", "name": "Salary", "type": "income", "icon": "💼", "isDefault": true },
  { "id": "freelance", "name": "Freelance", "type": "income", "icon": "💻", "isDefault": true },
  { "id": "investment", "name": "Investment", "type": "income", "icon": "📈", "isDefault": true },
  { "id": "gift", "name": "Gift", "type": "income", "icon": "🎁", "isDefault": true },
  { "id": "bonus", "name": "Bonus", "type": "income", "icon": "💰", "isDefault": true },
  { "id": "other-income", "name": "Other", "type": "income", "icon": "💵", "isDefault": true }
]
```

### Storage Strategy

- **Default categories**: Defined in `src/constants/categories.js`, not stored in localStorage
- **User categories** (future): Stored in `expense-tracker-custom-categories` localStorage key
- **Deletion strategy**: Default categories cannot be deleted. If custom category is deleted, existing transactions keep the categoryId but show as "(Deleted Category)"

### Relationships

- **One-to-Many with Transaction**: One category can be referenced by many transactions

---

## 3. Filter State (UI State)

**Purpose**: Represents active filters for transaction list and dashboard

### Schema

```typescript
interface FilterState {
  searchText: string;          // Text search in description (case-insensitive)
  selectedType: 'all' | 'income' | 'expense';  // Filter by transaction type
  selectedCategory: string | null;  // Filter by category ID (null = all)
  dateRange: {
    start: string;             // ISO 8601 date (YYYY-MM-DD)
    end: string;               // ISO 8601 date (YYYY-MM-DD)
  } | null;                    // null = no date filter
  timePeriod: 'day' | 'week' | 'month';  // For dashboard time grouping
  selectedDate: string;        // ISO 8601 date - anchor for time period
}
```

### Default Values

```json
{
  "searchText": "",
  "selectedType": "all",
  "selectedCategory": null,
  "dateRange": null,
  "timePeriod": "month",
  "selectedDate": "2026-01-30"  // Current date
}
```

### Storage

- **Storage**: React state (Context API), not persisted to localStorage
- **Rationale**: Filters are session-specific. Persisting them adds complexity without clear user value.

### Filter Logic

Transactions are filtered using AND logic:
```javascript
transaction.description.includes(searchText) 
  AND (selectedType === 'all' OR transaction.type === selectedType)
  AND (selectedCategory === null OR transaction.categoryId === selectedCategory)
  AND (dateRange === null OR (transaction.date >= dateRange.start AND transaction.date <= dateRange.end))
```

---

## 4. Dashboard Summary (Computed)

**Purpose**: Aggregated financial data for selected time period

### Schema

```typescript
interface DashboardSummary {
  period: {
    start: string;             // ISO 8601 date
    end: string;               // ISO 8601 date
    type: 'day' | 'week' | 'month';
  };
  totalIncome: number;         // Sum of all income transactions in period
  totalExpenses: number;       // Sum of all expense transactions in period
  netBalance: number;          // totalIncome - totalExpenses
  categoryBreakdown: CategoryBreakdown[];  // Spending by category
  transactionCount: {
    income: number;
    expense: number;
    total: number;
  };
}

interface CategoryBreakdown {
  categoryId: string;
  categoryName: string;
  amount: number;              // Total spent/earned in this category
  percentage: number;          // Percentage of total expenses/income
  transactionCount: number;    // Number of transactions in category
}
```

### Calculation Logic

**Time Period Ranges:**
- **Day**: Selected date (midnight to 23:59:59)
- **Week**: 7 days starting from selected date (or start of week)
- **Month**: Calendar month of selected date (1st to last day)

**Aggregation:**
```javascript
// Pseudo-code
const transactionsInPeriod = filterByDateRange(transactions, period);
const totalIncome = sum(transactionsInPeriod.filter(t => t.type === 'income').map(t => t.amount));
const totalExpenses = sum(transactionsInPeriod.filter(t => t.type === 'expense').map(t => t.amount));
const netBalance = totalIncome - totalExpenses;

const categoryBreakdown = groupBy(transactionsInPeriod, 'categoryId')
  .map(group => ({
    categoryId: group.categoryId,
    categoryName: getCategory(group.categoryId).name,
    amount: sum(group.transactions.map(t => t.amount)),
    percentage: (sum(group.amount) / totalExpenses) * 100,
    transactionCount: group.transactions.length
  }))
  .sort((a, b) => b.amount - a.amount);  // Sort by amount descending
```

### Storage

- **Storage**: Not persisted. Calculated on-demand in React components
- **Performance**: O(n) aggregation on filtered transaction list, memoized with React.useMemo

---

## 5. CSV Export Format

**Purpose**: Portable data format for external analysis

### Structure

```csv
Date,Amount,Type,Category,Description
2026-01-30,45.50,expense,Food & Dining,Lunch with team
2026-01-29,3000.00,income,Salary,Monthly salary
2026-01-28,120.00,expense,Transportation,Uber rides
```

### Rules

- **Headers**: Always include `Date,Amount,Type,Category,Description`
- **Date format**: YYYY-MM-DD
- **Amount format**: Decimal number (2 decimal places)
- **Type**: "income" or "expense" (lowercase)
- **Category**: Display name (not ID)
- **Description**: Escaped for CSV (commas wrapped in quotes, quotes doubled)

### CSV Escaping

```javascript
function escapeCSV(value) {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      localStorage                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ expense-tracker-transactions: Transaction[]          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                         ▲           │
                         │ persist   │ load
                         │           ▼
┌─────────────────────────────────────────────────────────────┐
│                  TransactionContext (React)                  │
│  • transactions: Transaction[]                              │
│  • categories: Category[] (from constants)                  │
│  • addTransaction(transaction)                              │
│  • updateTransaction(id, updates)                           │
│  • deleteTransaction(id)                                    │
└─────────────────────────────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
┌──────────────┐  ┌─────────────┐  ┌───────────────┐
│ Transaction  │  │  Dashboard  │  │  FilterBar    │
│    List      │  │  (P2)       │  │  (P3)         │
│    (P1)      │  │             │  │               │
│              │  │  Calculate: │  │  Apply        │
│  Display all │  │  • Income   │  │  filters to   │
│  transactions│  │  • Expenses │  │  transaction  │
│              │  │  • Balance  │  │  list         │
└──────────────┘  └─────────────┘  └───────────────┘
                         │
                         ▼
                  ┌─────────────┐
                  │ CSV Export  │
                  │   (P3)      │
                  │             │
                  │  Download   │
                  │  .csv file  │
                  └─────────────┘
```

---

## Migration & Versioning

### Data Schema Versioning

To support future data model changes without breaking existing users:

```json
{
  "schemaVersion": 1,
  "transactions": [...],
  "lastModified": "2026-01-30T12:00:00Z"
}
```

### Migration Strategy (Future)

1. Check `schemaVersion` on app load
2. If version < current, run migration functions
3. Update `schemaVersion` after successful migration
4. Backup old data before migration

**Example Migration:**
```javascript
function migrateV1toV2(data) {
  // V2 adds 'tags' array to transactions
  return data.transactions.map(t => ({
    ...t,
    tags: []  // Add default tags array
  }));
}
```

**For MVP**: Schema version 1, no migration logic needed

---

## Data Integrity Checks

### On Load (Application Startup)

1. Validate localStorage data is valid JSON
2. Check all transactions have required fields
3. Remove invalid transactions (log to console)
4. Ensure categoryId references exist (replace with 'other' if missing)

### On Save (Transaction Create/Update)

1. Validate all fields per validation rules
2. Sanitize description (trim, limit 200 chars)
3. Ensure amount has max 2 decimal places
4. Generate/update timestamps
5. Write to localStorage with error handling

### Error Recovery

```javascript
function safeLoadTransactions() {
  try {
    const data = localStorage.getItem('expense-tracker-transactions');
    if (!data) return [];
    
    const parsed = JSON.parse(data);
    return parsed.filter(t => isValidTransaction(t));
  } catch (error) {
    console.error('Failed to load transactions:', error);
    // Backup corrupted data
    const backup = localStorage.getItem('expense-tracker-transactions');
    localStorage.setItem('expense-tracker-backup-' + Date.now(), backup);
    return [];
  }
}
```

---

## Performance Considerations

### Transaction Limit

- **Soft limit**: 10,000 transactions (constitution requirement)
- **localStorage limit**: ~5MB (enough for 20K transactions)
- **Performance target**: Filter/search < 2 seconds at 10K transactions

### Optimization Strategies

1. **Memoization**: Use React.useMemo for filtered/sorted lists
2. **Lazy loading**: Initially render only visible transactions (pagination or virtual scroll)
3. **Indexing** (future): Create date/category indexes for faster filtering
4. **IndexedDB migration**: Move to IndexedDB if approaching localStorage limits

---

## Data Model Summary

| Entity | Storage | Size (10K records) | Critical Path |
|--------|---------|-------------------|---------------|
| Transaction | localStorage | ~2.5MB | Yes (CRUD tested) |
| Category | Code constants | N/A | No (static data) |
| Filter State | React Context | N/A | Yes (tested) |
| Dashboard Summary | Computed | N/A | Yes (calculations tested) |

All entities align with constitution principles:
- ✅ Data integrity through validation
- ✅ Simple localStorage persistence
- ✅ Performance targets met with client-side operations
- ✅ CSV export for data ownership
