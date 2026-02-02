# Tasks: Personal Expense Tracking and Reporting

**Input**: Design documents from `/specs/001-expense-tracker/`
**Prerequisites**: ✅ plan.md, ✅ spec.md, ✅ research.md, ✅ data-model.md, ✅ contracts/, ✅ quickstart.md

**Tests**: Constitution requires testing for critical paths (calculations, CRUD, validation, filters)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Implementation Strategy

Per Progressive Enhancement principle:
1. **Phase 1: Setup** → Initialize project structure
2. **Phase 2: Foundational** → Build core services (used by all stories)
3. **Phase 3: User Story 1 (P1)** → Transaction CRUD → **Deploy MVP**
4. **Phase 4: User Story 2 (P2)** → Dashboard → **Deploy**
5. **Phase 5: User Story 3 (P3)** → Search/Filter → **Deploy**
6. **Phase 6: User Story 4 (P3)** → Export → **Deploy**
7. **Phase 7: Polish** → Cross-cutting concerns

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create React project with Vite: `npm create vite@latest expense-tracker -- --template react`
- [X] T002 Install dependencies: date-fns, uuid
- [X] T003 [P] Install dev dependencies: @testing-library/react, @testing-library/jest-dom, vitest, jsdom
- [X] T004 Create feature-first directory structure: `src/{features/{transactions,dashboard,filters,export},shared/{components,services,utils,constants}}` and `tests/{features,shared}`
- [X] T005 [P] Configure Vitest in vite.config.js
- [X] T006 [P] Create tests/setup.js for test configuration
- [X] T007 Create src/shared/constants/storageKeys.js with localStorage key constants
- [X] T008 Create src/shared/constants/categories.js with default income/expense categories

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core utilities and services that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T009 Create src/shared/utils/storageUtils.js with localStorage wrapper (save, load, remove, exists, backup)
- [X] T010 [P] Create src/shared/utils/validationUtils.js with validation functions (amount, date, type, category, description)
- [X] T011 [P] Create src/shared/utils/dateUtils.js with date formatting and manipulation helpers
- [X] T012 Create src/shared/services/categoryService.js (getCategories, getCategoryById, getCategoryName, categoryExists)
- [X] T013 Write tests/shared/utils/validationUtils.test.js (test all validation rules)
- [X] T014 [P] Write tests/shared/utils/dateUtils.test.js (test date formatting and calculations)
- [X] T015 Create src/features/transactions/hooks/useTransactions.js (TransactionContext with Context API)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Record Income and Expenses (Priority: P1) 🎯 MVP

**Goal**: Users can create, view, edit, and delete transactions with categories. Transactions persist across sessions.

**Independent Test**: Create transactions with different amounts, dates, types, and categories. Verify they appear in list, can be edited, deleted, and persist after page refresh.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T016 [P] [US1] Write tests/features/transactions/services/transactionService.test.js (CRUD operations, validation, persistence)
- [X] T017 [P] [US1] Write tests for transaction creation, update, delete, and localStorage integration

### Implementation for User Story 1

- [X] T018 [US1] Implement src/features/transactions/services/transactionService.js (getAllTransactions, getTransactionById, createTransaction, updateTransaction, deleteTransaction, validateTransaction)
- [X] T019 [US1] Create src/features/transactions/components/TransactionForm/TransactionForm.jsx (form for creating/editing transactions)
- [X] T020 [P] [US1] Create src/features/transactions/components/TransactionForm/TransactionForm.css (form styling)
- [X] T021 [US1] Create src/features/transactions/components/TransactionList/TransactionList.jsx (display list of transactions)
- [X] T022 [P] [US1] Create src/features/transactions/components/TransactionList/TransactionList.css (list styling)
- [ ] T023 [US1] Create src/shared/components/Button/Button.jsx (reusable button component)
- [ ] T024 [P] [US1] Create src/shared/components/Input/Input.jsx (reusable input component)
- [X] T025 [US1] Update src/App.jsx to include TransactionProvider, TransactionForm, and TransactionList
- [X] T026 [P] [US1] Create src/App.css with global styles and CSS variables
- [X] T027 [US1] Add edit functionality to TransactionList (click to edit)
- [X] T028 [US1] Add delete functionality to TransactionList (delete button with confirmation)
- [X] T029 [US1] Implement form validation feedback (show error messages inline)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. **DEPLOY MVP**.

---

## Phase 4: User Story 2 - View Dashboard with Time Filters (Priority: P2)

**Goal**: Users can view aggregated financial data (total income, expenses, balance, category breakdown) filtered by day, week, or month.

**Independent Test**: Create sample transactions across different dates. Switch between daily, weekly, and monthly views. Verify calculations are correct and category breakdown shows top spending categories.

### Tests for User Story 2

