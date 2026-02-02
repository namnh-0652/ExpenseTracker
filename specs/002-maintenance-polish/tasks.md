# Tasks: Maintenance & UI Polish Phase

**Input**: Design documents from `/specs/002-maintenance-polish/`  
**Prerequisites**: plan.md ✅, spec.md ✅

**Tests**: Not explicitly requested in specification - focus on implementation

**Organization**: Tasks grouped by user story for independent implementation and testing

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story label (US1, US2, US3, US4, US5, US6)
- All paths relative to repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create new directories and foundational files for theme system

- [X] T001 Create `src/shared/hooks/` directory for custom React hooks
- [X] T002 Create `src/styles/` directory for global theme and animation styles
- [X] T003 [P] Create `src/features/theme/` directory for theme provider and context

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before user stories

**⚠️ CRITICAL**: Complete before starting user story implementation

- [X] T004 Create `useLocalStorage.ts` generic hook in `src/shared/hooks/useLocalStorage.ts`
- [X] T005 [P] Create ThemeContext interface and types in `src/features/theme/ThemeContext.tsx`
- [X] T006 [P] Create theme constants (colors, spacing scale) in `src/shared/constants/theme.ts`

**Checkpoint**: Foundation ready - user stories can now be implemented in parallel

---

## Phase 3: User Story 1 - Code Quality & Type Safety (P1) 🎯 MVP

**Goal**: Eliminate all TypeScript errors across src/ and tests/ to ensure type safety

**Independent Test**: Run `npx tsc --noEmit` and verify zero errors. All 179+ tests pass.

### Audit TypeScript Errors

- [X] T007 [US1] Run `npx tsc --noEmit > ts-errors.log` to audit all TypeScript errors
- [X] T008 [US1] Categorize errors by file and type (missing types, any usage, incorrect types)

### Fix Type Errors in Shared Code

- [X] T009 [P] [US1] Fix TypeScript errors in `src/shared/types/` directory
- [X] T010 [P] [US1] Fix TypeScript errors in `src/shared/utils/` directory
- [X] T011 [P] [US1] Fix TypeScript errors in `src/shared/services/` directory
- [X] T012 [P] [US1] Add missing type definitions in `src/shared/constants/` directory

### Fix Type Errors in Features

- [X] T013 [P] [US1] Fix TypeScript errors in `src/features/dashboard/` components
- [X] T014 [P] [US1] Fix TypeScript errors in `src/features/transactions/` components
- [X] T015 [P] [US1] Fix TypeScript errors in `src/features/filters/` components
- [X] T016 [P] [US1] Fix TypeScript errors in `src/features/export/` components

### Fix Type Errors in Shared Components

- [X] T017 [P] [US1] Fix TypeScript errors in `src/shared/components/ConfirmDialog/`
- [X] T018 [P] [US1] Fix TypeScript errors in `src/shared/components/ErrorBoundary/`
- [X] T019 [P] [US1] Fix TypeScript errors in `src/App.tsx` and `src/main.tsx`

### Fix Type Errors in Tests

- [X] T020 [P] [US1] Fix TypeScript errors in `tests/features/dashboard/` test files
- [X] T021 [P] [US1] Fix TypeScript errors in `tests/features/transactions/` test files
- [X] T022 [P] [US1] Fix TypeScript errors in `tests/features/filters/` test files
- [X] T023 [P] [US1] Fix TypeScript errors in `tests/features/export/` test files
- [X] T024 [P] [US1] Fix TypeScript errors in `tests/shared/` test files
- [X] T025 [P] [US1] Fix TypeScript errors in `tests/App.test.tsx`

### Validation

- [X] T026 [US1] Run `npx tsc --noEmit` and confirm zero TypeScript errors
- [X] T027 [US1] Run `npm test` and confirm all 179+ tests pass
- [X] T028 [US1] Run `npm run build` and confirm successful production build

**Checkpoint**: Code Quality complete - TypeScript errors eliminated, all tests passing

---

## Phase 4: User Story 2 - Enhanced Application Layout (P2)

**Goal**: Add professional header and footer to establish proper application structure

**Independent Test**: Open app and verify header with branding and footer with credits visible on all views

### Header Component

- [X] T029 [P] [US2] Create Header component structure in `src/shared/components/Header/Header.tsx`
- [X] T030 [P] [US2] Create Header styles in `src/shared/components/Header/Header.css`
- [X] T031 [US2] Add app logo/icon (💰 emoji or SVG) to Header
- [X] T032 [US2] Add app title "Expense Tracker" to Header
- [X] T033 [US2] Add responsive styles for mobile (320px+) to Header.css

### Footer Component

