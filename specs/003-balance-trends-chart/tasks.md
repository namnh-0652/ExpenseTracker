# Tasks: Balance Trends Chart Visualization

**Branch**: `003-balance-trends-chart`  
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)  
**Input**: Design documents from `/specs/003-balance-trends-chart/`

**Organization**: Tasks organized to deliver a complete, independently testable balance trends chart feature for the dashboard.

## Format: `- [ ] [ID] [P?] Description with file path`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- Include exact file paths in descriptions

---

## Phase 1: Setup & Research ✅

**Purpose**: Library selection and project configuration for chart integration

- [X] T001 Research Chart.js vs Recharts: bundle size, TypeScript support, accessibility, mobile responsiveness
- [X] T002 Document library decision in specs/003-balance-trends-chart/research.md with bundle size comparison
- [X] T003 Install chosen charting library and type definitions (chart.js@4.5.1 + react-chartjs-2@5.3.1 + @types/chart.js)
- [X] T004 [P] Document balance calculation strategy in specs/003-balance-trends-chart/research.md (cumulative vs period-relative)
- [X] T005 [P] Document data point granularity decisions in research.md (30 days / 12 weeks / 12 months)

---

## Phase 2: Data Model & Service Contracts ✅

**Purpose**: Define data structures and service interfaces for balance trend calculations

- [X] T006 Create specs/003-balance-trends-chart/data-model.md documenting BalanceTrendPoint and BalanceTrendData interfaces
- [X] T007 [P] Create specs/003-balance-trends-chart/contracts/ directory
- [X] T008 Create specs/003-balance-trends-chart/contracts/trend-service-contract.md with calculateBalanceTrend signature
- [X] T009 [P] Document chart configuration types in data-model.md (ChartConfig interface)
- [X] T010 Create specs/003-balance-trends-chart/quickstart.md with integration examples and usage patterns

---

## Phase 3: Balance Trend Calculation Service ✅

**Purpose**: Core business logic for calculating balance trends over time

**⚠️ CRITICAL**: These calculations must be complete and tested before UI implementation

### Tests for Trend Calculation Service

- [X] T011 [P] Create tests/features/dashboard/services/trendCalculationService.test.ts file structure
- [X] T012 [P] Write test: calculateBalanceTrend returns correct data structure
- [X] T013 [P] Write test: calculateBalanceTrend handles empty transaction array
- [X] T014 [P] Write test: groupTransactionsByDate aggregates transactions correctly
- [X] T015 [P] Write test: groupTransactionsByDate handles transactions on same date
- [X] T016 [P] Write test: calculateStartingBalance returns zero for no prior transactions
- [X] T017 [P] Write test: calculateStartingBalance calculates correct balance before period start
- [X] T018 [P] Write test: daily view generates 30 data points for 30-day period
- [X] T019 [P] Write test: weekly view generates 12 data points for 12-week period
- [X] T020 [P] Write test: monthly view generates 12 data points for 12-month period
- [X] T021 [P] Write test: cumulative balance calculated correctly across data points
- [X] T022 [P] Write test: handles decimal amounts without rounding errors

### Implementation for Trend Calculation Service

- [X] T023 Create src/features/dashboard/services/trendCalculationService.ts file
- [X] T024 Implement groupTransactionsByPeriod function in src/features/dashboard/services/trendCalculationService.ts
- [X] T025 Implement calculateStartingBalance function in src/features/dashboard/services/trendCalculationService.ts
- [X] T026 Implement calculateBalanceTrend function in src/features/dashboard/services/trendCalculationService.ts
- [X] T027 Add TypeScript interfaces in src/features/dashboard/types/trendTypes.ts
- [X] T028 Run tests: npm test trendCalculationService.test.ts (29/29 tests pass ✅)
- [X] T029 Verify test coverage >90%: 94.84% statements, 91.89% branches, 94.44% functions, 96.8% lines ✅

**Checkpoint**: Balance trend calculations complete and fully tested

---

## Phase 4: Chart Utilities & Constants

**Purpose**: Shared utilities for chart formatting and configuration

