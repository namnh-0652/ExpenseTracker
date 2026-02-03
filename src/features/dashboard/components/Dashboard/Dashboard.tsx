import React, { useState, useMemo } from 'react';
import { useTransactions } from '@/features/transactions/hooks/useTransactions';
import {
  calculateDashboardSummary,
  type TimePeriod,
} from '@/features/dashboard/services/calculationService';
import { SummaryCard } from '@/features/dashboard/components/SummaryCard/SummaryCard';
import { CategoryChart } from '@/features/dashboard/components/CategoryChart/CategoryChart';
import { TimePeriodSelector } from '@/features/dashboard/components/TimePeriodSelector/TimePeriodSelector';
import { BalanceTrendsChart } from '@/features/dashboard/components/BalanceTrendsChart/BalanceTrendsChart';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
  const { transactions } = useTransactions();
  const [periodType, setPeriodType] = useState<'day' | 'week' | 'month'>('month');

  // Calculate dashboard data based on selected period
  const dashboardData = useMemo(() => {
    const period: TimePeriod = {
      type: periodType,
      anchorDate: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD
    };

    return calculateDashboardSummary(transactions, period);
  }, [transactions, periodType]);

  const formatPeriodLabel = () => {
    const { start, end, type } = dashboardData.period;
    
    if (type === 'day') {
      return new Date(start).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
    
    if (type === 'week') {
      const startDate = new Date(start).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      const endDate = new Date(end).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
      return `${startDate} - ${endDate}`;
    }
    
    // month
    return new Date(start).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  };

  return (
    <div className="dashboard" data-testid="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h2>Dashboard</h2>
          <p className="period-label">{formatPeriodLabel()}</p>
        </div>

        <TimePeriodSelector
          selectedPeriod={periodType}
          onPeriodChange={setPeriodType}
        />
      </div>

      <div className="summary-cards" data-testid="summary-cards">
        <SummaryCard
          type="income"
          title="Total Income"
          amount={dashboardData.totalIncome}
          transactionCount={dashboardData.transactionCount.income}
          icon="💰"
        />
        <SummaryCard
          type="expense"
          title="Total Expenses"
          amount={dashboardData.totalExpenses}
          transactionCount={dashboardData.transactionCount.expense}
          icon="💸"
        />
        <SummaryCard
          type="balance"
          title="Net Balance"
          amount={dashboardData.netBalance}
          transactionCount={dashboardData.transactionCount.total}
          icon="📊"
        />
      </div>

      <div className="balance-trends-section" data-testid="balance-trends-section">
        <h3>Balance Trends</h3>
        <BalanceTrendsChart
          transactions={transactions}
          periodType={periodType}
        />
      </div>

      <div className="category-breakdown" data-testid="category-breakdown">
        <h3>Category Breakdown</h3>
        <CategoryChart categories={dashboardData.categoryBreakdown} />
      </div>
    </div>
  );
};