- [X] T034 [P] [US2] Create Footer component structure in `src/shared/components/Footer/Footer.tsx`
- [X] T035 [P] [US2] Create Footer styles in `src/shared/components/Footer/Footer.css`
- [X] T036 [US2] Add version info and credits to Footer
- [X] T037 [US2] Add responsive styles for mobile (320px+) to Footer.css

### Integration

- [X] T038 [US2] Import and add Header component to `src/App.tsx` (top of layout)
- [X] T039 [US2] Import and add Footer component to `src/App.tsx` (bottom of layout)
- [X] T040 [US2] Update `src/App.css` to accommodate header/footer layout (flexbox column)
- [X] T041 [US2] Test header/footer visibility across all views and screen sizes

**Checkpoint**: Layout complete - Header and footer visible on all views

---

## Phase 5: User Story 3 - Tab-Based Navigation (P2)

**Goal**: Separate content into Dashboard, Transactions, and Filters tabs for focused UX

**Independent Test**: Click each tab and verify only relevant content displays for that section

### Tab Navigation Component

- [X] T042 [P] [US3] Create TabNav component structure in `src/shared/components/TabNav/TabNav.tsx`
- [X] T043 [P] [US3] Create TabNav styles in `src/shared/components/TabNav/TabNav.css`
- [X] T044 [US3] Implement three tabs: Dashboard, Transactions, Filters in TabNav
- [X] T045 [US3] Add active tab highlighting and hover states in TabNav.css
- [X] T046 [US3] Add keyboard navigation support (Tab, Enter, Arrow keys) to TabNav

### Tab State Management

- [X] T047 [US3] Add `activeTab` state to `src/App.tsx` (useState with 'dashboard' default)
- [X] T048 [US3] Implement tab change handler in `src/App.tsx`
- [X] T049 [US3] Use `useLocalStorage` hook to persist active tab preference
- [X] T050 [US3] Update localStorage key: `expense-tracker-active-tab`

### Content Organization

- [X] T051 [US3] Wrap dashboard content in conditional render (activeTab === 'dashboard')
- [X] T052 [US3] Wrap transactions content in conditional render (activeTab === 'transactions')
- [X] T053 [US3] Wrap filters content in conditional render (activeTab === 'filters')
- [X] T054 [US3] Add fade-in transition when tab content changes in `src/App.css`

### Content Distribution per Requirements

- [X] T055 [US3] Dashboard tab: Ensure summary cards, time filters, charts, recent transactions visible
- [X] T056 [US3] Transactions tab: Ensure transaction form, full list with edit/delete visible
- [X] T057 [US3] Filters tab: Ensure filter controls, export button, filtered results visible

### Integration

- [X] T058 [US3] Import and add TabNav component to `src/App.tsx` (below Header)
- [X] T059 [US3] Test tab switching across all three tabs
- [X] T060 [US3] Verify localStorage persistence (close/reopen browser)
- [X] T061 [US3] Test keyboard navigation for accessibility

**Checkpoint**: Tab Navigation complete - Three tabs working with persistence

---

## Phase 6: User Story 5 - Dark Theme (P3)

**Goal**: Implement theme toggle for light/dark modes with localStorage persistence

**Independent Test**: Toggle theme switcher and verify all UI adapts with proper contrast

**Note**: Implementing before US4 (celebration) as it affects all visual components

### Theme Provider Setup

- [ ] T062 [P] [US5] Create ThemeProvider component in `src/features/theme/ThemeProvider.tsx`
- [ ] T063 [P] [US5] Create useTheme custom hook in `src/shared/hooks/useTheme.ts`
- [ ] T064 [US5] Implement theme detection (prefers-color-scheme) on first visit
- [ ] T065 [US5] Implement theme persistence in localStorage: `expense-tracker-theme`

### Theme Styles

- [ ] T066 [P] [US5] Create `src/styles/themes.css` with CSS custom properties
- [ ] T067 [US5] Define light theme color palette in `:root` (themes.css)
- [ ] T068 [US5] Define dark theme color palette in `[data-theme="dark"]` (themes.css)
- [ ] T069 [US5] Ensure WCAG AA contrast ratios (4.5:1 minimum) for both themes
- [ ] T070 [US5] Import themes.css in `src/main.tsx` or `src/index.css`

### Theme Toggle UI

- [ ] T071 [US5] Add theme toggle button to Header component (moon/sun icon)
- [ ] T072 [US5] Add theme toggle styles and hover effects in `Header.css`
- [ ] T073 [US5] Connect toggle button to theme context `toggleTheme()` function

### Component Updates for Theme

