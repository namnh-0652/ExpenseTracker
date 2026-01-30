# Implementation Plan: Personal Expense Tracking and Reporting

**Branch**: `001-expense-tracker` | **Date**: January 30, 2026 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-expense-tracker/spec.md`

## Summary

Build a personal expense tracking web application using React.js that allows users to record income and expenses with categories, view dashboard analytics filtered by time periods, and export data to CSV. The application prioritizes data integrity, progressive enhancement (P1 → P2 → P3), and client-side performance for up to 10,000 transactions.

## Technical Context

**Language/Version**: JavaScript (ES6+) / TypeScript (optional for type safety)  
**Primary Dependencies**: React.js 18+, React Router (for navigation), date-fns or Day.js (for date handling)  
**Storage**: localStorage (MVP) with potential upgrade to IndexedDB for larger datasets  
**Testing**: Jest + React Testing Library for component and logic testing  
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge latest versions)
**Project Type**: Web application (frontend-only, single-page application)  
**Performance Goals**: 
  - Transaction creation: < 30 seconds (UI interaction included)
  - Dashboard load: < 5 seconds
  - Search/Filter: < 2 seconds (up to 10K transactions)
  - CSV export: < 3 seconds (up to 1K transactions)
  - View switching: < 1 second
  
**Constraints**: 
  - Client-side only (no backend required for MVP)
  - Offline-capable (localStorage persists data)
  - Mobile responsive (320px, 768px, 1024px viewports)
  - Single currency support
  - Up to 10,000 transactions per user
  
**Scale/Scope**: 
  - Single user per browser instance
  - 4 user stories (P1-P3)
  - ~8-10 React components
  - ~5-7 utility/service modules

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. User-Centric Data Integrity ✅ PASS

**Requirements:**
- Transaction amounts validated (positive numeric only)
- All calculations tested
- No data loss across sessions
- Clear success/error feedback

**Status**: Specification explicitly requires validation (FR-002, FR-003), persistence across sessions (FR-023), and appropriate error messages (FR-024). All calculations will be tested per Test Coverage principle.

**Actions**: Implement validation in transactionService, test all calculation functions, use localStorage with error handling.

---

### II. Progressive Enhancement ✅ PASS

**Requirements:**
- Implement P1 → P2 → P3 in order
- Each priority fully functional before next
- No breaking changes
- Simple over sophisticated

**Status**: Spec clearly prioritizes features (P1: Transactions, P2: Dashboard, P3: Search/Export). Each can be deployed independently.

**Actions**: 
- Phase 1: P1 (Transaction CRUD + list) → Deploy
- Phase 2: P2 (Dashboard + time filters) → Deploy  
- Phase 3: P3 (Search/Filter + CSV) → Deploy

---

### III. Test Coverage for Critical Paths ✅ PASS

**MUST test:**
- ✅ Financial calculations (totals, balances, category aggregations)
- ✅ Transaction CRUD operations
- ✅ Validation logic (amounts, dates)
- ✅ Filter and search logic
- ✅ CSV export accuracy

**Status**: Critical paths identified. Testing plan focuses on services layer (calculationService, transactionService, filterService, exportService).

**Actions**: Create unit tests for all service modules. Manual testing for UI components acceptable per constitution.

---

### IV. Performance First ✅ PASS

**Requirements:**
- Transaction creation: < 30s ✅ (form interaction + localStorage write is instant)
- Dashboard load: < 5s ✅ (client-side calculation, no network)
- Search/Filter: < 2s ✅ (in-memory array operations on 10K records)
- CSV export: < 3s ✅ (string generation from filtered data)
- View switching: < 1s ✅ (recalculation with React state updates)

**Status**: All performance targets achievable with client-side React + localStorage. No backend latency. Array operations on 10K items are sub-second in modern browsers.

**Actions**: Implement efficient filter/search algorithms. Use React.memo for expensive components. Profile with 10K test transactions.

---

### V. Data Ownership and Portability ✅ PASS

**Requirements:**
- CSV export with all fields
- No proprietary formats
- Export works with filters
- Complete data retrieval anytime

**Status**: FR-020, FR-021, FR-022 explicitly require CSV export with all fields, including filtered exports. localStorage is transparent and accessible.

**Actions**: Implement exportService that converts transaction array to CSV with headers (date, amount, type, category, description). Respect active filters.

---

### Constitution Compliance Summary

**Overall Status**: ✅ **ALL GATES PASS**

All five constitution principles are satisfied by the current technical approach. No violations requiring justification. Feature can proceed to Phase 0 research.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── components/           # React UI components
│   ├── TransactionForm/  # P1: Create/edit transaction form
│   ├── TransactionList/  # P1: Display list of transactions
│   ├── Dashboard/        # P2: Dashboard with time filters
│   ├── FilterBar/        # P3: Search and filter controls
│   └── shared/           # Reusable UI components (buttons, inputs, etc.)
├── services/             # Business logic and data operations
│   ├── transactionService.js   # CRUD operations for transactions
│   ├── categoryService.js      # Category management
│   ├── calculationService.js   # Financial calculations (totals, balances)
│   ├── filterService.js        # Search and filter logic
│   └── exportService.js        # CSV export functionality
├── utils/                # Helper functions
│   ├── dateUtils.js      # Date formatting and manipulation
│   ├── validationUtils.js  # Input validation
│   └── storageUtils.js   # localStorage wrapper
├── constants/            # Application constants
│   └── categories.js     # Default income/expense categories
├── App.jsx               # Main application component
├── App.css               # Global styles
└── index.js              # Entry point

public/
├── index.html
└── favicon.ico

tests/
├── services/             # Service layer tests (critical path)
│   ├── transactionService.test.js
│   ├── calculationService.test.js
│   └── filterService.test.js
└── utils/                # Utility tests
    ├── validationUtils.test.js
    └── dateUtils.test.js

package.json
vite.config.js (or react-scripts config)
README.md
.gitignore
```

