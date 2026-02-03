# Research: Personal Expense Tracking and Reporting

**Date**: January 30, 2026  
**Feature**: 001-expense-tracker  
**Purpose**: Research technical decisions and best practices for React-based expense tracking application

---

## 1. React State Management for Financial Data

### Decision: Start with React Hooks (useState + useContext)

**Rationale:**
- Application has moderate state complexity (transactions, categories, filters)
- React hooks (useState, useReducer, useContext) are sufficient for MVP
- Avoids Redux boilerplate and learning curve
- Context API handles global state (transaction list, active filters)
- Easy migration path to Redux/Zustand if state grows complex

**Implementation Pattern:**
```javascript
// TransactionContext provides global state
const TransactionContext = createContext();

// Custom hook for easy access
const useTransactions = () => useContext(TransactionContext);

// Provider wraps app
<TransactionProvider>
  <App />
</TransactionProvider>
```

**Alternatives Considered:**
- **Redux**: Too complex for initial version. Adds significant boilerplate. Reserved for future if state management becomes unwieldy.
- **Zustand**: Simpler than Redux but adds dependency. Context API is built-in and sufficient.
- **Component-level state only**: Insufficient—transaction data needed across Dashboard, List, and Filter components.

---

## 2. Data Persistence Strategy

### Decision: localStorage for MVP, with IndexedDB migration path

**Rationale:**
- localStorage is synchronous, simple API, available in all modern browsers
- 5-10MB storage limit sufficient for 10,000 transactions (~2-3MB as JSON)
- No backend setup required—faster MVP delivery
- Easy to implement backup/export via CSV
- Performance adequate for client-side filtering/searching

**Data Structure:**
```javascript
// localStorage key: 'expense-tracker-transactions'
// Value: JSON.stringify(transactionsArray)
[
  {
    id: "uuid-v4",
    amount: 50.00,
    date: "2026-01-30",
    type: "expense",
    categoryId: "food",
    description: "Grocery shopping",
    createdAt: "2026-01-30T10:30:00Z"
  }
]
```

**Migration Path:**
- If user approaches 10MB limit → migrate to IndexedDB
- If multi-device sync needed → add backend API + authentication
- localStorage provides clear upgrade path without blocking MVP

**Alternatives Considered:**
- **IndexedDB**: More complex API, async operations add complexity. Reserved for future if storage limits hit.
- **Backend API**: Requires server setup, deployment, authentication. Over-engineering for single-user MVP per Progressive Enhancement principle.
- **SessionStorage**: Data lost when tab closes. Violates FR-023 (persist across sessions).

---

## 3. Date Handling Library

### Decision: date-fns (lightweight, tree-shakeable)

**Rationale:**
- Smaller bundle size than Moment.js (~13KB vs ~230KB)
- Modern, functional API with immutability
- Tree-shakeable—only import functions you use
- Good TypeScript support
- Active maintenance

**Use Cases:**
- Format dates for display: `format(date, 'MMM dd, yyyy')`
- Calculate week/month ranges: `startOfWeek()`, `endOfMonth()`
- Compare dates for filtering: `isWithinInterval()`
- Parse user input: `parseISO()`, `isValid()`

**Alternatives Considered:**
- **Day.js**: Smaller (2KB), but less comprehensive API. May require plugins.
- **Moment.js**: Heavy, deprecated, not recommended for new projects.
- **Native Date**: Complex API, timezone issues, poor formatting options.

---

## 4. CSV Export Implementation

### Decision: Client-side CSV generation with Browser Download API

**Rationale:**
- No server required—pure JavaScript CSV generation
- Fast (<3s for 1K transactions)
- Works offline
- User controls data—no server upload

