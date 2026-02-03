/**
 * Type Definitions for Balance Trends
 */

export interface BalanceTrendPoint {
  /**
   * Date for this data point (ISO 8601 format: YYYY-MM-DD)
   */
  date: string;

  /**
   * Cumulative balance at the end of this date
   */
  balance: number;

  /**
   * Total income on this date
   */
  income: number;

  /**
   * Total expenses on this date
   */
  expense: number;

  /**
   * Number of transactions on this date
   */
  transactionCount: number;
}

export interface BalanceTrendData {
  /**
   * Array of data points ordered chronologically
   */
  points: BalanceTrendPoint[];

  /**
   * Time period information
   */
  period: {
    start: string;
    end: string;
    type: 'day' | 'week' | 'month';
  };

  /**
   * Cumulative balance at the start of the period
   */
  startingBalance: number;

  /**
   * Cumulative balance at the end of the period
   */
  endingBalance: number;

  /**
   * Net change in balance over the period
   */
  change: number;

  /**
   * Percentage change in balance over the period
   */
  changePercentage: number;
}

export interface TimePeriod {
  /**
   * Type of time period
   */
  type: 'day' | 'week' | 'month';

  /**
   * Anchor date for period calculation (ISO 8601: YYYY-MM-DD)
   */
  anchorDate: string;
}

export interface DateRange {
  /**
   * Start date (inclusive, ISO 8601: YYYY-MM-DD)
   */
  start: string;

  /**
   * End date (inclusive, ISO 8601: YYYY-MM-DD)
   */
  end: string;
}

export interface TransactionGroup {
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
