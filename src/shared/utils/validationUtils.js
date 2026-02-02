/**
 * Validation Service
 * Input validation helpers for transaction data
 */

import { getAllCategories } from '../constants/categories.js';

/**
 * Validate amount field
 * @param {number|string} amount - Amount to validate
 * @returns {string|null} Error message or null if valid
 */
export function validateAmount(amount) {
  if (amount === null || amount === undefined || amount === '') {
    return 'Amount is required';
  }

  // Check if string is valid number format before parsing
  if (typeof amount === 'string') {
    // Reject strings with multiple dots or invalid characters
    if (!/^-?\d+(\.\d+)?$/.test(amount.trim())) {
      return 'Amount must be a valid number';
    }
  }

  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) {
    return 'Amount must be a valid number';
  }

  if (numAmount < 0.01) {
    return 'Amount must be at least 0.01';
  }

  if (numAmount > 999999999.99) {
    return 'Amount must not exceed 999999999.99';
  }

  // Check decimal places
  const amountStr = amount.toString();
  if (amountStr.includes('.')) {
    const decimals = amountStr.split('.')[1];
    if (decimals && decimals.length > 2) {
      return 'Amount must have at most 2 decimal places';
    }
  }

  return null;
}

/**
 * Validate date field
 * @param {string} date - Date string to validate (YYYY-MM-DD)
 * @returns {string|null} Error message or null if valid
 */
export function validateDate(date) {
  if (!date || date === null || date === undefined || date === '') {
    return 'Date is required';
  }

  // Check format
  const formatRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!formatRegex.test(date)) {
    return 'Date must be in YYYY-MM-DD format';
  }

  // Check if valid date
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    return 'Invalid date';
  }

  // Check if the date string matches what we parse (catches things like 2026-13-01)
  const [year, month, day] = date.split('-').map(Number);
  if (
    parsedDate.getFullYear() !== year ||
    parsedDate.getMonth() !== month - 1 ||
    parsedDate.getDate() !== day
  ) {
    return 'Invalid date';
  }

  // Check year range
  if (year < 1900 || year > 2100) {
    return 'Year must be between 1900 and 2100';
  }

  return null;
}

/**
 * Validate transaction type
 * @param {string} type - Type to validate
 * @returns {string|null} Error message or null if valid
 */
export function validateType(type) {
  if (!type || type === null || type === undefined || type === '') {
    return 'Type is required';
  }

  if (type !== 'income' && type !== 'expense') {
    return 'Type must be either "income" or "expense"';
  }

  return null;
}

/**
 * Validate category ID
 * @param {string} categoryId - Category ID to validate
 * @returns {string|null} Error message or null if valid
 */
export function validateCategoryId(categoryId) {
  if (!categoryId || categoryId === null || categoryId === undefined || categoryId === '') {
    return 'Category is required';
  }

  const categories = getAllCategories();
  const exists = categories.some(cat => cat.id === categoryId);

  if (!exists) {
    return 'Category does not exist';
  }

  return null;
}

/**
 * Validate description field
 * @param {string} description - Description to validate
 * @returns {string|null} Error message or null if valid
 */
export function validateDescription(description) {
  // Description is optional
  if (!description || description === null || description === undefined) {
    return null;
  }

  if (description.length > 200) {
    return 'Description must not exceed 200 characters';
  }

  return null;
}

/**
 * Validate entire transaction object
 * @param {Object} transaction - Transaction to validate
 * @returns {{isValid: boolean, errors: Array<{field: string, message: string}>}}
 */
export function validateTransactionObject(transaction) {
  const errors = [];

  const amountError = validateAmount(transaction.amount);
  if (amountError) {
    errors.push({ field: 'amount', message: amountError });
  }

  const dateError = validateDate(transaction.date);
  if (dateError) {
    errors.push({ field: 'date', message: dateError });
  }

  const typeError = validateType(transaction.type);
  if (typeError) {
    errors.push({ field: 'type', message: typeError });
  }

  const categoryError = validateCategoryId(transaction.categoryId);
  if (categoryError) {
    errors.push({ field: 'categoryId', message: categoryError });
  }

  const descriptionError = validateDescription(transaction.description);
  if (descriptionError) {
    errors.push({ field: 'description', message: descriptionError });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
