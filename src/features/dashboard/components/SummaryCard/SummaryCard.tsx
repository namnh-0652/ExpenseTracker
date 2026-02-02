import React from 'react';
import { formatCurrency } from '@/shared/utils/dateUtils';
import './SummaryCard.css';

interface SummaryCardProps {
  type: 'income' | 'expense' | 'balance';
  title: string;
  amount: number;
  transactionCount: number;
  icon: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  type,
  title,
  amount,
  transactionCount,
  icon,
}) => {
  const getCardClass = () => {
    if (type === 'balance') {
      return `summary-card balance ${amount >= 0 ? 'positive' : 'negative'}`;
    }
    return `summary-card ${type}`;
  };

  const getIcon = () => {
    if (type === 'balance') {
      return amount >= 0 ? '📈' : '📉';
    }
    return icon;
  };

  const formatAmount = () => {
    const formattedAmount = formatCurrency(Math.abs(amount));
    if (type === 'balance' && amount >= 0) {
      return `+$${formattedAmount}`;
    }
    return `$${formattedAmount}`;
  };

  return (
    <div className={getCardClass()}>
      <div className="card-icon">{getIcon()}</div>
      <div className="card-content">
        <h3>{title}</h3>
        <p className="amount">{formatAmount()}</p>
        <span className="count">
          {transactionCount} transaction{transactionCount !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  );
};
