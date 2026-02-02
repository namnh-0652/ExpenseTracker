# Implementation Plan: Balance Trends Chart Visualization

**Branch**: `003-balance-trends-chart` | **Date**: February 2, 2026 | **Spec**: [CR-001](../001-expense-tracker/change-requests/CR-001-balance-trends-chart.md)
**Input**: Feature specification from `/specs/003-balance-trends-chart/spec.md`

**Note**: This plan follows the speckit workflow for implementing a visual balance trends chart on the dashboard.

## Summary

Add an interactive line/bar chart to the dashboard that displays how the user's cumulative balance changes over time. The chart will respect existing time period filters (daily/weekly/monthly), show interactive tooltips with breakdown details, support theme switching, and provide accessible keyboard navigation. This enhancement leverages existing calculation services and integrates seamlessly into the current Dashboard component structure.

## Technical Context

**Language/Version**: TypeScript 5.6.2, React 18.3.1  
**Primary Dependencies**: Vite 7.3.1, Chart.js 4.x (or Recharts 2.x - to be decided in Phase 0)  
**Storage**: localStorage (existing transaction data, no new storage needed)  
**Testing**: Vitest 3.0.0 with @testing-library/react  
**Target Platform**: Web browsers (Chrome, Firefox, Safari, Edge) - desktop and mobile responsive
**Project Type**: Web application - React SPA with feature-first architecture  
**Performance Goals**: Chart renders <1s for 365 data points, smooth 60fps interactions  
**Constraints**: Bundle size increase <50KB gzipped, WCAG 2.1 AA accessibility compliance  
**Scale/Scope**: Single new component + calculation utility, ~300-400 LOC total

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Core Principles Compliance

**I. User-Centric Data Integrity** ✅ PASS
- Chart calculations use existing calculationService functions (already tested)
- Balance trend data derived from validated transaction data
- No new data persistence required - read-only visualization
- Chart accuracy validated against existing dashboard totals

**II. Progressive Enhancement** ✅ PASS
- Builds on fully functional P1-P3 features (transaction tracking complete)
- Non-breaking addition to Dashboard component
- Users can continue using app if chart fails to load
- Enhancement adds value without disrupting existing workflows

**III. Feature-First Code Organization** ✅ PASS
- New code located at `features/dashboard/components/BalanceTrendsChart/`
- Calculation utilities extend existing `features/dashboard/services/`
- Follows established project structure pattern
- Self-contained feature module with clear boundaries

**IV. Test Coverage for Critical Paths** ✅ PASS
- MUST test: Balance trend calculations (cumulative balance over time)
- MUST test: Data point generation for daily/weekly/monthly views
- MUST test: Date range filtering logic
- MAY skip: Chart rendering library internals (tested by library maintainers)

**V. Performance First** ✅ PASS
- Requirement: Chart renders <1s for 365 data points
- Existing dashboard loads in <5s - chart reuses same data
- Client-side calculations (no network overhead)
- Memoization prevents unnecessary recalculations

**VI. Data Ownership and Portability** ✅ PASS
- No new data storage or export requirements
- Chart visualizes existing transaction data
- Does not affect CSV export functionality

### Complexity Justification

**No violations** - All complexity gates passed. This feature adds visualization to existing data without introducing new architectural patterns, external services, or data storage mechanisms.

## Project Structure

### Documentation (this feature)

```text
specs/003-balance-trends-chart/
├── spec.md             # Feature specification (CR-001 moved here)
├── plan.md             # This file (implementation plan)
├── research.md         # Phase 0 output (charting library research)
├── data-model.md       # Phase 1 output (chart data structures)
├── quickstart.md       # Phase 1 output (integration guide)
└── contracts/          # Phase 1 output (service contracts)
    └── chart-service-contract.md
```

### Source Code (repository root)

```text
src/features/dashboard/
├── components/
│   ├── Dashboard/
│   │   ├── Dashboard.tsx             # UPDATED: Add BalanceTrendsChart
│   │   └── Dashboard.css             # UPDATED: Chart container styles
│   ├── BalanceTrendsChart/           # NEW FEATURE
│   │   ├── BalanceTrendsChart.tsx    # Main chart component
│   │   ├── BalanceTrendsChart.css    # Chart-specific styles
│   │   ├── ChartTypeToggle.tsx       # Line/bar toggle control
│   │   └── ChartTooltip.tsx          # Custom tooltip component
│   ├── SummaryCard/                  # EXISTING (no changes)
│   ├── CategoryChart/                # EXISTING (no changes)
│   └── TimePeriodSelector/           # EXISTING (no changes)
├── services/
│   ├── calculationService.ts         # EXISTING (no changes)
│   └── trendCalculationService.ts    # NEW: Balance trend calculations
└── hooks/
    └── useBalanceTrends.ts           # NEW: Chart data hook

src/shared/
├── utils/
│   └── chartUtils.ts                 # NEW: Chart formatting utilities
└── constants/
    └── chartConstants.ts             # NEW: Chart configuration constants

tests/features/dashboard/
├── services/
│   └── trendCalculationService.test.ts  # NEW: Trend calculation tests
├── components/
│   └── BalanceTrendsChart.test.tsx      # NEW: Component tests
└── hooks/
    └── useBalanceTrends.test.ts         # NEW: Hook tests
```

