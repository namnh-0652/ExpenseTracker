# Data Model: Balance Trends Chart

**Feature**: Balance Trends Chart Visualization  
**Created**: February 3, 2026  
**Status**: ✅ Complete

---

## Overview

This document defines all data structures and TypeScript interfaces used in the balance trends chart feature. These interfaces ensure type safety and provide clear contracts between components, services, and hooks.

---

## 1. Balance Trend Data Structures

### BalanceTrendPoint

Represents a single data point in the balance trend chart.

```typescript
interface BalanceTrendPoint {
  /**
   * Date for this data point (ISO 8601 format: YYYY-MM-DD)
   * Represents the end of the period (day/week/month)
   */
  date: string;

  /**
   * Cumulative balance at the end of this date
   * Calculated as: starting balance + all income - all expenses up to this date
   * Can be positive (net gain) or negative (net loss)
   */
  balance: number;

  /**
   * Total income received on this date (or during this period)
   * Always positive or zero
   */
  income: number;

  /**
   * Total expenses paid on this date (or during this period)
   * Always positive or zero (stored as positive, deducted from balance)
   */
  expense: number;

  /**
   * Number of transactions recorded on this date (or during this period)
   * Includes both income and expense transactions
   */
  transactionCount: number;
}
```

**Example**:
```typescript
{
  date: '2026-02-03',
  balance: 5250.50,      // Cumulative balance at end of day
  income: 200.00,        // Income received on this day
  expense: 50.00,        // Expenses paid on this day
  transactionCount: 3    // 3 transactions on this day
}
```

---

### BalanceTrendData

Complete dataset for rendering the balance trend chart.

```typescript
interface BalanceTrendData {
  /**
   * Array of data points to plot on the chart
   * Ordered chronologically from oldest to newest
   * Length depends on period type: 30 (daily), 12 (weekly/monthly)
   */
  points: BalanceTrendPoint[];

  /**
   * Time period information for this dataset
   */
  period: {
    /**
     * Start date of the period (ISO 8601: YYYY-MM-DD)
     */
    start: string;

    /**
     * End date of the period (ISO 8601: YYYY-MM-DD)
     */
    end: string;

    /**
     * Type of time period
     * - 'day': Daily data points (last 30 days)
     * - 'week': Weekly data points (last 12 weeks)
     * - 'month': Monthly data points (last 12 months)
     */
    type: 'day' | 'week' | 'month';
  };

  /**
   * Cumulative balance at the start of the period
   * Calculated from all transactions before period.start
   * Used as baseline for trend calculation
   */
  startingBalance: number;

  /**
   * Cumulative balance at the end of the period
   * Should equal: startingBalance + sum(income) - sum(expense) for all points
   */
  endingBalance: number;

  /**
   * Net change in balance over the period
   * Calculated as: endingBalance - startingBalance
   * Positive = financial gain, Negative = financial loss
   */
  change: number;

  /**
   * Percentage change in balance over the period
   * Calculated as: (change / abs(startingBalance)) * 100
   * Handles division by zero (returns 0 if startingBalance is 0)
   * Can exceed 100% for large gains or losses
   */
  changePercentage: number;
}
```

**Example**:
```typescript
{
  points: [
    { date: '2026-01-04', balance: 5000, income: 100, expense: 50, transactionCount: 2 },
    { date: '2026-01-05', balance: 5150, income: 200, expense: 50, transactionCount: 3 },
    // ... 28 more points for 30-day view
  ],
  period: {
    start: '2026-01-04',
    end: '2026-02-03',
    type: 'day'
  },
  startingBalance: 4950.00,
  endingBalance: 5250.50,
  change: 300.50,
  changePercentage: 6.07  // (300.50 / 4950) * 100
}
```

---

## 2. Chart Configuration Types

### ChartType

Type of chart visualization to display.

```typescript
type ChartType = 'line' | 'bar';
```

**Usage**:
- `'line'`: Line chart - best for showing trends and continuous data
- `'bar'`: Bar chart - best for comparing discrete periods

---

### ChartTheme

Theme mode for color customization.

```typescript
type ChartTheme = 'light' | 'dark';
```

