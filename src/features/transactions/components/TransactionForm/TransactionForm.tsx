import React, { useState, useEffect } from 'react';
import { getCategories } from '@/shared/services/categoryService';
import { formatDateForInput } from '@/shared/utils/dateUtils';
import type { TransactionFormData, Transaction } from '@/shared/types';
import './TransactionForm.css';

interface TransactionFormProps {
  onSubmit: (data: TransactionFormData) => void;
  onCancel?: () => void;
  initialData?: Transaction | null;
  submitLabel?: string;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  submitLabel = 'Add Transaction',
}) => {
  // Form state
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState<string>(formatDateForInput(new Date()));
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [categoryId, setCategoryId] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate form when editing
  useEffect(() => {
    if (initialData) {
      setAmount(initialData.amount.toString());
      setDate(initialData.date);
      setType(initialData.type);
      setCategoryId(initialData.categoryId);
      setDescription(initialData.description || '');
    }
  }, [initialData]);

  // Get categories based on selected type
  const categories = getCategories(type);

  // Set default category when type changes
  useEffect(() => {
    if (categories.length > 0 && !categoryId) {
      setCategoryId(categories[0].id);
    }
  }, [type, categories, categoryId]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate amount
    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount)) {
      newErrors.amount = 'Amount is required and must be a valid number';
    } else if (numAmount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    // Validate date
    if (!date) {
      newErrors.date = 'Date is required';
    }

    // Validate category
    if (!categoryId) {
      newErrors.categoryId = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData: TransactionFormData = {
      amount: parseFloat(amount),
      date,
      type,
      categoryId,
      categoryName: categories.find(cat => cat.id === categoryId)?.name || '',
      description: description.trim(),
    };

    onSubmit(formData);

    // Reset form if not editing
    if (!initialData) {
      setAmount('');
      setDate(formatDateForInput(new Date()));
      setType('expense');
      setCategoryId(categories[0]?.id || '');
      setDescription('');
      setErrors({});
    }
  };

  const handleCancel = () => {
    // Reset form
    setAmount('');
    setDate(formatDateForInput(new Date()));
    setType('expense');
    setCategoryId(categories[0]?.id || '');
    setDescription('');
    setErrors({});

    if (onCancel) {
      onCancel();
    }
  };

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="amount">
          Amount <span className="required">*</span>
        </label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          step="0.01"
          min="0.01"
          className={errors.amount ? 'error' : ''}
          aria-invalid={!!errors.amount}
          aria-describedby={errors.amount ? 'amount-error' : undefined}
        />
        {errors.amount && (
          <span id="amount-error" className="error-message" role="alert">
            {errors.amount}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="date">
          Date <span className="required">*</span>
        </label>
        <input
          type="date"
          id="date"
          name="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          max={formatDateForInput(new Date())}
          className={errors.date ? 'error' : ''}
          aria-invalid={!!errors.date}
          aria-describedby={errors.date ? 'date-error' : undefined}
        />
        {errors.date && (
          <span id="date-error" className="error-message" role="alert">
            {errors.date}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="type">
          Type <span className="required">*</span>
        </label>
        <div className="type-selector">
          <label className={`type-option ${type === 'income' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="type"
              value="income"
              checked={type === 'income'}
              onChange={(e) => setType(e.target.value as 'income')}
            />
            <span>Income</span>
          </label>
          <label className={`type-option ${type === 'expense' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="type"
              value="expense"
              checked={type === 'expense'}
              onChange={(e) => setType(e.target.value as 'expense')}
            />
            <span>Expense</span>
          </label>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="category">
          Category <span className="required">*</span>
        </label>
        <select
          id="category"
          name="category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className={errors.categoryId ? 'error' : ''}
          aria-invalid={!!errors.categoryId}
          aria-describedby={errors.categoryId ? 'category-error' : undefined}
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.icon} {cat.name}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <span id="category-error" className="error-message" role="alert">
            {errors.categoryId}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description (optional)</label>
        <input
          type="text"
          id="description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g., Lunch with team"
          maxLength={200}
        />
        <span className="character-count">{description.length}/200</span>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {submitLabel}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};
