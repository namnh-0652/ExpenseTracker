import React from 'react';
import { formatCurrency } from '@/shared/utils/dateUtils';
import type { CategoryBreakdown } from '@/features/dashboard/services/calculationService';
import './CategoryChart.css';

interface CategoryChartProps {
  categories: CategoryBreakdown[];
}

export const CategoryChart: React.FC<CategoryChartProps> = ({ categories }) => {
  if (categories.length === 0) {
    return (
      <div className="category-chart">
        <div className="empty-state">
          <p>No transactions in this period</p>
        </div>
      </div>
    );
  }

  return (
    <div className="category-chart">
      <div className="category-list">
        {categories.map((category) => (
          <div key={category.categoryId} className="category-item">
            <div className="category-info">
              <span className="category-name">{category.categoryName}</span>
              <span className="category-count">
                {category.transactionCount} transaction
                {category.transactionCount !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="category-amount">
              <span className="amount">${formatCurrency(category.amount)}</span>
              <span className="percentage">{category.percentage.toFixed(1)}%</span>
            </div>
            <div className="category-bar">
              <div
                className="category-bar-fill"
                style={{ width: `${category.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