- [ ] T074 [US5] Update `src/App.css` to use CSS custom properties (colors)
- [ ] T075 [US5] Update dashboard components to use theme variables
- [ ] T076 [US5] Update transaction components to use theme variables
- [ ] T077 [US5] Update filter components to use theme variables
- [ ] T078 [US5] Update shared components (ConfirmDialog, ErrorBoundary) to use theme variables
- [ ] T079 [US5] Update chart colors to adapt for dark theme (if using charts)

### Integration and Validation

- [ ] T080 [US5] Wrap App with ThemeProvider in `src/main.tsx`
- [ ] T081 [US5] Test theme toggle functionality (instant switch)
- [ ] T082 [US5] Test theme persistence (close/reopen browser)
- [ ] T083 [US5] Verify all text readable in both themes (contrast check)
- [ ] T084 [US5] Test on all tabs (Dashboard, Transactions, Filters)

**Checkpoint**: Dark Theme complete - Theme toggle working with full UI adaptation

---

## Phase 7: User Story 4 - Income Transaction Celebration (P3)

**Goal**: Add delightful celebration animation for income transactions only

**Independent Test**: Add income transaction and observe celebration animation

### Celebration Animation Component

- [ ] T085 [P] [US4] Create IncomeAnimation component in `src/shared/components/IncomeAnimation/IncomeAnimation.tsx`
- [ ] T086 [P] [US4] Create animation styles in `src/styles/animations.css` (keyframes for confetti/success burst)
- [ ] T087 [US4] Implement confetti particles or success burst effect with CSS/canvas
- [ ] T088 [US4] Add prefers-reduced-motion check to disable/simplify animation
- [ ] T089 [US4] Ensure animation is non-blocking (absolute positioned overlay)
- [ ] T090 [US4] Set animation duration to 2-3 seconds with auto-cleanup

### Integration

- [ ] T091 [US4] Add celebration state to `src/App.tsx` (showCelebration boolean)
- [ ] T092 [US4] Modify `addTransaction` handler to trigger celebration only for income type
- [ ] T093 [US4] Import and conditionally render IncomeAnimation component in App.tsx
- [ ] T094 [US4] Test celebration with income transaction (should trigger)
- [ ] T095 [US4] Test with expense transaction (should NOT trigger)
- [ ] T096 [US4] Test with prefers-reduced-motion enabled (should respect setting)
- [ ] T097 [US4] Test rapid multiple income additions (should handle gracefully)

**Checkpoint**: Income Celebration complete - Animation triggers for income only

---

## Phase 8: User Story 6 - General UI Polish (P3)

**Goal**: Refine visual design with consistent spacing, smooth transitions, and modern aesthetics

**Independent Test**: Review app for improved visual design, consistent spacing, smooth transitions

### Design System Foundation

- [ ] T098 [US6] Define spacing scale in `src/shared/constants/theme.ts` (4, 8, 16, 24, 32px)
- [ ] T099 [US6] Define transition timing standards (200ms ease-out) in theme.ts
- [ ] T100 [US6] Define color palette and ensure consistency across components
- [ ] T101 [US6] Update `src/index.css` with global transition defaults

### Hover and Interaction States

- [ ] T102 [P] [US6] Add hover states to all buttons with smooth transitions
- [ ] T103 [P] [US6] Add hover states to transaction list items
- [ ] T104 [P] [US6] Add hover states to filter controls
- [ ] T105 [P] [US6] Add hover states to tab navigation items
- [ ] T106 [US6] Add focus states for keyboard navigation across all interactive elements

### Smooth Transitions

- [ ] T107 [P] [US6] Add fade-in animation to dashboard cards on load
- [ ] T108 [P] [US6] Add smooth transitions to transaction form state changes
- [ ] T109 [P] [US6] Add smooth transitions to filter panel expand/collapse
- [ ] T110 [US6] Add transition to tab content switching (fade in/out)
- [ ] T111 [US6] Ensure all transitions respect prefers-reduced-motion

### Layout and Spacing Consistency

- [ ] T112 [US6] Audit and fix spacing inconsistencies in dashboard layout
- [ ] T113 [US6] Audit and fix spacing inconsistencies in transaction components
- [ ] T114 [US6] Audit and fix spacing inconsistencies in filter components
- [ ] T115 [US6] Ensure consistent card styling across all features
- [ ] T116 [US6] Ensure consistent typography (font sizes, weights, line heights)

### Final Polish

- [ ] T117 [US6] Add box-shadow for elevation on cards and modals
- [ ] T118 [US6] Refine color palette application (primary, secondary, accent colors)
- [ ] T119 [US6] Add loading states with skeleton screens or spinners
- [ ] T120 [US6] Polish transaction list visual hierarchy (amount, date, category)
- [ ] T121 [US6] Add empty states with helpful messaging where applicable

