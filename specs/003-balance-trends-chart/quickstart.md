# Quickstart Guide: Balance Trends Chart

**Feature**: Balance Trends Chart Integration  
**Created**: February 3, 2026  
**Status**: ✅ Complete

---

## Overview

This quickstart guide provides integration examples and usage patterns for the Balance Trends Chart feature. Use this guide to understand how to integrate the chart into new or existing dashboard components.

---

## Table of Contents

1. [Quick Integration](#1-quick-integration)
2. [Component Usage](#2-component-usage)
3. [Hook Usage](#3-hook-usage)
4. [Service Usage](#4-service-usage)
5. [Styling & Theming](#5-styling--theming)
6. [Common Patterns](#6-common-patterns)
7. [Troubleshooting](#7-troubleshooting)

---

## 1. Quick Integration

### Minimal Setup (5 minutes)

Add the Balance Trends Chart to your dashboard in 3 simple steps:

**Step 1: Import the component**
```typescript
import { BalanceTrendsChart } from '@/features/dashboard/components/BalanceTrendsChart/BalanceTrendsChart';
```

**Step 2: Get transactions and period type**
```typescript
// Assuming you already have these from existing dashboard
const { transactions } = useTransactionStore();
const { periodType } = useTimePeriod();  // 'day', 'week', or 'month'
```

**Step 3: Render the chart**
```tsx
<BalanceTrendsChart 
  transactions={transactions} 
  periodType={periodType} 
/>
```

**Complete example**:
```tsx
import { BalanceTrendsChart } from '@/features/dashboard/components/BalanceTrendsChart/BalanceTrendsChart';
import { useTransactionStore } from '@/store/transactionStore';
import { useTimePeriod } from '@/hooks/useTimePeriod';

function DashboardPage() {
  const { transactions } = useTransactionStore();
  const { periodType } = useTimePeriod();

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      
      {/* Existing dashboard content */}
      <DashboardStats transactions={transactions} />
      
      {/* NEW: Balance Trends Chart */}
      <BalanceTrendsChart 
        transactions={transactions} 
        periodType={periodType} 
      />
      
      {/* Existing transaction list */}
      <TransactionList transactions={transactions} />
    </div>
  );
}
```

That's it! The chart will automatically:
- ✅ Calculate balance trends based on transactions
- ✅ Respond to period type changes (daily/weekly/monthly)
- ✅ Apply current theme (light/dark mode)
- ✅ Handle responsive design for mobile/tablet/desktop
- ✅ Persist user's chart type preference (line/bar)

---

## 2. Component Usage

### BalanceTrendsChart Component

**Location**: `src/features/dashboard/components/BalanceTrendsChart/BalanceTrendsChart.tsx`

**Props**:
```typescript
interface BalanceTrendsChartProps {
  transactions: Transaction[];     // Required: Array of all transactions
  periodType: 'day' | 'week' | 'month';  // Required: Time period type
  className?: string;               // Optional: Custom CSS class
  style?: React.CSSProperties;      // Optional: Inline styles
}
```

**Basic Usage**:
```tsx
<BalanceTrendsChart 
  transactions={transactions} 
  periodType="day" 
/>
```

**With Custom Styling**:
```tsx
<BalanceTrendsChart 
  transactions={transactions} 
  periodType="week" 
  className="my-custom-chart"
  style={{ marginTop: '2rem' }}
/>
```

**Component Features**:
- 📊 Automatic chart type toggle (line/bar)
- 🎨 Theme-aware colors (matches app theme)
- 📱 Responsive design (mobile-first)
- ♿ WCAG 2.1 AA compliant
- 💾 Persists user preferences
- ⚡ Optimized rendering (<1s for 365 points)

**Internal Structure**:
```tsx
<div className="balance-trends-chart">
  <div className="chart-header">
    <h3>Balance Trends</h3>
    <ChartTypeToggle />  {/* Line/Bar toggle */}
  </div>
  
  <div className="chart-container">
    <Chart.js />  {/* Rendered chart */}
  </div>
  
  <div className="chart-summary">
    {/* Summary statistics */}
  </div>
</div>
```

---

## 3. Hook Usage

### useBalanceTrends Hook

**Location**: `src/features/dashboard/hooks/useBalanceTrends.ts`

**Purpose**: Calculate balance trend data from transactions.

**Signature**:
```typescript
function useBalanceTrends(
  transactions: Transaction[],
  periodType: 'day' | 'week' | 'month'
): UseBalanceTrendsReturn
```

**Returns**:
```typescript
interface UseBalanceTrendsReturn {
  data: BalanceTrendData | null;  // Calculated trend data
  isLoading: boolean;              // Loading state (always false currently)
  error: Error | null;             // Error if calculation fails
}
```

**Basic Usage**:
```tsx
import { useBalanceTrends } from '@/features/dashboard/hooks/useBalanceTrends';

function MyComponent() {
  const { transactions } = useTransactionStore();
  const { data, isLoading, error } = useBalanceTrends(transactions, 'day');

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!data) return <EmptyState message="No transaction data available" />;

  return (
    <div>
      <p>Balance changed by {data.changePercentage.toFixed(2)}%</p>
      <p>Current balance: ${data.endingBalance.toFixed(2)}</p>
      {/* Render chart with data */}
    </div>
  );
}
```

**Advanced Usage with Memoization**:
```tsx
import { useMemo } from 'react';
import { useBalanceTrends } from '@/features/dashboard/hooks/useBalanceTrends';

function OptimizedChart() {
  const { transactions } = useTransactionStore();
  const periodType = 'month';
  
  // Hook already memoizes internally, but you can add additional memoization
  const { data, isLoading, error } = useBalanceTrends(transactions, periodType);
  
  const chartData = useMemo(() => {
    if (!data) return null;
    
    // Transform data for Chart.js format
    return {
      labels: data.points.map(p => p.date),
      datasets: [{
        label: 'Balance',
        data: data.points.map(p => p.balance),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
      }]
    };
  }, [data]);

  return <Line data={chartData} />;
}
```

**Hook Features**:
- ✅ Automatic recalculation on dependency changes
- ✅ Memoization (useMemo internally)
- ✅ Error handling
- ✅ Type-safe return values

---

## 4. Service Usage

### calculateBalanceTrend Service

**Location**: `src/features/dashboard/services/trendCalculationService.ts`

**Purpose**: Pure function to calculate balance trends (no React dependencies).

**Signature**:
```typescript
function calculateBalanceTrend(
  transactions: Transaction[],
  period: TimePeriod
): BalanceTrendData
```

**When to use directly**:
- ✅ Outside React components (e.g., Node.js scripts)
- ✅ Testing with specific dates
- ✅ Custom period calculations
- ✅ Data exports or reports

**Basic Usage**:
```typescript
import { calculateBalanceTrend } from '@/features/dashboard/services/trendCalculationService';

const transactions: Transaction[] = [
  /* ... your transactions ... */
];

const trendData = calculateBalanceTrend(transactions, {
  type: 'day',
  anchorDate: '2026-02-03'
});

console.log(`Current balance: $${trendData.endingBalance}`);
console.log(`30-day change: ${trendData.changePercentage.toFixed(2)}%`);
```

**Advanced Usage: Custom Date Range**:
```typescript
// Calculate trend for specific date (not today)
const historicalTrend = calculateBalanceTrend(transactions, {
  type: 'month',
  anchorDate: '2025-12-31'  // End of last year
});

console.log(`Balance on 2025-12-31: $${historicalTrend.endingBalance}`);
```

**Export to CSV Example**:
```typescript
import { calculateBalanceTrend } from '@/features/dashboard/services/trendCalculationService';

function exportTrendToCSV(transactions: Transaction[], periodType: 'day' | 'week' | 'month') {
  const trend = calculateBalanceTrend(transactions, {
    type: periodType,
    anchorDate: new Date().toISOString().split('T')[0]
  });

  const csv = [
    ['Date', 'Balance', 'Income', 'Expense', 'Transactions'],
    ...trend.points.map(p => [
      p.date,
      p.balance.toFixed(2),
      p.income.toFixed(2),
      p.expense.toFixed(2),
      p.transactionCount
    ])
  ].map(row => row.join(',')).join('\n');

  // Download CSV...
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `balance-trends-${periodType}.csv`;
  a.click();
}
```

---

## 5. Styling & Theming

### CSS Classes

The chart component uses the following CSS class structure:

```css
.balance-trends-chart {
  /* Main container */
}

.balance-trends-chart__header {
  /* Header with title and toggle */
}

.balance-trends-chart__title {
  /* Chart title */
}

.balance-trends-chart__controls {
  /* Toggle and filter controls */
}

.balance-trends-chart__container {
  /* Canvas container */
}

.balance-trends-chart__summary {
  /* Summary statistics footer */
}

.balance-trends-chart__empty {
  /* Empty state when no data */
}

.balance-trends-chart__error {
  /* Error state */
}
```

### Theme Variables

The chart uses CSS custom properties that match your application theme:

```css
:root {
  /* Colors */
  --chart-positive-color: var(--color-success);      /* Green for positive */
  --chart-negative-color: var(--color-danger);       /* Red for negative */
  --chart-grid-color: var(--color-border);           /* Grid lines */
  --chart-axis-color: var(--color-text-secondary);   /* Axis labels */
  
  /* Spacing */
  --chart-padding: 1rem;
  --chart-gap: 0.5rem;
  
  /* Heights */
  --chart-height-mobile: 300px;
  --chart-height-tablet: 350px;
  --chart-height-desktop: 400px;
}

[data-theme='dark'] {
  --chart-positive-color: #4ade80;  /* Brighter green for dark mode */
  --chart-negative-color: #f87171;  /* Brighter red for dark mode */
  --chart-grid-color: #374151;      /* Darker grid for dark mode */
}
```

### Custom Styling Examples

**Example 1: Increase chart height**
```tsx
<BalanceTrendsChart 
  transactions={transactions} 
  periodType="day" 
  style={{ 
    height: '500px'  // Override default 400px
  }}
/>
```

**Example 2: Add border and shadow**
```tsx
<BalanceTrendsChart 
  transactions={transactions} 
  periodType="week" 
  className="custom-chart"
/>
```

```css
.custom-chart {
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}
```

**Example 3: Full-width chart**
```tsx
<div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
  <BalanceTrendsChart 
    transactions={transactions} 
    periodType="month" 
  />
</div>
```

---

## 6. Common Patterns

### Pattern 1: Loading State

Handle loading while fetching transactions:

```tsx
function DashboardWithLoading() {
  const { transactions, isLoading } = useTransactionStore();
  const { periodType } = useTimePeriod();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <BalanceTrendsChart 
      transactions={transactions} 
      periodType={periodType} 
    />
  );
}
```

### Pattern 2: Empty State

Show friendly message when no transactions:

```tsx
function DashboardWithEmptyState() {
  const { transactions } = useTransactionStore();
  const { periodType } = useTimePeriod();

  if (transactions.length === 0) {
    return (
      <div className="empty-state">
        <p>No transactions yet. Add your first transaction to see trends!</p>
        <button>Add Transaction</button>
      </div>
    );
  }

  return (
    <BalanceTrendsChart 
      transactions={transactions} 
      periodType={periodType} 
    />
  );
}
```

### Pattern 3: Period Filter Integration

Sync with existing TimePeriodSelector:

```tsx
function DashboardWithFilter() {
  const { transactions } = useTransactionStore();
  const { periodType, setPeriodType } = useTimePeriod();

  return (
    <>
      {/* Existing period selector */}
      <TimePeriodSelector 
        selected={periodType} 
        onChange={setPeriodType} 
      />
      
      {/* Chart automatically updates when periodType changes */}
      <BalanceTrendsChart 
        transactions={transactions} 
        periodType={periodType} 
      />
    </>
  );
}
```

### Pattern 4: Side-by-Side with Stats

Combine chart with summary cards:

```tsx
function DashboardOverview() {
  const { transactions } = useTransactionStore();
  const { periodType } = useTimePeriod();
  const { data } = useBalanceTrends(transactions, periodType);

  return (
    <div className="dashboard-grid">
      {/* Summary cards */}
      <div className="stats-row">
        <StatCard 
          title="Current Balance" 
          value={data?.endingBalance} 
          format="currency" 
        />
        <StatCard 
          title="Period Change" 
          value={data?.change} 
          format="currency" 
          trend={data?.changePercentage > 0 ? 'up' : 'down'}
        />
        <StatCard 
          title="Change %" 
          value={data?.changePercentage} 
          format="percentage" 
        />
      </div>
      
      {/* Chart */}
      <div className="chart-row">
        <BalanceTrendsChart 
          transactions={transactions} 
          periodType={periodType} 
        />
      </div>
    </div>
  );
}
```

### Pattern 5: Chart Type Toggle

User preference for line vs bar chart:

```tsx
import { useChartPreference } from '@/features/dashboard/hooks/useChartPreference';

function DashboardWithToggle() {
  const { transactions } = useTransactionStore();
  const { periodType } = useTimePeriod();
  const { chartType, setChartType } = useChartPreference();

  return (
    <>
      {/* Manual toggle (optional - chart has built-in toggle) */}
      <div className="chart-controls">
        <button 
          onClick={() => setChartType('line')}
          className={chartType === 'line' ? 'active' : ''}
        >
          Line Chart
        </button>
        <button 
          onClick={() => setChartType('bar')}
          className={chartType === 'bar' ? 'active' : ''}
        >
          Bar Chart
        </button>
      </div>
      
      <BalanceTrendsChart 
        transactions={transactions} 
        periodType={periodType} 
      />
    </>
  );
}
```

### Pattern 6: Export Chart Data

Download chart data as CSV or image:

```tsx
import { exportTrendToCSV, exportChartImage } from '@/features/dashboard/utils/chartExportUtils';

function DashboardWithExport() {
  const { transactions } = useTransactionStore();
  const { periodType } = useTimePeriod();
  const { data } = useBalanceTrends(transactions, periodType);
  const chartRef = useRef<HTMLDivElement>(null);

  const handleExportCSV = () => {
    if (data) {
      exportTrendToCSV(data, periodType);
    }
  };

  const handleExportImage = () => {
    if (chartRef.current) {
      exportChartImage(chartRef.current, 'balance-trends.png');
    }
  };

  return (
    <>
      <div className="export-buttons">
        <button onClick={handleExportCSV}>Export CSV</button>
        <button onClick={handleExportImage}>Export Image</button>
      </div>
      
      <div ref={chartRef}>
        <BalanceTrendsChart 
          transactions={transactions} 
          periodType={periodType} 
        />
      </div>
    </>
  );
}
```

---

## 7. Troubleshooting

### Issue 1: Chart Not Rendering

**Symptoms**: Empty container, no chart visible

**Possible Causes**:
1. No transactions provided
2. Invalid periodType value
3. Container height is 0

**Solutions**:
```tsx
// ✅ Check transactions array
if (transactions.length === 0) {
  console.log('No transactions to display');
}

// ✅ Validate periodType
if (!['day', 'week', 'month'].includes(periodType)) {
  console.error('Invalid periodType:', periodType);
}

// ✅ Ensure container has height
<div style={{ minHeight: '400px' }}>
  <BalanceTrendsChart transactions={transactions} periodType={periodType} />
</div>
```

### Issue 2: Chart Not Updating

**Symptoms**: Chart doesn't change when transactions or period changes

**Possible Causes**:
1. Transactions array reference not changing
2. PeriodType state not updating
3. React memo blocking re-render

**Solutions**:
```tsx
// ✅ Force new array reference when transactions change
const memoizedTransactions = useMemo(() => [...transactions], [transactions]);

// ✅ Use key prop to force re-mount
<BalanceTrendsChart 
  key={`${periodType}-${transactions.length}`}
  transactions={transactions} 
  periodType={periodType} 
/>
```

### Issue 3: Performance Issues

**Symptoms**: Slow rendering, laggy interactions

**Possible Causes**:
1. Too many transactions (>100k)
2. Unnecessary re-renders
3. Heavy calculations not memoized

**Solutions**:
```tsx
// ✅ Memoize transactions
const memoizedTransactions = useMemo(() => transactions, [transactions]);

// ✅ Add React.memo to chart component
const MemoizedChart = React.memo(BalanceTrendsChart);

// ✅ Lazy load chart component
const BalanceTrendsChart = lazy(() => 
  import('@/features/dashboard/components/BalanceTrendsChart/BalanceTrendsChart')
);

<Suspense fallback={<LoadingSpinner />}>
  <BalanceTrendsChart transactions={transactions} periodType={periodType} />
</Suspense>
```

### Issue 4: Theme Colors Not Applied

**Symptoms**: Chart uses default colors instead of theme colors

**Possible Causes**:
1. CSS variables not defined
2. Theme attribute not set
3. Chart component loaded before theme

**Solutions**:
```tsx
// ✅ Ensure theme attribute is set
useEffect(() => {
  document.documentElement.setAttribute('data-theme', currentTheme);
}, [currentTheme]);

// ✅ Check CSS variables exist
console.log(
  getComputedStyle(document.documentElement)
    .getPropertyValue('--chart-positive-color')
);

// ✅ Force re-render on theme change
<BalanceTrendsChart 
  key={currentTheme}
  transactions={transactions} 
  periodType={periodType} 
/>
```

### Issue 5: Incorrect Balance Calculations

**Symptoms**: Balance doesn't match expected values

**Possible Causes**:
1. Transaction dates outside period range
2. Invalid transaction amounts
3. Incorrect period calculation

**Solutions**:
```tsx
// ✅ Validate transaction data
transactions.forEach(t => {
  if (!t.date || isNaN(t.amount)) {
    console.error('Invalid transaction:', t);
  }
});

// ✅ Check period calculation
const { data } = useBalanceTrends(transactions, periodType);
console.log('Period:', data?.period);
console.log('Points:', data?.points.length);
console.log('Expected points:', periodType === 'day' ? 30 : 12);

// ✅ Verify balance accuracy
const manualBalance = transactions
  .filter(t => t.date <= '2026-02-03')
  .reduce((sum, t) => 
    sum + (t.type === 'income' ? t.amount : -t.amount), 0
  );
console.log('Manual calculation:', manualBalance);
console.log('Chart calculation:', data?.endingBalance);
```

---

## 8. API Reference

For detailed API documentation, see:

- **Data Models**: [data-model.md](./data-model.md)
- **Service Contract**: [contracts/trend-service-contract.md](./contracts/trend-service-contract.md)
- **Component Props**: Section 2 above
- **Hook Interface**: Section 3 above

---

## 9. Examples Repository

Complete working examples are available in:

```
specs/003-balance-trends-chart/examples/
├── basic-integration.tsx          # Minimal setup
├── with-loading-state.tsx         # Loading handling
├── with-empty-state.tsx           # No data handling
├── with-period-filter.tsx         # Period selector integration
├── with-stats-cards.tsx           # Combined with summary stats
├── with-chart-toggle.tsx          # Chart type preference
├── with-export.tsx                # CSV/image export
└── custom-styling.tsx             # Custom themes and styles
```

*(Note: Examples will be created in Phase 15: Documentation & Final Testing)*

---

## 10. Need Help?

**Common Questions**:
- How do I change chart height? → See [Custom Styling Examples](#custom-styling-examples)
- How do I export data? → See [Pattern 6: Export Chart Data](#pattern-6-export-chart-data)
- Chart not updating? → See [Issue 2: Chart Not Updating](#issue-2-chart-not-updating)
- Performance problems? → See [Issue 3: Performance Issues](#issue-3-performance-issues)

**Additional Resources**:
- Chart.js documentation: https://www.chartjs.org/docs/
- React Chart.js 2 guide: https://react-chartjs-2.js.org/
- Project constitution: `.specify/constitution.md`

---

**Guide Status**: ✅ COMPLETE  
**Last Updated**: February 3, 2026  
**Next Step**: Begin Phase 3 implementation (T011-T029)
