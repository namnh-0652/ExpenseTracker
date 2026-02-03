# Service Contract: Balance Trend Calculation

**Service**: Balance Trend Calculation Service  
**Location**: `src/features/dashboard/services/trendCalculationService.ts`  
**Created**: February 3, 2026  
**Status**: ✅ Complete

---

## Overview

This service contract defines the interface for calculating balance trend data from transaction history. It specifies function signatures, input/output contracts, error handling, and performance requirements.

---

## 1. Primary Service Function

### calculateBalanceTrend

**Purpose**: Calculate balance trend data for a given time period.

**Signature**:
```typescript
function calculateBalanceTrend(
  transactions: Transaction[],
  period: TimePeriod
): BalanceTrendData
```

**Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `transactions` | `Transaction[]` | ✅ | Array of all user transactions (will be filtered internally) |
| `period` | `TimePeriod` | ✅ | Time period specification with type and anchor date |

**Returns**: `BalanceTrendData`
- Complete balance trend dataset including points, period info, and summary statistics
- See [data-model.md](../data-model.md#balancetrenddata) for full interface

**Throws**:
- `Error('Invalid period type')` - If period.type is not 'day', 'week', or 'month'
- `Error('Invalid anchor date')` - If period.anchorDate is not valid ISO 8601 format
- `Error('Future anchor date not allowed')` - If period.anchorDate is after today

**Behavior**:
1. Validates period.type and period.anchorDate
2. Calculates date range based on period (30 days, 12 weeks, or 12 months)
3. Filters transactions within date range
4. Groups transactions by date/week/month
5. Calculates cumulative balance for each point
6. Computes summary statistics (starting, ending, change, percentage)
7. Returns complete BalanceTrendData object

**Example Usage**:
```typescript
const transactions: Transaction[] = [
  { id: '1', date: '2026-01-15', amount: 100, type: 'income', /* ... */ },
  { id: '2', date: '2026-01-20', amount: 50, type: 'expense', /* ... */ },
  // ... more transactions
];

const period: TimePeriod = {
  type: 'day',
  anchorDate: '2026-02-03'
};

const trendData = calculateBalanceTrend(transactions, period);

// Result:
// {
//   points: [/* 30 BalanceTrendPoint objects */],
//   period: { start: '2026-01-04', end: '2026-02-03', type: 'day' },
//   startingBalance: 4950.00,
//   endingBalance: 5250.50,
//   change: 300.50,
//   changePercentage: 6.07
// }
```

**Performance Requirements**:
- Time complexity: O(n) where n = number of transactions
- Max execution time: <100ms for 10,000 transactions
- Memory usage: O(p) where p = number of points (≤30)

**Test Coverage**:
- Unit tests: T011-T022 (12 tests)
- Target coverage: >90%

---

## 2. Helper Functions

### 2.1 calculateDateRange

**Purpose**: Calculate start and end dates for a given period type.

**Signature**:
```typescript
function calculateDateRange(
  periodType: 'day' | 'week' | 'month',
  anchorDate: string
): DateRange
```

**Parameters**:
- `periodType`: Type of period ('day', 'week', or 'month')
- `anchorDate`: Reference date for calculation (ISO 8601: YYYY-MM-DD)

**Returns**: `DateRange` object with start and end dates

**Logic**:
- **Daily**: Last 30 days ending on anchorDate
  - `start = anchorDate - 29 days`
  - `end = anchorDate`
- **Weekly**: Last 12 weeks (84 days) ending on anchorDate
  - `start = anchorDate - 83 days`
  - `end = anchorDate`
- **Monthly**: Last 12 months ending on anchorDate
  - `start = first day of (anchorDate - 11 months)`
  - `end = anchorDate`

**Example**:
```typescript
calculateDateRange('day', '2026-02-03');
// Returns: { start: '2026-01-05', end: '2026-02-03' }

calculateDateRange('week', '2026-02-03');
// Returns: { start: '2025-11-12', end: '2026-02-03' }

calculateDateRange('month', '2026-02-03');
// Returns: { start: '2025-02-01', end: '2026-02-03' }
```

---

### 2.2 filterTransactionsByDateRange

**Purpose**: Filter transactions within a date range (inclusive).

**Signature**:
```typescript
function filterTransactionsByDateRange(
  transactions: Transaction[],
  dateRange: DateRange
): Transaction[]
```

**Parameters**:
- `transactions`: Array of all transactions
- `dateRange`: Start and end dates for filtering

**Returns**: Filtered array of transactions where `dateRange.start ≤ transaction.date ≤ dateRange.end`

**Example**:
```typescript
const filtered = filterTransactionsByDateRange(transactions, {
  start: '2026-01-01',
  end: '2026-01-31'
});
// Returns only transactions in January 2026
```

---

### 2.3 groupTransactionsByPeriod

**Purpose**: Group transactions by date/week/month.

**Signature**:
```typescript
function groupTransactionsByPeriod(
  transactions: Transaction[],
  periodType: 'day' | 'week' | 'month'
): Map<string, TransactionGroup>
```

**Parameters**:
- `transactions`: Filtered transactions to group
- `periodType`: Grouping granularity

**Returns**: Map with date keys (ISO 8601) and aggregated TransactionGroup values

**Grouping Logic**:
- **Daily**: Group by exact date (YYYY-MM-DD)
- **Weekly**: Group by Monday of week (YYYY-MM-DD of Monday)
- **Monthly**: Group by first day of month (YYYY-MM-01)

**Example**:
```typescript
const grouped = groupTransactionsByPeriod(transactions, 'day');

// Result:
// Map {
//   '2026-01-05' => { income: 100, expense: 50, count: 2 },
//   '2026-01-06' => { income: 0, expense: 75, count: 1 },
//   '2026-01-07' => { income: 200, expense: 100, count: 3 }
// }
```

---

### 2.4 calculateStartingBalance

**Purpose**: Calculate cumulative balance before period starts.

**Signature**:
```typescript
function calculateStartingBalance(
  transactions: Transaction[],
  periodStart: string
): number
```

**Parameters**:
- `transactions`: All transactions (including those before period)
- `periodStart`: Start date of period (ISO 8601)

**Returns**: Cumulative balance from all transactions with `date < periodStart`

**Calculation**:
```typescript
startingBalance = sum(income) - sum(expense) 
  for all transactions where date < periodStart
```

**Example**:
```typescript
// Transactions before 2026-01-05:
// - 2025-12-01: +500 (income)
// - 2025-12-15: -100 (expense)
// - 2026-01-01: +200 (income)

calculateStartingBalance(transactions, '2026-01-05');
// Returns: 500 - 100 + 200 = 600
```

---

### 2.5 generateBalanceTrendPoints

**Purpose**: Generate array of BalanceTrendPoint objects with cumulative balances.

**Signature**:
```typescript
function generateBalanceTrendPoints(
  groupedTransactions: Map<string, TransactionGroup>,
  dateRange: DateRange,
  periodType: 'day' | 'week' | 'month',
  startingBalance: number
): BalanceTrendPoint[]
```

**Parameters**:
- `groupedTransactions`: Map of grouped transaction data
- `dateRange`: Date range for points
- `periodType`: Type of period (affects point spacing)
- `startingBalance`: Initial balance before first point

**Returns**: Array of BalanceTrendPoint objects, ordered chronologically

**Logic**:
1. Generate list of all dates in range (based on periodType)
2. For each date:
   - Get grouped data (or use { income: 0, expense: 0, count: 0 } if no transactions)
   - Calculate cumulative balance: `previousBalance + income - expense`
   - Create BalanceTrendPoint object
3. Return ordered array

**Example**:
```typescript
const points = generateBalanceTrendPoints(
  groupedTransactions,
  { start: '2026-01-05', end: '2026-01-07' },
  'day',
  1000  // starting balance
);

// Result:
// [
//   { date: '2026-01-05', balance: 1050, income: 100, expense: 50, transactionCount: 2 },
//   { date: '2026-01-06', balance: 975, income: 0, expense: 75, transactionCount: 1 },
//   { date: '2026-01-07', balance: 1075, income: 200, expense: 100, transactionCount: 3 }
// ]
```

---

### 2.6 calculateSummaryStatistics

**Purpose**: Calculate summary statistics for trend data.

**Signature**:
```typescript
function calculateSummaryStatistics(
  points: BalanceTrendPoint[],
  startingBalance: number
): {
  endingBalance: number;
  change: number;
  changePercentage: number;
}
```

**Parameters**:
- `points`: Array of balance trend points
- `startingBalance`: Balance before first point

**Returns**: Object with summary statistics

**Calculation**:
```typescript
endingBalance = points[points.length - 1].balance
change = endingBalance - startingBalance
changePercentage = startingBalance === 0 
  ? 0 
  : (change / Math.abs(startingBalance)) * 100
```

**Example**:
```typescript
const stats = calculateSummaryStatistics(points, 1000);

// If last point balance is 1075:
// {
//   endingBalance: 1075,
//   change: 75,            // 1075 - 1000
//   changePercentage: 7.5  // (75 / 1000) * 100
// }
```

---

## 3. Utility Functions

### 3.1 getWeekStartDate

**Purpose**: Get the Monday of the week containing a given date.

**Signature**:
```typescript
function getWeekStartDate(date: string): string
```

**Parameters**:
- `date`: Any date (ISO 8601: YYYY-MM-DD)

**Returns**: Monday of that week (ISO 8601: YYYY-MM-DD)

**Example**:
```typescript
getWeekStartDate('2026-02-03');  // Tuesday
// Returns: '2026-02-02'  // Monday of that week
```

---

### 3.2 getMonthStartDate

**Purpose**: Get the first day of the month containing a given date.

**Signature**:
```typescript
function getMonthStartDate(date: string): string
```

**Parameters**:
- `date`: Any date (ISO 8601: YYYY-MM-DD)

**Returns**: First day of that month (YYYY-MM-01)

**Example**:
```typescript
getMonthStartDate('2026-02-15');
// Returns: '2026-02-01'
```

---

### 3.3 addDays

**Purpose**: Add a number of days to a date.

**Signature**:
```typescript
function addDays(date: string, days: number): string
```

**Parameters**:
- `date`: Starting date (ISO 8601: YYYY-MM-DD)
- `days`: Number of days to add (can be negative)

**Returns**: New date (ISO 8601: YYYY-MM-DD)

**Example**:
```typescript
addDays('2026-02-03', 7);
// Returns: '2026-02-10'

addDays('2026-02-03', -30);
// Returns: '2026-01-04'
```

---

### 3.4 addMonths

**Purpose**: Add a number of months to a date.

**Signature**:
```typescript
function addMonths(date: string, months: number): string
```

**Parameters**:
- `date`: Starting date (ISO 8601: YYYY-MM-DD)
- `months`: Number of months to add (can be negative)

**Returns**: New date (ISO 8601: YYYY-MM-DD)

**Example**:
```typescript
addMonths('2026-02-15', 3);
// Returns: '2026-05-15'

addMonths('2026-02-15', -11);
// Returns: '2025-03-15'
```

---

### 3.5 isValidISODate

**Purpose**: Validate ISO 8601 date format.

**Signature**:
```typescript
function isValidISODate(date: string): boolean
```

**Parameters**:
- `date`: Date string to validate

**Returns**: True if valid ISO 8601 (YYYY-MM-DD), false otherwise

**Example**:
```typescript
isValidISODate('2026-02-03');  // true
isValidISODate('02/03/2026');  // false
isValidISODate('2026-13-01');  // false (invalid month)
```

---

## 4. Error Handling

### Error Cases

| Error | Condition | Message | HTTP Status (if API) |
|-------|-----------|---------|---------------------|
| Invalid period type | `period.type` not in ['day', 'week', 'month'] | "Invalid period type: {type}" | 400 |
| Invalid anchor date | `period.anchorDate` not valid ISO 8601 | "Invalid anchor date format: {date}" | 400 |
| Future anchor date | `period.anchorDate > today` | "Anchor date cannot be in the future" | 400 |
| Empty transactions | `transactions.length === 0` | ⚠️ Not an error - returns zero balances | N/A |
| Corrupted transaction | Missing required fields | "Invalid transaction data: {id}" | 500 |

### Error Response Examples

```typescript
// Invalid period type
try {
  calculateBalanceTrend(transactions, { type: 'quarter', anchorDate: '2026-02-03' });
} catch (error) {
  console.error(error.message);
  // "Invalid period type: quarter. Expected 'day', 'week', or 'month'."
}

// Invalid date format
try {
  calculateBalanceTrend(transactions, { type: 'day', anchorDate: '02/03/2026' });
} catch (error) {
  console.error(error.message);
  // "Invalid anchor date format: 02/03/2026. Expected ISO 8601 (YYYY-MM-DD)."
}
```

---

## 5. Performance Contract

### Time Complexity

| Function | Complexity | Notes |
|----------|-----------|-------|
| `calculateBalanceTrend` | O(n + p) | n = transactions, p = points (≤30) |
| `filterTransactionsByDateRange` | O(n) | Linear scan |
| `groupTransactionsByPeriod` | O(n) | Single pass grouping |
| `calculateStartingBalance` | O(n) | Linear scan |
| `generateBalanceTrendPoints` | O(p) | p = number of points |

### Space Complexity

| Function | Complexity | Notes |
|----------|-----------|-------|
| `calculateBalanceTrend` | O(p) | p = number of points (≤30) |
| `groupTransactionsByPeriod` | O(p) | Map with ≤30 entries |

### Performance Benchmarks

| Transaction Count | Expected Time | Max Time | Notes |
|------------------|---------------|----------|-------|
| 100 | <10ms | <20ms | Typical user |
| 1,000 | <50ms | <100ms | Active user |
| 10,000 | <100ms | <200ms | Power user |
| 100,000 | <500ms | <1000ms | Edge case |

**Test Requirements**:
- Performance tests: T023 (execution time validation)
- Load tests: T024 (large dataset handling)

---

## 6. Data Integrity Contract

### Guarantees

1. **Balance Accuracy**:
   ```typescript
   // For any point i:
   points[i].balance === 
     startingBalance + 
     sum(points[0..i].income) - 
     sum(points[0..i].expense)
   ```

2. **Change Consistency**:
   ```typescript
   change === endingBalance - startingBalance
   ```

3. **Point Ordering**:
   ```typescript
   // Points are chronologically ordered:
   points.every((point, i) => 
     i === 0 || point.date > points[i-1].date
   )
   ```

4. **Non-Negative Values**:
   ```typescript
   points.every(point => 
     point.income >= 0 && 
     point.expense >= 0 && 
     point.transactionCount >= 0
   )
   ```

5. **Empty Period Handling**:
   ```typescript
   // If no transactions in period:
   // - Still generates all expected points
   // - All points have same balance as startingBalance
   // - income, expense, transactionCount are all 0
   ```

### Test Coverage

These guarantees are validated by:
- T015: Balance accuracy tests
- T016: Change consistency tests
- T017: Point ordering tests
- T018: Non-negative value tests
- T019: Empty period handling tests

---

## 7. Integration Points

### Data Sources

| Source | Type | Format | Notes |
|--------|------|--------|-------|
| Transaction Store | `Transaction[]` | In-memory array | Passed as parameter |
| Time Period Selector | `TimePeriod` | Object | From user selection |

### Data Consumers

| Consumer | Receives | Format | Notes |
|----------|----------|--------|-------|
| useBalanceTrends hook | `BalanceTrendData` | Object | Main consumer |
| Dashboard component | `BalanceTrendData` | Object | Via hook |

### No External Dependencies

- ✅ Pure function - no API calls
- ✅ Synchronous - no async operations
- ✅ Side-effect free - no mutations
- ✅ Testable - no mocks needed

---

## 8. Testing Contract

### Test Categories

**T011-T015: Core Calculation Tests**
- T011: Test daily period calculation (30 points)
- T012: Test weekly period calculation (12 points)
- T013: Test monthly period calculation (12 months)
- T014: Test cumulative balance accuracy
- T015: Test starting balance calculation

**T016-T019: Edge Case Tests**
- T016: Test empty transaction array
- T017: Test single transaction
- T018: Test period with no transactions
- T019: Test future anchor date rejection

**T020-T022: Integration Tests**
- T020: Test with real transaction data
- T021: Test period boundary conditions
- T022: Test timezone handling (dates only, no times)

### Required Coverage

- **Line coverage**: >90%
- **Branch coverage**: >85%
- **Function coverage**: 100%

### Test Data Requirements

```typescript
// Minimum test dataset
const testTransactions: Transaction[] = [
  // Before period (for starting balance)
  { id: '1', date: '2025-12-01', amount: 1000, type: 'income', /* ... */ },
  { id: '2', date: '2025-12-15', amount: 200, type: 'expense', /* ... */ },
  
  // During period
  { id: '3', date: '2026-01-05', amount: 150, type: 'income', /* ... */ },
  { id: '4', date: '2026-01-10', amount: 75, type: 'expense', /* ... */ },
  { id: '5', date: '2026-01-15', amount: 200, type: 'income', /* ... */ },
  
  // Edge cases
  { id: '6', date: '2026-02-03', amount: 0, type: 'income', /* ... */ },  // Zero amount
];
```

---

## 9. API Evolution

### Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-02-03 | Initial contract definition |

### Backward Compatibility

- ✅ No breaking changes planned
- ✅ All parameters required (no optional parameters to add later)
- ✅ Return type is interface (can extend without breaking)

### Future Enhancements

**Potential additions (non-breaking)**:

```typescript
// Add optional forecast calculation
function calculateBalanceTrend(
  transactions: Transaction[],
  period: TimePeriod,
  options?: {
    includeForecast?: boolean;  // New optional parameter
    forecastDays?: number;
  }
): BalanceTrendData  // Return type unchanged (can extend interface)
```

---

## 10. Usage Examples

### Example 1: Daily Trend

```typescript
import { calculateBalanceTrend } from '@/features/dashboard/services/trendCalculationService';

const transactions: Transaction[] = [
  /* ... user transactions ... */
];

const dailyTrend = calculateBalanceTrend(transactions, {
  type: 'day',
  anchorDate: new Date().toISOString().split('T')[0]
});

console.log(`Balance changed by ${dailyTrend.changePercentage.toFixed(2)}% over 30 days`);
console.log(`Current balance: $${dailyTrend.endingBalance.toFixed(2)}`);
```

### Example 2: Weekly Trend

```typescript
const weeklyTrend = calculateBalanceTrend(transactions, {
  type: 'week',
  anchorDate: '2026-02-03'
});

weeklyTrend.points.forEach(point => {
  console.log(`Week of ${point.date}: Balance = $${point.balance.toFixed(2)}`);
});
```

### Example 3: Error Handling

```typescript
try {
  const trend = calculateBalanceTrend(transactions, {
    type: 'day',
    anchorDate: '2026-12-31'  // Future date
  });
} catch (error) {
  if (error.message.includes('future')) {
    console.error('Cannot calculate trends for future dates');
  }
}
```

---

## 11. Checklist for Implementation

- [ ] Create `trendCalculationService.ts` file
- [ ] Implement `calculateBalanceTrend` main function
- [ ] Implement all 6 helper functions (2.1-2.6)
- [ ] Implement all 5 utility functions (3.1-3.5)
- [ ] Add JSDoc comments for all exported functions
- [ ] Add input validation with clear error messages
- [ ] Write 12 unit tests (T011-T022)
- [ ] Verify >90% code coverage
- [ ] Run performance benchmarks (≤100ms for 10k transactions)
- [ ] Document any deviations from this contract

---

**Contract Status**: ✅ COMPLETE  
**Implementation Status**: ⏳ Pending (Phase 3: T023-T029)  
**Test Status**: ⏳ Pending (Phase 3: T011-T022)  
**Next Document**: quickstart.md