**Usage**:
- Matches application theme from `data-theme` attribute
- Controls chart colors, grid lines, axis labels, tooltips

---

### ChartConfig

Complete configuration object for chart rendering.

```typescript
interface ChartConfig {
  /**
   * Type of chart to render
   */
  type: ChartType;

  /**
   * Theme mode (controls colors)
   */
  theme: ChartTheme;

  /**
   * Chart height in pixels
   * Default: 400 (desktop), 300 (mobile)
   */
  height: number;

  /**
   * Enable responsive behavior (adjusts to container width)
   * Should always be true for responsive design
   */
  responsive: boolean;

  /**
   * Maintain aspect ratio when resizing
   * Set to false to allow height changes independently
   */
  maintainAspectRatio: boolean;

  /**
   * Interaction configuration
   */
  interaction: {
    /**
     * Enable tooltips on hover/tap
     */
    tooltipEnabled: boolean;

    /**
     * Enable hover effects on data points
     */
    hoverEffects: boolean;

    /**
     * Intersection mode for tooltips
     * - 'point': Show tooltip for exact point under cursor
     * - 'index': Show tooltip for all points at same x-axis index
     * - 'nearest': Show tooltip for nearest point
     */
    intersect: 'point' | 'index' | 'nearest';
  };

  /**
   * Animation configuration
   */
  animation: {
    /**
     * Enable chart animations
     * Respects prefers-reduced-motion user preference
     */
    enabled: boolean;

    /**
     * Animation duration in milliseconds
     */
    duration: number;

    /**
     * Easing function for animations
     */
    easing: 'linear' | 'easeInOut' | 'easeOut';
  };
}
```

**Default Configuration**:
```typescript
const DEFAULT_CHART_CONFIG: ChartConfig = {
  type: 'line',
  theme: 'light',
  height: 400,
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    tooltipEnabled: true,
    hoverEffects: true,
    intersect: 'index'
  },
  animation: {
    enabled: true,
    duration: 300,
    easing: 'easeOut'
  }
};
```

---

### ChartColors

Color scheme for chart elements based on theme.

```typescript
interface ChartColors {
  /**
   * Primary line/bar color (for positive balance)
   * Maps to: var(--color-success) in light/dark theme
   */
  positive: string;

  /**
   * Secondary line/bar color (for negative balance)
   * Maps to: var(--color-danger) in light/dark theme
   */
  negative: string;

  /**
   * Grid line color
   * Maps to: var(--color-border) in light/dark theme
   */
  gridLines: string;

  /**
   * Axis label color (x-axis and y-axis)
   * Maps to: var(--color-text-secondary) in light/dark theme
   */
  axisLabels: string;

  /**
   * Axis line color (x-axis and y-axis lines)
   * Maps to: var(--color-border) in light/dark theme
   */
  axisLines: string;

  /**
   * Tooltip background color
   * Maps to: var(--color-surface) in light/dark theme
   */
  tooltipBackground: string;

  /**
   * Tooltip text color
   * Maps to: var(--color-text-primary) in light/dark theme
   */
  tooltipText: string;

  /**
   * Tooltip border color
   * Maps to: var(--color-border) in light/dark theme
   */
  tooltipBorder: string;
}
```

**Example (Light Theme)**:
```typescript
{
  positive: '#22c55e',      // green
  negative: '#ef4444',      // red
  gridLines: '#e5e7eb',     // light gray
  axisLabels: '#6b7280',    // gray
  axisLines: '#e5e7eb',     // light gray
  tooltipBackground: '#ffffff',
  tooltipText: '#111827',   // dark gray
  tooltipBorder: '#e5e7eb'
}
```

**Example (Dark Theme)**:
```typescript
{
  positive: '#4ade80',      // brighter green
  negative: '#f87171',      // brighter red
  gridLines: '#374151',     // dark gray
  axisLabels: '#cbd5e0',    // light gray
  axisLines: '#374151',     // dark gray
  tooltipBackground: '#1a202c',
  tooltipText: '#ffffff',
  tooltipBorder: '#374151'
}
```

---