**Structure Decision**: Frontend-only single-page React application. No backend required for MVP since localStorage handles persistence. Components organized by feature (P1, P2, P3 priorities). Services layer encapsulates all business logic and data operations to enable easy testing and future backend migration.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**Status**: No violations. No complexity tracking required.

All constitution principles are satisfied:
- ✅ Data integrity through validation and tests
- ✅ Progressive enhancement (P1 → P2 → P3)
- ✅ Test coverage focused on critical paths
- ✅ Performance targets met with client-side operations
- ✅ Data ownership via CSV export

---

## Phase 0: Research (COMPLETE)

**Output**: [research.md](./research.md)

**Key Decisions:**
1. React state management: useState + Context API (simple, sufficient)
2. Data persistence: localStorage (5-10MB limit, synchronous, simple)
3. Date library: date-fns (lightweight, tree-shakeable, modern)
4. CSV export: Client-side generation (no server needed)
5. Form validation: Controlled components with immediate feedback
6. Filtering: In-memory with React.useMemo (fast for 10K items)
7. Build tool: Vite (fastest dev server, optimized builds)
8. UI approach: Custom CSS with BEM naming (no UI library bloat)
9. Testing: Jest + React Testing Library (focused on services)
10. Default categories: 10 expense + 6 income categories

**All research complete. No NEEDS CLARIFICATION markers remain.**

---

## Phase 1: Design & Contracts (COMPLETE)

### Data Model: [data-model.md](./data-model.md)

**Entities:**
- **Transaction**: Core entity with amount, date, type, categoryId, description
- **Category**: Classification with 16 default categories (10 expense, 6 income)
- **Filter State**: UI state for search, filters, time period
- **Dashboard Summary**: Computed aggregations (income, expenses, balance, category breakdown)
- **CSV Export**: Portable format with all transaction fields

**Storage:**
- localStorage key: `expense-tracker-transactions`
- JSON serialization of Transaction[]
- ~250 bytes per transaction, ~2.5MB for 10K transactions
- Schema version 1 with migration path defined