- [ ] T030 [P] [US2] Write tests/features/dashboard/services/calculationService.test.js (test all financial calculations with 90%+ coverage)
- [ ] T031 [P] [US2] Test calculateTotalIncome, calculateTotalExpenses, calculateNetBalance, calculateCategoryBreakdown, getDateRangeForPeriod

### Implementation for User Story 2

- [ ] T032 [US2] Implement src/features/dashboard/services/calculationService.js (all calculation functions from contract)
- [ ] T033 [US2] Create src/features/dashboard/components/Dashboard/Dashboard.jsx (main dashboard component)
- [ ] T034 [P] [US2] Create src/features/dashboard/components/Dashboard/Dashboard.css (dashboard styling with responsive layout)
- [ ] T035 [US2] Create src/features/dashboard/components/SummaryCard/SummaryCard.jsx (display income, expenses, balance)
- [ ] T036 [P] [US2] Create src/features/dashboard/components/CategoryChart/CategoryChart.jsx (category breakdown visualization - simple bar chart or list)
- [ ] T037 [US2] Create src/features/dashboard/components/TimePeriodSelector/TimePeriodSelector.jsx (day/week/month toggle buttons)
- [ ] T038 [US2] Implement date range calculation logic in Dashboard (use date-fns)
- [ ] T039 [US2] Add Dashboard to App.jsx with navigation
- [ ] T040 [US2] Implement useMemo optimization for dashboard calculations
- [ ] T041 [US2] Add empty state handling (show message when no transactions in period)

**Checkpoint**: At this point, User Story 2 should be fully functional and testable independently. **DEPLOY with P1+P2**.

---

## Phase 5: User Story 3 - Search and Filter Transactions (Priority: P3)

**Goal**: Users can search transactions by description and filter by category, type, and date range. Multiple filters can be combined.

**Independent Test**: Create diverse transactions. Apply text search, filter by category, filter by type, filter by date range. Verify correct results. Test combined filters. Test clear filters functionality.

### Tests for User Story 3

- [ ] T042 [P] [US3] Write tests/features/filters/services/filterService.test.js (test all filter functions with 80%+ coverage)
- [ ] T043 [P] [US3] Test searchTransactions, filterByType, filterByCategory, filterByDateRange, applyFilters, sortTransactions

### Implementation for User Story 3

- [ ] T044 [US3] Implement src/features/filters/services/filterService.js (all filter functions from contract)
- [ ] T045 [US3] Create src/features/filters/components/FilterBar/FilterBar.jsx (filter UI with all controls)
- [ ] T046 [P] [US3] Create src/features/filters/components/FilterBar/FilterBar.css (filter bar styling)
- [ ] T047 [US3] Add search input to FilterBar (text search with debounce)
- [ ] T048 [US3] Add type filter dropdown to FilterBar (All, Income, Expense)
- [ ] T049 [US3] Add category filter dropdown to FilterBar (All, or specific category)
- [ ] T050 [US3] Add date range picker to FilterBar (start date and end date inputs)
- [ ] T051 [US3] Add "Clear Filters" button to FilterBar
- [ ] T052 [US3] Create filter state management in App.jsx or TransactionContext
- [ ] T053 [US3] Connect FilterBar to TransactionList (apply filters to displayed transactions)
- [ ] T054 [US3] Implement useMemo optimization for filtered results
- [ ] T055 [US3] Add filter count indicator (show "X filters active")
- [ ] T056 [US3] Update Dashboard to respect active filters

**Checkpoint**: At this point, User Story 3 should be fully functional and testable independently. **DEPLOY with P1+P2+P3**.

---

## Phase 6: User Story 4 - Export Transaction Data (Priority: P3)

**Goal**: Users can export transaction data to CSV format. Export respects active filters. Downloaded file contains all transaction fields.

**Independent Test**: Create transactions. Click export button. Verify CSV file downloads with correct data and format. Apply filters, export again, verify only filtered transactions are exported. Test empty state (no transactions to export).

### Tests for User Story 4

- [ ] T057 [P] [US4] Write tests/features/export/services/exportService.test.js (test CSV generation accuracy and escaping)
- [ ] T058 [P] [US4] Test exportToCSV, escapeCSVValue, generateFilename

### Implementation for User Story 4

- [ ] T059 [US4] Implement src/features/export/services/exportService.js (exportToCSV, downloadCSV, escapeCSVValue, generateFilename)
- [ ] T060 [US4] Create "Export CSV" button component in src/features/export/components/ExportButton/ExportButton.jsx
- [ ] T061 [US4] Add ExportButton to TransactionList or FilterBar
- [ ] T062 [US4] Connect ExportButton to current filtered transaction list
- [ ] T063 [US4] Implement CSV download using Blob and createObjectURL
- [ ] T064 [US4] Add empty state handling (disable button or show message when no transactions)
- [ ] T065 [US4] Add success feedback (show "Export successful" message)
- [ ] T066 [US4] Test CSV escaping with special characters (commas, quotes, newlines)