- [ ] T030 [P] Create src/shared/constants/chartConstants.ts with default chart configuration
- [ ] T031 [P] Define chart color constants in src/shared/constants/chartConstants.ts (map to theme variables)
- [ ] T032 [P] Create src/shared/utils/chartUtils.ts file
- [ ] T033 [P] Implement formatChartDate function in src/shared/utils/chartUtils.ts (date formatting for axis labels)
- [ ] T034 [P] Implement formatChartCurrency function in src/shared/utils/chartUtils.ts (currency formatting for tooltips)
- [ ] T035 [P] Implement getChartColorsByTheme function in src/shared/utils/chartUtils.ts (light/dark theme colors)
- [ ] T036 [P] Create tests/shared/utils/chartUtils.test.ts and test all utility functions

---

## Phase 5: Balance Trends Chart Hook

**Purpose**: Custom React hook to manage chart data and state

### Tests for useBalanceTrends Hook

- [ ] T037 [P] Create tests/features/dashboard/hooks/useBalanceTrends.test.ts file
- [ ] T038 [P] Write test: hook returns balance trend data for given period
- [ ] T039 [P] Write test: hook recalculates when transactions change
- [ ] T040 [P] Write test: hook recalculates when period type changes
- [ ] T041 [P] Write test: hook memoizes results to prevent unnecessary recalculations

### Implementation for useBalanceTrends Hook

- [ ] T042 Create src/features/dashboard/hooks/useBalanceTrends.ts file
- [ ] T043 Implement useBalanceTrends hook with useMemo for performance in src/features/dashboard/hooks/useBalanceTrends.ts
- [ ] T044 Hook calls trendCalculationService.calculateBalanceTrend with current transactions and period
- [ ] T045 Add TypeScript return type definition for hook
- [ ] T046 Run hook tests: npm test useBalanceTrends.test.ts (all tests must pass)

**Checkpoint**: Data layer complete - ready for UI components

---

## Phase 6: Chart Type Toggle Component

**Purpose**: Control to switch between line and bar chart views

### Tests for ChartTypeToggle Component

- [ ] T047 [P] Create tests/features/dashboard/components/ChartTypeToggle.test.tsx file
- [ ] T048 [P] Write test: renders line and bar buttons
- [ ] T049 [P] Write test: active button has correct styling
- [ ] T050 [P] Write test: clicking button calls onTypeChange callback
- [ ] T051 [P] Write test: keyboard navigation works (Tab, Enter, Space)

### Implementation for ChartTypeToggle Component

- [ ] T052 [P] Create src/features/dashboard/components/BalanceTrendsChart/ChartTypeToggle.tsx file
- [ ] T053 [P] Create src/features/dashboard/components/BalanceTrendsChart/ChartTypeToggle.css file
- [ ] T054 Implement ChartTypeToggle component with line/bar buttons in ChartTypeToggle.tsx
- [ ] T055 Add button icons (📈 for line, 📊 for bar) in ChartTypeToggle.tsx
- [ ] T056 Style toggle buttons using CSS custom properties in ChartTypeToggle.css
- [ ] T057 Add hover and active states in ChartTypeToggle.css
- [ ] T058 Add aria-label and role="group" for accessibility in ChartTypeToggle.tsx
- [ ] T059 Implement keyboard navigation (Enter/Space to toggle) in ChartTypeToggle.tsx
- [ ] T060 Run component tests: npm test ChartTypeToggle.test.tsx (all tests must pass)

---

## Phase 7: Main Balance Trends Chart Component

**Purpose**: Primary chart component that renders the visualization

### Tests for BalanceTrendsChart Component

- [ ] T061 [P] Create tests/features/dashboard/components/BalanceTrendsChart.test.tsx file
- [ ] T062 [P] Write test: renders chart with sample data
- [ ] T063 [P] Write test: displays empty state when no transactions
- [ ] T064 [P] Write test: chart type toggle changes chart display
- [ ] T065 [P] Write test: chart updates when period changes
- [ ] T066 [P] Write test: tooltip shows on data point hover
- [ ] T067 [P] Write test: chart respects theme (light/dark)
- [ ] T068 [P] Write test: chart is responsive (renders at different widths)

### Implementation for BalanceTrendsChart Component

