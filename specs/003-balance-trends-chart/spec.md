# Change Request: Balance Trends Chart Visualization

**CR ID**: CR-001  
**Feature**: 001-expense-tracker  
**Created**: February 2, 2026  
**Status**: Proposed  
**Priority**: P2  
**User Request**: "as a user, I can see the chart that show money changed."

---

## Overview

Add a visual chart to the dashboard that displays how the user's balance (net worth) changes over time, helping users understand their financial trends at a glance.

---

## User Story

**As a user**, I want to see a line or bar chart showing how my balance has changed over time, **so that** I can visualize my financial progress and identify trends in my saving or spending behavior.

---

## Detailed Requirements

### FR-1: Balance Trends Chart Display
The dashboard shall display a chart showing balance changes over time based on the selected time period filter (day/week/month).

**Acceptance Criteria**:
- Chart displays cumulative balance (income minus expenses) over time
- X-axis shows time intervals appropriate to the selected filter
- Y-axis shows balance amount in currency
- Positive balance shown in one color (e.g., green), negative in another (e.g., red)
- Chart updates when time period filter changes

### FR-2: Chart Type Options
Users shall be able to view balance trends as either a line chart or bar chart.

**Acceptance Criteria**:
- Toggle control to switch between line and bar chart views
- User preference persists across sessions
- Both chart types display the same data accurately
- Smooth transitions between chart types

### FR-3: Interactive Data Points
Chart data points shall be interactive, showing detailed information on hover or tap.

**Acceptance Criteria**:
- Hovering/tapping a data point shows exact date and balance amount
- Tooltip includes income and expense breakdown for that period
- Touch-friendly for mobile devices
- Accessible keyboard navigation support

### FR-4: Time Period Filtering
Chart data shall respect the existing time period filter (daily/weekly/monthly).

**Acceptance Criteria**:
- **Daily view**: Shows balance at end of each day over the selected date range
- **Weekly view**: Shows balance at end of each week over the selected weeks
- **Monthly view**: Shows balance at end of each month over the selected months
- Chart automatically adjusts data granularity based on filter

### FR-5: Responsive Design
Chart shall be fully responsive and legible on all device sizes.

**Acceptance Criteria**:
- Chart scales appropriately on mobile, tablet, and desktop
- Labels remain readable at all screen sizes
- Touch interactions work smoothly on mobile
- Chart maintains aspect ratio without distortion

---

## Success Criteria

1. **Visual Clarity**: Users can immediately understand if their balance is trending up or down
2. **Performance**: Chart renders in under 1 second for up to 365 data points
3. **Accuracy**: Chart calculations match the dashboard summary totals exactly
4. **Usability**: 90% of test users can interpret the chart without explanation
5. **Accessibility**: Chart meets WCAG 2.1 AA standards for color contrast and keyboard navigation

---

## Assumptions

1. **Chart Library**: Will use a lightweight, accessible charting library (e.g., Chart.js, Recharts, or similar)
2. **Data Volume**: Chart performance optimized for up to 1 year of daily data (365 points)
3. **Starting Balance**: Balance calculation assumes zero starting balance at the beginning of transaction history
4. **Currency Format**: Uses the same currency formatting as existing transaction displays
5. **Theme Support**: Chart colors adapt to light/dark theme preferences
6. **Mobile First**: Chart interactions designed for touch first, mouse second

---

## Open Questions

[NEEDS CLARIFICATION: Should the chart show cumulative balance from the beginning of all transaction history, or reset to zero at the start of each selected time period?]

**Option A**: Cumulative balance from all time - shows true net worth over time  
**Option B**: Period-relative balance - resets to zero at period start, shows only changes within the period  
**Suggested Answer**: Option A (cumulative) is more useful for tracking overall financial health

[NEEDS CLARIFICATION: Should users be able to zoom into specific date ranges within the chart?]

**Option A**: Yes - add zoom/pan controls for detailed exploration  
**Option B**: No - rely on the existing time period filter for range selection  
**Suggested Answer**: Option B initially for simplicity, Option A as future enhancement

[NEEDS CLARIFICATION: Should the chart display only the balance line, or include separate income/expense trends?]

**Option A**: Single balance line only - cleaner, simpler visualization  
**Option B**: Multiple lines (balance, income, expense) - more comprehensive view  
**Suggested Answer**: Option A initially, with tooltip breakdown on hover

---

## Technical Notes

- Integration point: Dashboard component
- Estimated complexity: Medium (2-3 days)
- Dependencies: Charting library selection and integration
- Testing: Visual regression tests for chart rendering, unit tests for calculation accuracy
- Theme variables: Use existing CSS custom properties for colors

---

## Implementation Checklist

- [ ] Select and integrate charting library
- [ ] Create BalanceTrendsChart component
- [ ] Implement balance calculation service/utility
- [ ] Add chart type toggle (line/bar)
- [ ] Implement interactive tooltips
- [ ] Add responsive styles for all screen sizes
- [ ] Support light/dark theme colors
- [ ] Add keyboard navigation for accessibility
- [ ] Write unit tests for calculations
- [ ] Write component tests for interactions
- [ ] Update Dashboard to include chart
- [ ] Add user preference persistence for chart type
- [ ] Performance test with 365 data points
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Mobile device testing
