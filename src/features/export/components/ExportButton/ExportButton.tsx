import React, { useState } from 'react';
import { downloadCSV } from '@/features/export/services/exportService';
import type { Transaction } from '@/shared/types';
import './ExportButton.css';

interface ExportButtonProps {
  transactions: Transaction[];
  disabled?: boolean;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  transactions,
  disabled = false,
}) => {
  const [showFeedback, setShowFeedback] = useState(false);

  const handleExport = () => {
    if (transactions.length === 0) {
      return;
    }

    try {
      downloadCSV(transactions);
      
      // Show success feedback
      setShowFeedback(true);
      setTimeout(() => {
        setShowFeedback(false);
      }, 3000);
    } catch (error) {
      console.error('Export failed:', error);
      // In a real app, you might want to show an error message
    }
  };

  const isDisabled = disabled || transactions.length === 0;

  return (
    <div className="export-button-wrapper">
      <button
        className="export-button"
        onClick={handleExport}
        disabled={isDisabled}
        title={isDisabled ? 'No transactions to export' : 'Export to CSV'}
      >
        <span className="export-icon">📥</span>
        <span className="export-text">Export CSV</span>
        {transactions.length > 0 && (
          <span className="export-count">({transactions.length})</span>
        )}
      </button>

      {showFeedback && (
        <div className="export-feedback">
          <span className="feedback-icon">✓</span>
          Export successful!
        </div>
      )}
    </div>
  );
};
