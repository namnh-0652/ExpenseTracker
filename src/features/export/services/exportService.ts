/**
 * Export Service
 * Provides functionality to export transaction data to CSV format
 */

import type { Transaction } from '@/shared/types';
import { getCategoryById } from '@/shared/services/categoryService';

/**
 * Escape a value for CSV format
 * Handles commas, quotes, and newlines
 * @param value - Value to escape
 * @returns CSV-safe string
 */
export function escapeCSVValue(value: string | number | null | undefined): string {
  // Handle null/undefined
  if (value === null || value === undefined) {
    return '';
  }

  // Convert numbers to strings
  const stringValue = String(value);

  // Check if value needs escaping (contains comma, quote, or newline)
  const needsEscaping = stringValue.includes(',') || 
                       stringValue.includes('"') || 
                       stringValue.includes('\n');

  if (needsEscaping) {
    // Escape double quotes by doubling them
    const escaped = stringValue.replace(/"/g, '""');
    // Wrap in quotes
    return `"${escaped}"`;
  }

  return stringValue;
}

/**
 * Generate a default filename with timestamp
 * Format: expense-tracker-YYYYMMDD-HHMMSS.csv
 * @returns Filename string
 */
export function generateFilename(): string {
  const now = new Date();
  
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  const datePart = `${year}${month}${day}`;
  const timePart = `${hours}${minutes}${seconds}`;
  
  return `expense-tracker-${datePart}-${timePart}.csv`;
}

/**
 * Export transactions to CSV format
 * Column Order: Date, Amount, Type, Category, Description
 * @param transactions - Array of transactions to export
 * @param includeHeaders - Whether to include column headers (default: true)
 * @returns CSV string
 */
export function exportToCSV(
  transactions: Transaction[],
  includeHeaders: boolean = true
): string {
  const lines: string[] = [];

  // Add headers if requested
  if (includeHeaders) {
    lines.push('Date,Amount,Type,Category,Description');
  }

  // Add transaction rows
  for (const transaction of transactions) {
    const date = transaction.date;
    const amount = transaction.amount.toFixed(2); // Always 2 decimal places
    const type = transaction.type;
    const category = getCategoryById(transaction.categoryId);
    const categoryName = escapeCSVValue(category?.name || 'Unknown');
    const description = escapeCSVValue(transaction.description);

    lines.push(`${date},${amount},${type},${categoryName},${description}`);
  }

  return lines.join('\n');
}

/**
 * Download transactions as CSV file
 * Creates a Blob and triggers browser download
 * @param transactions - Array of transactions to export
 * @param filename - Optional custom filename (default: auto-generated)
 */
export function downloadCSV(
  transactions: Transaction[],
  filename?: string
): void {
  // Generate CSV content
  const csvContent = exportToCSV(transactions, true);

  // Create Blob
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  // Create download link
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.href = url;
  link.download = filename || generateFilename();

  // Trigger download
  link.click();

  // Cleanup
  URL.revokeObjectURL(url);
}