**Structure Decision**: Following feature-first organization as mandated by Constitution Principle III. All chart-related code contained within `features/dashboard/` since the chart is a dashboard enhancement. Shared utilities (formatting, constants) placed in `src/shared/` for potential reuse by future chart components.

## Phase 0: Research & Decisions

### Research Tasks

1. **Charting Library Evaluation** [NEEDS CLARIFICATION]
   - **Options**: Chart.js 4.x vs Recharts 2.x vs Victory
   - **Criteria**: Bundle size, TypeScript support, accessibility, theme support, mobile responsiveness
   - **Decision needed**: Which library best meets our requirements?
   - **Suggested approach**: Research both Chart.js and Recharts; prefer lighter bundle size if feature parity

2. **Balance Calculation Strategy** [NEEDS CLARIFICATION]
   - **Question**: Should balance be cumulative from all transaction history or period-relative?
   - **Option A**: Cumulative (shows true net worth) - better for financial health tracking
   - **Option B**: Period-relative (resets each period) - better for period comparison
   - **Decision needed**: Which approach provides more user value?
   - **Suggested answer**: Option A (cumulative) - aligns with typical personal finance expectations

3. **Data Point Granularity** [NEEDS CLARIFICATION]
   - **Question**: How many data points to show for each period type?
   - **Daily view**: Last 30 days? 7 days? Configurable?
   - **Weekly view**: Last 12 weeks? 8 weeks?
   - **Monthly view**: Last 12 months? 6 months?
   - **Decision needed**: Balance data density vs. overview utility
   - **Suggested answer**: 30 days / 12 weeks / 12 months (standard financial reporting periods)

4. **Chart Interaction Patterns**
   - **Question**: Should chart include zoom/pan, or rely on period filter?
   - **Decision needed**: See Open Questions in spec
   - **Suggested answer**: No zoom/pan initially - use period filter (simpler, consistent with existing UX)

5. **Theme Integration**
   - **Research**: How does chosen library handle theming?
   - **Requirement**: Chart colors must adapt to light/dark theme
   - **Implementation**: Map theme CSS custom properties to chart color config

### Deliverable: research.md

Document all decisions with:
- **Decision**: What was chosen
- **Rationale**: Why this option selected
- **Alternatives considered**: What else was evaluated
- **Trade-offs**: What we gain/lose with this choice

## Phase 1: Design & Contracts

### Data Model Decisions

1. **Chart Data Structure**
```typescript
interface BalanceTrendPoint {
  date: string;           // ISO 8601 date
  balance: number;        // Cumulative balance at end of date
  income: number;         // Income on this date
  expense: number;        // Expense on this date
  transactionCount: number; // Transactions on this date
}

interface BalanceTrendData {
  points: BalanceTrendPoint[];
  period: {
    start: string;
    end: string;
    type: 'day' | 'week' | 'month';
  };
  startingBalance: number;  // Balance at period start
  endingBalance: number;    // Balance at period end
  change: number;           // endingBalance - startingBalance
  changePercentage: number; // (change / abs(startingBalance)) * 100
}
```

2. **Chart Configuration**
```typescript
interface ChartConfig {
  type: 'line' | 'bar';
  theme: 'light' | 'dark';
  height: number;
  responsive: boolean;
  interaction: {
    tooltipEnabled: boolean;
    hoverEffects: boolean;
  };
}
```

### Service Contracts

**trendCalculationService.ts**
```typescript
// Calculate cumulative balance for each date in range
calculateBalanceTrend(
  transactions: Transaction[],
  period: TimePeriod
): BalanceTrendData

// Group transactions by date and calculate daily metrics
groupTransactionsByDate(
  transactions: Transaction[],
  dateRange: DateRange
): Map<string, { income: number; expense: number; count: number }>

// Calculate starting balance (balance before period start)
calculateStartingBalance(
  transactions: Transaction[],
  periodStart: string
): number
```

### Integration Points

1. **Dashboard Component** (`Dashboard.tsx`)
   - Add `<BalanceTrendsChart>` component after summary cards
   - Pass `transactions` and `periodType` as props
   - Chart respects existing time period selector

2. **Theme System**
   - Chart colors use CSS custom properties from `themes.css`
   - No hardcoded colors in chart configuration
   - Automatic theme switching via `data-theme` attribute

3. **Accessibility**
   - Chart wrapper has `role="img"` and descriptive `aria-label`
   - Data table alternative for screen readers
   - Keyboard navigation for chart type toggle

### Deliverables

- `data-model.md`: Chart data structures documented
- `contracts/chart-service-contract.md`: Service interfaces defined
- `quickstart.md`: Integration examples and usage patterns