### Service Contracts: [contracts/service-contracts.md](./contracts/service-contracts.md)

**Services Defined:**
1. **TransactionService**: CRUD operations with validation
2. **CategoryService**: Category retrieval and management
3. **CalculationService**: Financial calculations (totals, balances, aggregations)
4. **FilterService**: Search and filter logic
5. **ExportService**: CSV generation and download
6. **StorageService**: localStorage wrapper with error handling
7. **ValidationService**: Input validation helpers

**All services have TypeScript-style interfaces with:**
- Method signatures
- Parameter types
- Return types
- Error handling specifications
- Usage examples

### Developer Guide: [quickstart.md](./quickstart.md)

**Contents:**
- Project setup instructions (Vite + React)
- Directory structure
- TDD workflow
- Key implementation files (constants, context, components)
- Testing examples with Vitest
- Component examples (TransactionForm with validation)
- Common tasks and code snippets
- Debugging tips
- Performance optimization strategies

---

## Phase 2: Constitution Re-Check

*Post-design validation of all principles*

### I. User-Centric Data Integrity ✅ PASS

**Design Verification:**
- ✅ TransactionService includes full validation logic (validateTransaction method)
- ✅ CalculationService isolated for unit testing (all calculations testable)
- ✅ StorageService includes error handling and backup mechanisms
- ✅ Data model specifies validation rules for all fields
- ✅ Quick start guide includes error recovery strategies

**No changes needed.**

---

### II. Progressive Enhancement ✅ PASS

**Design Verification:**
- ✅ Component structure organized by priority (P1, P2, P3 folders)
- ✅ Services can be implemented independently
- ✅ TransactionForm + TransactionList = deployable P1
- ✅ Dashboard can be added without modifying P1 code
- ✅ FilterBar and ExportService are independent additions

**No changes needed.**

---

### III. Test Coverage for Critical Paths ✅ PASS

**Design Verification:**
- ✅ Test files specified for all service modules
- ✅ Quick start includes test examples for calculationService
- ✅ Service contracts specify 70-90% coverage targets
- ✅ Testing strategy focuses on services, not UI rendering

**No changes needed.**

---

### IV. Performance First ✅ PASS

**Design Verification:**
- ✅ FilterService uses single-pass O(n) algorithms
- ✅ Research validates in-memory operations meet <2s target for 10K transactions
- ✅ React.useMemo recommended for expensive computations
- ✅ localStorage is synchronous (no network latency)
- ✅ All performance targets validated in research phase

**No changes needed.**

---

### V. Data Ownership and Portability ✅ PASS

**Design Verification:**
- ✅ ExportService provides full CSV export
- ✅ CSV format includes all transaction fields (date, amount, type, category, description)
- ✅ Export works with filtered data (respects user's active filters)
- ✅ localStorage format is JSON (human-readable, standard)
- ✅ Data model documents storage format for transparency

**No changes needed.**

---

### Final Constitution Status

**Overall**: ✅ **ALL GATES PASS** (Pre-Design and Post-Design)

All five constitution principles are fully satisfied by the technical design. No violations, no complexity requiring justification. Implementation can proceed.

---

## Next Steps

1. ✅ **Planning Phase Complete** - All design documents generated
2. ⏭️ **Create Tasks** - Run `/speckit.tasks` to break down implementation
3. ⏭️ **Implement P1** - Start with Transaction CRUD (highest priority)
4. ⏭️ **Test P1** - Validate all P1 acceptance criteria
5. ⏭️ **Deploy P1** - Ship MVP before moving to P2

**Planning artifacts:**
- ✅ [plan.md](./plan.md) - This file
- ✅ [research.md](./research.md) - Technical decisions
- ✅ [data-model.md](./data-model.md) - Entity definitions
- ✅ [service-contracts.md](./contracts/service-contracts.md) - API specifications
- ✅ [quickstart.md](./quickstart.md) - Developer guide

**Ready for task breakdown.**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