**Implementation:**
```javascript
// Convert transactions to CSV string
const generateCSV = (transactions) => {
  const headers = ['Date', 'Amount', 'Type', 'Category', 'Description'];
  const rows = transactions.map(t => [
    t.date, t.amount, t.type, t.categoryId, t.description
  ]);
  
  return [headers, ...rows]
    .map(row => row.map(escapeCSV).join(','))
    .join('\n');
};

// Trigger download
const blob = new Blob([csvContent], { type: 'text/csv' });
const url = URL.createObjectURL(blob);
const link = document.createElement('a');
link.href = url;
link.download = `expense-tracker-${Date.now()}.csv`;
link.click();
```

**Alternatives Considered:**
- **Papa Parse library**: Adds 50KB dependency. Native implementation is simple enough.
- **Server-side generation**: Requires backend. Unnecessary for client-side app.

---

## 5. Form Validation Strategy

### Decision: Controlled components with immediate validation

**Rationale:**
- React-friendly (controlled inputs with state)
- Immediate feedback improves UX
- Prevents invalid data entry before submission
- No external validation library needed for simple rules

**Validation Rules:**
- **Amount**: Positive number, max 2 decimal places, required
- **Date**: Valid date format, not too far in past/future (1900-2100)
- **Type**: Must be "income" or "expense"
- **Category**: Must select from available categories
- **Description**: Optional, max 200 characters

**Implementation Pattern:**
```javascript
const [errors, setErrors] = useState({});

const validateAmount = (value) => {
  if (!value || value <= 0) return "Amount must be positive";
  if (!/^\d+(\.\d{1,2})?$/.test(value)) return "Invalid amount format";
  return null;
};

// Validate on blur
<input 
  value={amount}
  onChange={e => setAmount(e.target.value)}
  onBlur={() => setErrors({...errors, amount: validateAmount(amount)})}
/>
```

**Alternatives Considered:**
- **Formik/React Hook Form**: Over-engineering for simple forms with 4-5 fields.
- **No validation**: Violates data integrity principle. Users can enter invalid data.

---

## 6. Filtering and Search Performance

### Decision: In-memory filtering with React.useMemo for optimization

**Rationale:**
- 10K transactions = ~2-3MB in memory (manageable)
- Array.filter() with multiple predicates is fast for <100K items
- useMemo prevents re-filtering on unrelated renders
- Text search uses toLowerCase() for case-insensitive matching

**Performance Characteristics:**
- Filter by category/type: O(n) single pass
- Date range filter: O(n) with date comparison
- Text search: O(n) with string.includes()
- Combined filters: Single O(n) pass with all predicates
- Expected time for 10K items: 5-20ms on modern hardware

**Optimization Techniques:**
```javascript
const filteredTransactions = useMemo(() => {
  return transactions.filter(t => {
    // Early returns for performance
    if (filters.type && t.type !== filters.type) return false;
    if (filters.category && t.categoryId !== filters.category) return false;
    if (filters.dateRange && !isWithinInterval(t.date, filters.dateRange)) return false;
    if (filters.search && !t.description.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });
}, [transactions, filters]);
```

**Alternatives Considered:**
- **Virtual scrolling**: Premature optimization. Only needed if rendering lags with 10K DOM nodes. React renders lists efficiently.
- **Backend API with pagination**: Over-engineering for client-side app.
- **Web Workers**: Adds complexity. Main thread filtering is fast enough.

---

## 7. Build Tool Selection

### Decision: Vite (fast, modern, simple)

**Rationale:**
- Fastest dev server (instant HMR via ES modules)
- Optimized production builds (Rollup-based)
- Zero config for React
- Smaller than Create React App
- Modern tooling (ESM, esbuild)

**Setup:**
```bash
npm create vite@latest expense-tracker -- --template react
cd expense-tracker
npm install
npm run dev
```

**Alternatives Considered:**
- **Create React App (CRA)**: Slower dev server, larger bundle, entering maintenance mode.
- **Webpack from scratch**: Too much configuration overhead.
- **Next.js**: Over-engineering—we don't need SSR, routing, or API routes for SPA.

---

## 8. UI Component Approach