- [ ] T069 Create src/features/dashboard/components/BalanceTrendsChart/BalanceTrendsChart.tsx file
- [ ] T070 Create src/features/dashboard/components/BalanceTrendsChart/BalanceTrendsChart.css file
- [ ] T071 Implement BalanceTrendsChart component structure with props interface in BalanceTrendsChart.tsx
- [ ] T072 Add useBalanceTrends hook call with transactions and periodType props in BalanceTrendsChart.tsx
- [ ] T073 Add useState for chart type preference (line/bar) in BalanceTrendsChart.tsx
- [ ] T074 Integrate ChartTypeToggle component in BalanceTrendsChart.tsx
- [ ] T075 Configure chart.js or Recharts with balance trend data in BalanceTrendsChart.tsx
- [ ] T076 Implement custom tooltip with income/expense breakdown in BalanceTrendsChart.tsx
- [ ] T077 Add chart options: responsive, maintainAspectRatio, scales configuration in BalanceTrendsChart.tsx
- [ ] T078 Map theme colors to chart colors using getChartColorsByTheme utility in BalanceTrendsChart.tsx
- [ ] T079 Style chart container with responsive layout in BalanceTrendsChart.css
- [ ] T080 Add loading state while data is being calculated in BalanceTrendsChart.tsx
- [ ] T081 Add empty state when no transactions ("No data to display") in BalanceTrendsChart.tsx
- [ ] T082 Add role="img" and descriptive aria-label for accessibility in BalanceTrendsChart.tsx
- [ ] T083 Run component tests: npm test BalanceTrendsChart.test.tsx (all tests must pass)

**Checkpoint**: Chart component complete and fully tested

---

## Phase 8: User Preference Persistence

**Purpose**: Save and restore chart type preference across sessions