## 3. Component Props Interfaces

### BalanceTrendsChartProps

Props for the main BalanceTrendsChart component.

```typescript
interface BalanceTrendsChartProps {
  /**
   * Array of all transactions
   * Component will filter and calculate trends internally
   */
  transactions: Transaction[];

  /**
   * Current time period type from TimePeriodSelector
   */
  periodType: 'day' | 'week' | 'month';

  /**
   * Optional CSS class name for custom styling
   */
  className?: string;

  /**
   * Optional inline styles
   */
  style?: React.CSSProperties;
}
```

---

### ChartTypeToggleProps

Props for the ChartTypeToggle component.

```typescript
interface ChartTypeToggleProps {
  /**
   * Currently selected chart type
   */
  selectedType: ChartType;

  /**
   * Callback fired when chart type changes
   * @param type - New chart type selected
   */
  onTypeChange: (type: ChartType) => void;

  /**
   * Optional CSS class name
   */
  className?: string;
}
```

---

## 4. Hook Return Types

### UseBalanceTrendsReturn

Return type for the useBalanceTrends custom hook.

```typescript
interface UseBalanceTrendsReturn {
  /**
   * Calculated balance trend data
   * Null if no transactions or calculation in progress
   */
  data: BalanceTrendData | null;

  /**
   * Loading state (for async calculations)
   * Currently always false (calculations are synchronous)
   * Included for future enhancement if calculations move to worker
   */
  isLoading: boolean;

  /**
   * Error state if calculation fails
   * Null if no error
   */
  error: Error | null;
}
```

**Usage**:
```typescript
const { data, isLoading, error } = useBalanceTrends(transactions, periodType);

if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
if (!data) return <EmptyState />;

return <Chart data={data} />;
```

---

## 5. Service Function Signatures

### calculateBalanceTrend

Main function to calculate balance trend data.

```typescript
function calculateBalanceTrend(
  transactions: Transaction[],
  period: TimePeriod
): BalanceTrendData
```

**Parameters**:
- `transactions`: Array of all transactions (will be filtered by date range)
- `period`: Time period specification (type and anchor date)

**Returns**: Complete BalanceTrendData object with all calculated values

**Throws**: Error if invalid period type or date format

---

### groupTransactionsByDate

Helper function to aggregate transactions by date.

```typescript
function groupTransactionsByDate(
  transactions: Transaction[],
  dateRange: DateRange,
  groupBy: 'day' | 'week' | 'month'
): Map<string, TransactionGroup>
```

**Parameters**:
- `transactions`: Transactions to group
- `dateRange`: Start and end dates for filtering
- `groupBy`: Grouping granularity

**Returns**: Map with date strings as keys, aggregated data as values

---

### calculateStartingBalance

Helper function to calculate balance before period starts.

```typescript
function calculateStartingBalance(
  transactions: Transaction[],
  periodStart: string
): number
```

**Parameters**:
- `transactions`: All transactions (including those before period)
- `periodStart`: Period start date (ISO 8601)

**Returns**: Cumulative balance from all transactions before periodStart

---

## 6. Supporting Types

### TimePeriod

Time period specification for calculations.

```typescript
interface TimePeriod {
  /**
   * Type of time period
   */
  type: 'day' | 'week' | 'month';

  /**
   * Anchor date for period calculation (ISO 8601: YYYY-MM-DD)
   * Period is calculated relative to this date
   * Typically "today" for current period
   */
  anchorDate: string;
}
```

---

### DateRange

Date range specification.

```typescript
interface DateRange {
  /**
   * Start date (inclusive, ISO 8601: YYYY-MM-DD)
   */
  start: string;

  /**
   * End date (inclusive, ISO 8601: YYYY-MM-DD)
   */
  end: string;
}
```

---

### TransactionGroup

Aggregated transaction data for a single period.

```typescript
interface TransactionGroup {
  /**
   * Total income in this group
   */
  income: number;

  /**
   * Total expenses in this group
   */
  expense: number;

  /**
   * Number of transactions in this group
   */
  count: number;
}
```

---

## 7. Existing Types (Reference)

### Transaction