### Decision: Custom CSS with BEM naming, responsive flexbox/grid

**Rationale:**
- No UI library dependency (Material-UI, Ant Design add 300KB+)
- Full control over styling
- Easier to make responsive
- Better performance
- Learning opportunity

**Responsive Breakpoints:**
- Mobile: 320px - 767px (single column)
- Tablet: 768px - 1023px (two column where appropriate)
- Desktop: 1024px+ (multi-column dashboard)

**CSS Organization:**
```
src/
├── App.css              # Global styles, CSS variables
├── components/
│   ├── TransactionForm/
│   │   └── TransactionForm.css
│   ├── TransactionList/
│   │   └── TransactionList.css
│   └── Dashboard/
│       └── Dashboard.css
```

**Alternatives Considered:**
- **Tailwind CSS**: Faster development, but adds build step and learning curve. Reserved for future if velocity becomes priority.
- **CSS-in-JS (styled-components)**: Runtime cost, larger bundle. Plain CSS is sufficient.
- **Material-UI/Chakra**: Heavy dependencies. Custom UI is lighter and more tailored.

---

## 9. Testing Strategy

### Decision: Jest + React Testing Library for critical paths

**Focus Areas (per constitution):**
1. **calculationService.test.js**: Test total income, total expenses, net balance, category aggregations
2. **transactionService.test.js**: Test CRUD operations, validation, localStorage persistence
3. **filterService.test.js**: Test all filter combinations (type, category, date range, search)
4. **exportService.test.js**: Test CSV generation accuracy, proper escaping
5. **validationUtils.test.js**: Test all validation rules

**Example Test:**
```javascript
describe('calculationService', () => {
  test('calculates net balance correctly', () => {
    const transactions = [
      { type: 'income', amount: 1000 },
      { type: 'expense', amount: 300 },
      { type: 'expense', amount: 200 }
    ];
    const result = calculateNetBalance(transactions);
    expect(result).toBe(500); // 1000 - 300 - 200
  });
});
```

**Test Coverage Goals:**
- Services layer: 80%+ coverage
- Utils: 80%+ coverage
- Components: Test only complex logic, skip simple render tests

**Alternatives Considered:**
- **E2E testing (Cypress/Playwright)**: Valuable but not required for MVP. Manual testing acceptable per constitution.
- **100% coverage**: Diminishing returns. Focus on critical financial calculations.

---

## 10. Default Categories

### Decision: Provide sensible defaults, allow custom additions

**Default Expense Categories:**
1. Food & Dining
2. Transportation
3. Entertainment
4. Utilities
5. Shopping
6. Healthcare
7. Education
8. Personal Care
9. Housing
10. Other

**Default Income Categories:**
1. Salary
2. Freelance
3. Investment
4. Gift
5. Bonus
6. Other

**Implementation:**
```javascript
// src/constants/categories.js
export const DEFAULT_CATEGORIES = {
  expense: [
    { id: 'food', name: 'Food & Dining', icon: '🍔' },
    { id: 'transport', name: 'Transportation', icon: '🚗' },
    // ...
  ],
  income: [
    { id: 'salary', name: 'Salary', icon: '💼' },
    { id: 'freelance', name: 'Freelance', icon: '💻' },
    // ...
  ]
};
```

**Future Enhancement:** Allow users to add/edit/delete categories (store in separate localStorage key).

---

## Research Summary

All technical decisions align with constitution principles:
- ✅ **Data Integrity**: Validation, localStorage persistence, tested calculations
- ✅ **Progressive Enhancement**: Simple stack (React + localStorage), no over-engineering
- ✅ **Test Coverage**: Focused on critical paths (calculations, CRUD, filters)
- ✅ **Performance**: Client-side operations meet all performance targets
- ✅ **Data Ownership**: CSV export, transparent localStorage format

**Next Steps**: Proceed to Phase 1 (data-model.md, contracts/, quickstart.md)
