import React, { useState, useEffect, useCallback } from 'react';
import { getCategories } from '@/shared/services/categoryService';
import type { FilterCriteria } from '@/features/filters/services/filterService';
import type { Category } from '@/shared/constants/categories';
import type { Transaction } from '@/shared/types';
import { ExportButton } from '@/features/export/components/ExportButton/ExportButton';
import './FilterBar.css';

interface FilterBarProps {
  onFilterChange: (filters: FilterCriteria) => void;
  activeFilterCount: number;
  transactions: Transaction[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  onFilterChange,
  activeFilterCount,
  transactions,
}) => {
  const [searchText, setSearchText] = useState('');
  const [type, setType] = useState<'all' | 'income' | 'expense'>('all');
  const [categoryId, setCategoryId] = useState<string>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'category'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const categories = getCategories('all');

  // Debounced search - wait 300ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      applyFilters();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchText]);

  // Apply filters immediately for dropdowns and date inputs
  useEffect(() => {
    applyFilters();
  }, [type, categoryId, startDate, endDate, sortBy, sortOrder]);

  const applyFilters = useCallback(() => {
    const filters: FilterCriteria = {
      searchText: searchText.trim(),
      type: type === 'all' ? undefined : type,
      categoryId: categoryId || undefined,
      dateRange: startDate || endDate ? {
        start: startDate || null,
        end: endDate || null,
      } : undefined,
      sortBy,
      sortOrder,
    };

    onFilterChange(filters);
  }, [searchText, type, categoryId, startDate, endDate, sortBy, sortOrder, onFilterChange]);

  const handleClearFilters = () => {
    setSearchText('');
    setType('all');
    setCategoryId('');
    setStartDate('');
    setEndDate('');
    setSortBy('date');
    setSortOrder('desc');
  };

  const hasActiveFilters = searchText || type !== 'all' || categoryId || startDate || endDate;

  return (
    <div className="filter-bar">
      <div className="filter-bar-header">
        <h3>
          Filters
          {activeFilterCount > 0 && (
            <span className="filter-count">{activeFilterCount} active</span>
          )}
        </h3>
        <div className="filter-bar-actions">
          {hasActiveFilters && (
            <button className="clear-filters-btn" onClick={handleClearFilters}>
              Clear all
            </button>
          )}
          <ExportButton transactions={transactions} />
        </div>
      </div>

      <div className="filter-controls">
        {/* Search Input */}
        <div className="filter-group search-group">
          <label htmlFor="search-input">
            <span className="filter-icon">🔍</span>
            Search
          </label>
          <input
            id="search-input"
            type="text"
            placeholder="Search transactions..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="filter-input"
          />
        </div>

        {/* Type Filter */}
        <div className="filter-group">
          <label htmlFor="type-filter">
            <span className="filter-icon">💳</span>
            Type
          </label>
          <select
            id="type-filter"
            value={type}
            onChange={(e) => setType(e.target.value as 'all' | 'income' | 'expense')}
            className="filter-select"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="filter-group">
          <label htmlFor="category-filter">
            <span className="filter-icon">📁</span>
            Category
          </label>
          <select
            id="category-filter"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {categories.map((category: Category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range */}
        <div className="filter-group date-range-group">
          <label>
            <span className="filter-icon">📅</span>
            Date Range
          </label>
          <div className="date-inputs">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="filter-input date-input"
              placeholder="Start date"
            />
            <span className="date-separator">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="filter-input date-input"
              placeholder="End date"
            />
          </div>
        </div>

        {/* Sort Options */}
        <div className="filter-group sort-group">
          <label htmlFor="sort-by">
            <span className="filter-icon">⬍</span>
            Sort By
          </label>
          <div className="sort-controls">
            <select
              id="sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'amount' | 'category')}
              className="filter-select sort-select"
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
              <option value="category">Category</option>
            </select>
            <button
              className={`sort-order-btn ${sortOrder === 'asc' ? 'asc' : 'desc'}`}
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