- [ ] T084 Create src/shared/hooks/useLocalStorage.ts generic hook (if doesn't exist)
- [ ] T085 Implement useLocalStorage hook with get/set/remove functions in src/shared/hooks/useLocalStorage.ts
- [ ] T086 [P] Create tests/shared/hooks/useLocalStorage.test.ts and test localStorage integration
- [ ] T087 Update BalanceTrendsChart.tsx to use useLocalStorage('chartType', 'line') for chart type persistence
- [ ] T088 Verify chart type persists after page reload in manual testing

---

## Phase 9: Dashboard Integration

**Purpose**: Integrate chart into existing Dashboard component

### Tests for Dashboard Integration

- [ ] T089 [P] Update tests/features/dashboard/components/Dashboard.test.tsx to include chart
- [ ] T090 [P] Write test: Dashboard renders BalanceTrendsChart component
- [ ] T091 [P] Write test: Chart receives correct props (transactions, periodType)
- [ ] T092 [P] Write test: Chart updates when period selector changes

### Implementation for Dashboard Integration

- [ ] T093 Update src/features/dashboard/components/Dashboard/Dashboard.tsx to import BalanceTrendsChart
- [ ] T094 Add BalanceTrendsChart component after summary cards and before category breakdown in Dashboard.tsx
- [ ] T095 Pass transactions and periodType props to BalanceTrendsChart in Dashboard.tsx
- [ ] T096 Update src/features/dashboard/components/Dashboard/Dashboard.css to add chart container section
- [ ] T097 Add .balance-trends-section with margin, padding, background using theme variables in Dashboard.css
- [ ] T098 Add section heading "Balance Trends" in Dashboard.tsx
- [ ] T099 Run integration tests: npm test Dashboard.test.tsx (all tests must pass)

**Checkpoint**: Chart fully integrated into Dashboard

---

## Phase 10: Theme Support & Styling

**Purpose**: Ensure chart adapts to light/dark theme

- [ ] T100 [P] Test chart colors in light theme (verify contrast, readability)
- [ ] T101 [P] Test chart colors in dark theme (verify contrast, readability)
- [ ] T102 Update chart color configuration to use CSS custom properties from src/styles/themes.css
- [ ] T103 Add positive balance color: var(--color-success) in chart configuration
- [ ] T104 Add negative balance color: var(--color-danger) in chart configuration
- [ ] T105 Add grid line colors: var(--color-border) in chart configuration
- [ ] T106 Add axis label colors: var(--color-text-secondary) in chart configuration
- [ ] T107 Test theme switching: verify chart colors update immediately when theme changes
- [ ] T108 [P] Verify WCAG 2.1 AA contrast ratios for all chart colors in both themes

---

## Phase 11: Responsive Design & Mobile Optimization

**Purpose**: Ensure chart works perfectly on all device sizes

- [ ] T109 Add mobile breakpoint styles (<640px) in BalanceTrendsChart.css
- [ ] T110 Reduce chart height on mobile (max-height: 300px) in BalanceTrendsChart.css
- [ ] T111 Adjust font sizes for axis labels on mobile in chart configuration
- [ ] T112 Add tablet breakpoint styles (640px-1024px) in BalanceTrendsChart.css
- [ ] T113 Test touch interactions: tap data points to show tooltip on mobile
- [ ] T114 Optimize tooltip positioning to not overflow screen on mobile
- [ ] T115 Test chart on iPhone Safari (iOS): verify rendering, touch, performance
- [ ] T116 Test chart on Android Chrome: verify rendering, touch, performance
- [ ] T117 Test chart at 320px width (smallest supported viewport)
- [ ] T118 Test chart at 768px width (tablet portrait)
- [ ] T119 Test chart at 1024px+ width (desktop)

---

## Phase 12: Accessibility Compliance

**Purpose**: Ensure chart meets WCAG 2.1 AA standards

- [ ] T120 Add keyboard navigation: Tab to focus chart, Arrow keys to navigate data points
- [ ] T121 Add aria-label with chart summary (e.g., "Balance trend chart showing $X increase over period")
- [ ] T122 Verify screen reader announces chart data (test with VoiceOver/NVDA)
- [ ] T123 Add data table alternative for screen readers (visually hidden)
- [ ] T124 Implement data table with date, balance, income, expense columns
- [ ] T125 Add skip link to bypass chart and go to next section
- [ ] T126 Test keyboard navigation: all interactive elements reachable and operable
- [ ] T127 Verify focus indicators visible and clear on all interactive elements
- [ ] T128 Test with prefers-reduced-motion: disable animations if user preference set
- [ ] T129 Run accessibility audit with axe-core or similar tool
- [ ] T130 Document accessibility features in specs/003-balance-trends-chart/quickstart.md

---

## Phase 13: Performance Optimization

**Purpose**: Ensure chart meets <1s render target for 365 data points

- [ ] T131 Add useMemo to BalanceTrendsChart to memoize chart data transformation
- [ ] T132 Add useCallback to memoize chart event handlers
- [ ] T133 Measure chart render time with React DevTools Profiler (baseline with 30 data points)
- [ ] T134 Measure chart render time with 100 data points
- [ ] T135 Measure chart render time with 365 data points (must be <1000ms)
- [ ] T136 Optimize: reduce chart animation duration if performance issue detected
- [ ] T137 Optimize: implement data point sampling if >500 points (progressive rendering)
- [ ] T138 Verify no frame drops during chart interactions (60fps target)
- [ ] T139 Measure bundle size increase (must be <50KB gzipped)
- [ ] T140 Run npm run build and check dist/assets/index-*.js size difference

**Checkpoint**: Performance targets met

---

## Phase 14: Error Handling & Edge Cases

**Purpose**: Handle error conditions gracefully

- [ ] T141 Add error boundary around BalanceTrendsChart in Dashboard.tsx
- [ ] T142 [P] Handle case: no transactions (show "No data to display" message)
- [ ] T143 [P] Handle case: single transaction (show single data point, disable line chart)
- [ ] T144 [P] Handle case: all transactions on same date (show single bar)
- [ ] T145 [P] Handle case: extremely large balance (>$1M) - format with K/M suffix
- [ ] T146 [P] Handle case: extremely small balance (<$0.01) - format with proper decimals
- [ ] T147 [P] Handle case: chart library fails to load (show fallback message)
- [ ] T148 Add console.error logging for calculation errors
- [ ] T149 Test all edge cases manually

---

## Phase 15: Documentation & Final Testing

**Purpose**: Complete documentation and comprehensive testing

### Documentation

- [ ] T150 Update specs/003-balance-trends-chart/quickstart.md with complete usage guide
- [ ] T151 Add JSDoc comments to all exported functions in trendCalculationService.ts
- [ ] T152 Add component prop documentation in BalanceTrendsChart.tsx
- [ ] T153 Document chart configuration options in quickstart.md
- [ ] T154 Add troubleshooting section to quickstart.md

### Integration Testing

- [ ] T155 Manual test: Create transactions and verify chart updates immediately
- [ ] T156 Manual test: Switch between daily/weekly/monthly views
- [ ] T157 Manual test: Toggle between line and bar chart types
- [ ] T158 Manual test: Hover over data points and verify tooltip accuracy
- [ ] T159 Manual test: Switch theme and verify chart colors update
- [ ] T160 Manual test: Reload page and verify chart type preference persisted
- [ ] T161 Manual test: Test with 0 transactions, 1 transaction, 10 transactions, 365 transactions
- [ ] T162 Manual test: Verify chart matches dashboard summary totals exactly

### Cross-Browser Testing

- [ ] T163 Test on Chrome (latest): all functionality works
- [ ] T164 Test on Firefox (latest): all functionality works
- [ ] T165 Test on Safari (latest): all functionality works
- [ ] T166 Test on Edge (latest): all functionality works

### Final Validation

- [ ] T167 Run full test suite: npm test (all 179+ existing tests + new tests must pass)
- [ ] T168 Run TypeScript check: npm run type-check (zero errors)
- [ ] T169 Run linter: npm run lint (zero errors)
- [ ] T170 Run build: npm run build (successful, bundle size within limits)
- [ ] T171 Run in dev mode: npm run dev (chart renders correctly)
- [ ] T172 Verify all 5 functional requirements from spec.md implemented
- [ ] T173 Verify all success criteria from spec.md met

---

## Phase 16: Polish & Deployment

**Purpose**: Final refinements and production deployment

- [ ] T174 Add loading skeleton/spinner while chart data is being calculated
- [ ] T175 Add smooth transition animations when chart data updates
- [ ] T176 Add fade-in animation when chart first renders
- [ ] T177 Fine-tune tooltip positioning and styling
- [ ] T178 Fine-tune chart padding and margins for visual balance
- [ ] T179 Review all console warnings and fix
- [ ] T180 Update specs/003-balance-trends-chart/tasks.md: mark all tasks complete ✅
- [ ] T181 Git commit: "feat: Add balance trends chart to dashboard"
- [ ] T182 Create pull request: 003-balance-trends-chart → main
- [ ] T183 Self-review: verify constitution compliance
- [ ] T184 Self-review: verify all acceptance criteria met
- [ ] T185 Merge to main branch (after all checks pass)

---

## Dependencies

### External Dependencies
- Chart.js 4.x (or Recharts 2.x) - install in Phase 1

### Internal Dependencies (Existing Code)
- `src/features/dashboard/services/calculationService.ts` - balance calculations
- `src/features/transactions/hooks/useTransactions.ts` - transaction data
- `src/shared/utils/dateUtils.ts` - date formatting utilities
- `src/shared/types/index.ts` - Transaction interface
- `src/styles/themes.css` - theme color variables

---

## Parallel Execution Strategy

**Phase 3**: All calculation tests (T011-T022) can run in parallel  
**Phase 4**: All utility creation (T030-T036) can run in parallel  
**Phase 5**: Tests (T037-T041) can run in parallel  
**Phase 6**: Tests (T047-T051) and CSS (T053, T056-T057) can run in parallel  
**Phase 7**: Tests (T061-T068) can run in parallel  
**Phase 10**: All theme testing (T100-T108) can run in parallel  
**Phase 14**: All edge case handling (T142-T147) can run in parallel  

---

## Summary

- **Total Tasks**: 185
- **Estimated Effort**: 3-4 days
- **Critical Path**: Phase 3 (calculations) → Phase 5 (hook) → Phase 7 (component) → Phase 9 (integration)
- **Parallel Opportunities**: ~40 tasks can be parallelized
- **Test Tasks**: ~60 tasks (tests written before implementation)
- **MVP Scope**: Phases 1-9 deliver functional chart; Phases 10-16 add polish

**Next Steps**: 
1. Start with Phase 1: Research and library selection
2. Complete Phase 3: Calculation service with tests
3. Build UI components (Phases 6-7)
4. Integrate into Dashboard (Phase 9)
5. Optimize and polish (Phases 10-16)
