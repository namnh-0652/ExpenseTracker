/**
 * Category Service
 * Provides access to category data and lookups
 */

import { DEFAULT_CATEGORIES, getAllCategories as getAll } from '../constants/categories.js';

/**
 * Get all categories or filter by type
 * @param {'income'|'expense'|'all'} type - Type filter
 * @returns {Array} Array of category objects
 */
export function getCategories(type = 'all') {
  if (type === 'all') {
    return getAll();
  }
  return DEFAULT_CATEGORIES[type] || [];
}

/**
 * Get a single category by ID
 * @param {string} categoryId - Category ID
 * @returns {Object|null} Category object or null if not found
 */
export function getCategoryById(categoryId) {
  const allCategories = getAll();
  return allCategories.find(cat => cat.id === categoryId) || null;
}

/**
 * Get category display name
 * @param {string} categoryId - Category ID
 * @returns {string} Category name or "(Unknown Category)" if not found
 */
export function getCategoryName(categoryId) {
  const category = getCategoryById(categoryId);
  return category ? category.name : '(Unknown Category)';
}

/**
 * Check if a category exists
 * @param {string} categoryId - Category ID
 * @returns {boolean} true if exists
 */
export function categoryExists(categoryId) {
  return getCategoryById(categoryId) !== null;
}