## Phase 2: Implementation Tasks (High-Level)

*Detailed tasks will be generated by `/speckit.tasks` command*

### Component Development
- T001-T005: Create BalanceTrendsChart component structure
- T006-T010: Implement chart rendering with chosen library
- T011-T015: Add interactive tooltips with breakdown
- T016-T020: Create ChartTypeToggle component
- T021-T025: Add responsive styles and mobile optimization

### Service Layer
- T026-T030: Implement trendCalculationService
- T031-T035: Create useBalanceTrends hook
- T036-T040: Add chart utility functions

### Integration
- T041-T045: Integrate chart into Dashboard component
- T046-T050: Add theme support and CSS custom properties
- T051-T055: Implement user preference persistence (chart type)

### Testing
- T056-T065: Unit tests for trend calculations
- T066-T075: Component tests for chart interactions
- T076-T085: Accessibility tests (keyboard nav, screen readers)
- T086-T090: Visual regression tests
- T091-T095: Performance tests (365 data points)

### Quality Assurance
- T096-T100: Mobile device testing (iOS Safari, Android Chrome)
- T101-T105: Theme switching validation
- T106-T110: Cross-browser compatibility testing
- T111-T115: Accessibility audit (WCAG 2.1 AA)

## Phase 3: Testing Strategy

### Unit Tests (MUST)
- Balance trend calculation accuracy
- Date grouping logic
- Starting balance calculation
- Data point generation for different period types

### Component Tests (MUST)
- Chart renders with sample data
- Chart type toggle switches between line/bar
- Tooltip shows correct data on hover
- Chart updates when period changes

### Integration Tests (MUST)
- Dashboard displays chart correctly
- Chart respects time period selector
- Chart theme matches application theme
- User preference persistence works

### Accessibility Tests (MUST)
- Keyboard navigation functional
- Screen reader announces chart data
- WCAG 2.1 AA contrast ratios met
- Focus indicators visible

### Performance Tests (MUST)
- Chart renders <1s with 365 data points
- No frame drops during interactions
- Bundle size increase <50KB gzipped

### Manual Tests (SHOULD)
- Test on iPhone Safari, Android Chrome
- Verify touch interactions smooth
- Check responsive breakpoints (320px, 768px, 1024px)
- Validate reduced-motion preference handling

## Success Metrics

1. **Functional Completeness**: All 5 functional requirements from CR-001 implemented ✅
2. **Performance**: Chart renders in <1s for 365 data points ✅
3. **Accessibility**: WCAG 2.1 AA compliance verified ✅
4. **Bundle Size**: Increase <50KB gzipped ✅
5. **Test Coverage**: 90%+ for calculation logic, 80%+ for components ✅
6. **User Validation**: Chart interpretable without instructions (manual testing) ✅

## Open Questions & Decisions

### Resolved in Phase 0
- [ ] Which charting library to use?
- [ ] Cumulative vs. period-relative balance?
- [ ] Data point counts for each period type?
- [ ] Zoom/pan controls or period filter only?
- [ ] Single balance line or multiple trend lines?

### Resolved in Phase 1
- [ ] Exact chart data structure?
- [ ] Service contract signatures?
- [ ] Integration approach with Dashboard?
- [ ] Theme color mapping strategy?

## Risk Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Charting library bundle too large | High | Medium | Research bundle sizes first; consider tree-shaking; fallback to minimal implementation |
| Performance issues with large datasets | High | Low | Memoization, data point limit, progressive rendering |
| Theme colors don't map well | Medium | Low | Test theme integration early; adjust color palette if needed |
| Accessibility challenges | High | Medium | Use semantic HTML, ARIA labels, keyboard support from start |
| Mobile touch interactions laggy | Medium | Low | Optimize event handlers, debounce, test on real devices early |

## Deployment Plan

1. **Development**: Implement on `003-balance-trends-chart` branch
2. **Testing**: Run full test suite + manual validation
3. **Review**: Self-review against constitution principles
4. **Merge**: Merge to `main` when Definition of Done met
5. **Monitor**: Check performance metrics in production
6. **Iterate**: Gather user feedback, add zoom/pan if requested

## Dependencies

### External
- Charting library (Chart.js 4.x or Recharts 2.x) - to be decided in Phase 0

### Internal
- `features/dashboard/services/calculationService.ts` (existing)
- `shared/contexts/TransactionContext.tsx` (existing)
- `shared/utils/dateUtils.ts` (existing)
- `shared/types/index.ts` (existing - may need chart types)
- `styles/themes.css` (existing - chart colors)

### No Breaking Changes
This feature is additive only - no modifications to existing data structures or APIs.

## Rollback Plan

If critical issues discovered post-deployment:
1. Remove `<BalanceTrendsChart>` from Dashboard.tsx
2. Revert commits on `main` branch
3. Fix issues on feature branch
4. Re-test and re-deploy

Chart is non-critical visualization - application remains fully functional without it.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
