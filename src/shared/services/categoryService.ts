/**
 * Category Service
 * Provides access to category data and lookups
 */

import { DEFAULT_CATEGORIES, getAllCategories as getAll, Category } from '../constants/categories';

/**
 * Get all categories or filter by type
 * @param type - Type filter
 * @returns Array of category objects
 */
export function getCategories(type: 'income' | 'expense' | 'all' = 'all'): readonly Category[] {
  if (type === 'all') {
    return getAll();
  }
  return DEFAULT_CATEGORIES[type] || [];
}

/**
 * Get a single category by ID
 * @param categoryId - Category ID
 * @returns Category object or null if not found
 */
export function getCategoryById(categoryId: string): Category | null {
  const allCategories = getAll();
  return allCategories.find(cat => cat.id === categoryId) || null;
}

/**
 * Get category display name
 * @param categoryId - Category ID
 * @returns Category name or "(Unknown Category)" if not found
 */
export function getCategoryName(categoryId: string): string {
  const category = getCategoryById(categoryId);
  return category ? category.name : '(Unknown Category)';
}

/**
 * Check if a category exists
 * @param categoryId - Category ID
 * @returns true if exists
 */
export function categoryExists(categoryId: string): boolean {
  return getCategoryById(categoryId) !== null;
}