**Checkpoint**: At this point, User Story 4 should be fully functional and testable independently. **DEPLOY complete feature set**.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final touches, performance optimization, and user experience enhancements

- [ ] T067 [P] Add loading states to all async operations
- [ ] T068 [P] Add responsive styles for mobile (320px), tablet (768px), desktop (1024px)
- [ ] T069 [P] Add keyboard navigation support (Tab, Enter, Escape)
- [ ] T070 [P] Add confirmation dialogs for destructive actions (delete transaction)
- [ ] T071 Implement error boundaries for graceful error handling
- [ ] T072 [P] Add accessibility attributes (ARIA labels, roles)
- [ ] T073 [P] Optimize bundle size (check with `npm run build`)
- [ ] T074 Test performance with 10,000 transactions (create test data script)
- [ ] T075 [P] Add favicon and page title
- [ ] T076 [P] Create README.md with setup instructions
- [ ] T077 [P] Add .gitignore with proper exclusions
- [ ] T078 Validate all constitution requirements met (data integrity, performance, tests, data ownership)
- [ ] T079 Final cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] T080 [P] Create deployment documentation

**Final Checkpoint**: Application is production-ready and meets all success criteria.

---

## Dependency Graph

### User Story Completion Order

```
Setup (Phase 1)
  ↓
Foundational (Phase 2)
  ↓
  ├─→ User Story 1 (P1) → DEPLOY MVP
  ↓                       ↓
  ├─→ User Story 2 (P2) ← depends on US1 → DEPLOY
  ↓                       ↓
  ├─→ User Story 3 (P3) ← depends on US1 & US2 → DEPLOY
  ↓                       ↓
  └─→ User Story 4 (P3) ← depends on US3 (filters) → DEPLOY
                          ↓
                     Polish (Phase 7) → FINAL RELEASE
```

### Critical Dependencies

- **US2** depends on US1 (needs transactions to calculate)
- **US3** enhances US1 and US2 (adds filtering to both)
- **US4** depends on US3 (export respects filters)

---

## Parallel Execution Opportunities

### Within Each User Story

**US1 (P1) - Can be done in parallel:**
- T016, T017 (tests) while T018 (service) is being written
- T020 (CSS) while T019 (TransactionForm) is being built
- T022 (CSS) while T021 (TransactionList) is being built
- T023, T024 (shared components) independent

**US2 (P2) - Can be done in parallel:**
- T030, T031 (tests) while T032 (calculationService) is being written
- T034 (CSS) while T033 (Dashboard) is being built
- T035, T036, T037 (subcomponents) after Dashboard structure is defined

**US3 (P3) - Can be done in parallel:**
- T042, T043 (tests) while T044 (filterService) is being written
- T046 (CSS) while T045 (FilterBar) is being built
- T047, T048, T049, T050 (filter controls) can be built in parallel

**US4 (P3) - Can be done in parallel:**
- T057, T058 (tests) while T059 (exportService) is being written
- T060, T061 (UI) while T059 (service) is being built

**Polish (Phase 7) - Can be done in parallel:**
- T067, T068, T069, T070, T072, T073, T075, T076, T077, T080 are all independent

---

## Task Summary

**Total Tasks**: 80
- **Phase 1 (Setup)**: 8 tasks
- **Phase 2 (Foundational)**: 7 tasks
- **Phase 3 (US1 - P1)**: 14 tasks
- **Phase 4 (US2 - P2)**: 12 tasks
- **Phase 5 (US3 - P3)**: 15 tasks
- **Phase 6 (US4 - P3)**: 10 tasks
- **Phase 7 (Polish)**: 14 tasks

**Parallel Tasks**: 32 tasks marked with [P] (40% can run in parallel)

**MVP Scope** (Recommended first release):
- Phase 1: Setup (T001-T008)
- Phase 2: Foundational (T009-T015)
- Phase 3: User Story 1 (T016-T029)
- **Total: 29 tasks for MVP**

**Test Tasks**: 10 test-writing tasks (critical paths covered)

---

## Constitution Alignment

✅ **Data Integrity**: T013, T016, T017, T018, T029 ensure validation and error handling  
✅ **Progressive Enhancement**: Phased deployment (MVP → P2 → P3)  
✅ **Test Coverage**: T013, T014, T016, T017, T030, T031, T042, T043, T057, T058 cover critical paths  
✅ **Performance**: T040, T054, T074 address performance requirements  
✅ **Data Ownership**: T057-T066 implement complete CSV export

---

## Format Validation

✅ All tasks follow required format: `- [ ] [TaskID] [P?] [Story?] Description with file path`  
✅ Task IDs are sequential (T001-T080)  
✅ [P] markers indicate parallelizable tasks  
✅ [Story] labels (US1, US2, US3, US4) map to user stories from spec.md  
✅ File paths included in task descriptions  
✅ Each phase has clear purpose and checkpoint

**Status**: Tasks ready for implementation ✅