**Checkpoint**: UI Polish complete - Modern, consistent, professional appearance

---

## Phase 9: Final Integration & Validation

**Purpose**: Cross-cutting concerns and final quality checks

### Performance Optimization

- [ ] T122 Measure bundle size increase (must be <50KB gzipped)
- [ ] T123 Test animation performance on mid-range device (60fps target)
- [ ] T124 Optimize any heavy animations or large assets
- [ ] T125 Run Lighthouse audit and address performance issues

### Accessibility Validation

- [ ] T126 Verify WCAG AA contrast ratios in both themes (use contrast checker)
- [ ] T127 Test full keyboard navigation flow (Tab, Enter, Escape, Arrows)
- [ ] T128 Test with prefers-reduced-motion enabled (all animations disabled/simplified)
- [ ] T129 Test screen reader compatibility (ARIA labels, semantic HTML)

### Cross-Browser Testing

- [ ] T130 Test in Chrome (latest version)
- [ ] T131 Test in Firefox (latest version)
- [ ] T132 Test in Safari (latest version)
- [ ] T133 Test in Edge (latest version)

### Responsive Testing

- [ ] T134 Test on mobile (320px width - smallest viewport)
- [ ] T135 Test on tablet (768px width)
- [ ] T136 Test on desktop (1440px width)
- [ ] T137 Test header/footer responsiveness across all breakpoints

### Integration Testing

- [ ] T138 Run full test suite and ensure 179+ tests pass
- [ ] T139 Perform manual end-to-end test of all user stories
- [ ] T140 Test localStorage persistence (theme + tab preference)
- [ ] T141 Test error boundaries catch errors gracefully

### Documentation Updates

- [ ] T142 Update README.md with new features (header, footer, tabs, theme, animation)
- [ ] T143 Document theme implementation and how to extend colors
- [ ] T144 Document tab navigation structure for future developers
- [ ] T145 Add screenshots to README showing light/dark themes

### Final Commit

- [ ] T146 Review all changes and ensure no debug code remains
- [ ] T147 Run final build: `npm run build`
- [ ] T148 Commit all changes with descriptive message
- [ ] T149 Create pull request from 002-maintenance-polish to main

---

## Summary

**Total Tasks**: 149

### Tasks by User Story:
- **Setup**: 3 tasks
- **Foundational**: 3 tasks
- **US1 - Code Quality** (P1): 22 tasks (T007-T028)
- **US2 - Layout** (P2): 13 tasks (T029-T041)
- **US3 - Tab Navigation** (P2): 20 tasks (T042-T061)
- **US5 - Dark Theme** (P3): 23 tasks (T062-T084) *[implemented before US4]*
- **US4 - Income Celebration** (P3): 13 tasks (T085-T097)
- **US6 - UI Polish** (P3): 24 tasks (T098-T121)
- **Final Integration**: 28 tasks (T122-T149)

### Parallel Opportunities:
- Phase 1: All 3 tasks can run in parallel
- Phase 2: T005, T006 can run in parallel after T004
- US1: T009-T012, T013-T016, T017-T018, T020-T025 (groups can parallelize)
- US2: T029-T030, T034-T035 can run in parallel
- US3: T042-T043 can run in parallel
- US5: T062-T063, T066, T074-T079 (many can parallelize after foundation)
- US6: Most implementation tasks (T102-T116) can parallelize

### Dependencies:
- **US2, US3, US4, US5, US6** depend on **US1** (code quality must be fixed first)
- **US3** partially depends on **US2** (header provides location for tab nav)
- **US5** should complete before **US6** (theme affects all polish work)
- **US4** can be implemented independently after US1

### Suggested MVP:
Complete through **Phase 5** (US1 + US2 + US3) for minimum viable improved product:
- All TS errors fixed (stable foundation)
- Professional layout with header/footer
- Tab-based navigation for better UX

Then iterate with US5 (theme), US4 (celebration), US6 (polish) as enhancements.

---

## Implementation Strategy

1. **Start with US1 (Code Quality)** - This is mandatory before any other work
2. **Implement US2 (Layout)** - Establishes structure for all other features
3. **Implement US3 (Tabs)** - Core UX improvement
4. **Implement US5 (Theme)** - Do before US6 as it affects all visual components
5. **Implement US4 (Celebration)** - Independent feature, can be done anytime after US1
6. **Implement US6 (Polish)** - Final refinement across all features
7. **Final validation** - Performance, accessibility, cross-browser testing

**Note**: Many tasks within each phase can be parallelized (marked with [P]). Focus on completing one user story at a time for incremental, testable progress.