Existing transaction type from shared types.

```typescript
interface Transaction {
  id: string;
  amount: number;
  date: string;              // ISO 8601: YYYY-MM-DD
  type: 'income' | 'expense';
  categoryId: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}
```

**Note**: This type already exists in `src/shared/types/index.ts`. No changes needed.

---

## 8. Validation Rules

### Data Integrity Constraints

1. **Balance Calculation Accuracy**:
   ```typescript
   // Must always be true:
   points[i].balance === 
     startingBalance + 
     sum(points[0..i].income) - 
     sum(points[0..i].expense)
   ```

2. **Point Ordering**:
   ```typescript
   // Points must be chronologically ordered:
   points[i].date < points[i+1].date
   ```

3. **Non-Negative Income/Expense**:
   ```typescript
   point.income >= 0
   point.expense >= 0
   point.transactionCount >= 0
   ```

4. **Change Consistency**:
   ```typescript
   change === endingBalance - startingBalance
   ```

5. **Percentage Calculation**:
   ```typescript
   if (startingBalance === 0) {
     changePercentage = 0;  // Avoid division by zero
   } else {
     changePercentage = (change / Math.abs(startingBalance)) * 100;
   }
   ```

---

## 9. Performance Considerations

### Data Point Limits

- **Daily view**: Maximum 30 points
- **Weekly view**: Maximum 12 points
- **Monthly view**: Maximum 12 points

**Rationale**: Keeps chart rendering under 1-second target with 365-point capability.

### Calculation Complexity

- **Time Complexity**: O(n) where n = number of transactions
- **Space Complexity**: O(p) where p = number of data points (≤30)
- **Memoization**: Results cached by useMemo in useBalanceTrends hook

---

## 10. Type Safety Examples

### Valid Usage

```typescript
// ✅ Valid: All required fields present
const point: BalanceTrendPoint = {
  date: '2026-02-03',
  balance: 5000.50,
  income: 200,
  expense: 50,
  transactionCount: 3
};

// ✅ Valid: Using helper type
const period: TimePeriod = {
  type: 'day',
  anchorDate: new Date().toISOString().split('T')[0]
};
```

### Invalid Usage (Caught by TypeScript)

```typescript
// ❌ TypeScript Error: Missing required field
const point: BalanceTrendPoint = {
  date: '2026-02-03',
  balance: 5000.50,
  // Missing: income, expense, transactionCount
};

// ❌ TypeScript Error: Invalid period type
const period: TimePeriod = {
  type: 'quarter',  // Not in 'day' | 'week' | 'month'
  anchorDate: '2026-02-03'
};

// ❌ TypeScript Error: Wrong type for balance
const point: BalanceTrendPoint = {
  date: '2026-02-03',
  balance: '5000.50',  // Should be number, not string
  income: 200,
  expense: 50,
  transactionCount: 3
};
```

---

## 11. Migration Notes

### Changes from Existing Types

**No breaking changes**: All existing types remain unchanged.

**New types added**:
- BalanceTrendPoint
- BalanceTrendData
- ChartConfig
- ChartColors
- ChartType
- ChartTheme
- UseBalanceTrendsReturn
- TimePeriod (extension of existing)
- TransactionGroup

**Reused existing types**:
- Transaction (from shared types)
- DateRange (from calculationService)

---

## 12. Future Extensions

### Potential Additions (Not in Current Scope)

```typescript
// Multi-line chart support
interface BalanceTrendPoint {
  // ... existing fields
  incomeBalance?: number;   // Separate income trend line
  expenseBalance?: number;  // Separate expense trend line
}

// Forecast data
interface BalanceForecast {
  predictedPoints: BalanceTrendPoint[];
  confidenceInterval: {
    upper: number;
    lower: number;
  };
}

// Chart export configuration
interface ChartExportConfig {
  format: 'png' | 'svg' | 'pdf';
  width: number;
  height: number;
  includeTitle: boolean;
}
```

---

**Document Status**: ✅ COMPLETE  
**Total Interfaces Defined**: 15  
**Type Safety Level**: Strict  
**Next Document**: contracts/trend-service-contract.md
