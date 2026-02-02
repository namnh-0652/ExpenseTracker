export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  icon: string;
  isDefault: boolean;
}

export const DEFAULT_CATEGORIES = {
  expense: [
    { id: 'food', name: 'Food & Dining', type: 'expense' as const, icon: '🍔', isDefault: true },
    { id: 'transport', name: 'Transportation', type: 'expense' as const, icon: '🚗', isDefault: true },
    { id: 'entertainment', name: 'Entertainment', type: 'expense' as const, icon: '🎬', isDefault: true },
    { id: 'utilities', name: 'Utilities', type: 'expense' as const, icon: '⚡', isDefault: true },
    { id: 'shopping', name: 'Shopping', type: 'expense' as const, icon: '🛍️', isDefault: true },
    { id: 'healthcare', name: 'Healthcare', type: 'expense' as const, icon: '🏥', isDefault: true },
    { id: 'education', name: 'Education', type: 'expense' as const, icon: '📚', isDefault: true },
    { id: 'personal', name: 'Personal Care', type: 'expense' as const, icon: '💇', isDefault: true },
    { id: 'housing', name: 'Housing', type: 'expense' as const, icon: '🏠', isDefault: true },
    { id: 'other-expense', name: 'Other', type: 'expense' as const, icon: '📦', isDefault: true }
  ],
  income: [
    { id: 'salary', name: 'Salary', type: 'income' as const, icon: '💼', isDefault: true },
    { id: 'freelance', name: 'Freelance', type: 'income' as const, icon: '💻', isDefault: true },
    { id: 'investment', name: 'Investment', type: 'income' as const, icon: '📈', isDefault: true },
    { id: 'gift', name: 'Gift', type: 'income' as const, icon: '🎁', isDefault: true },
    { id: 'bonus', name: 'Bonus', type: 'income' as const, icon: '💰', isDefault: true },
    { id: 'other-income', name: 'Other', type: 'income' as const, icon: '💵', isDefault: true }
  ]
} as const;

export function getAllCategories(): Category[] {
  return [...DEFAULT_CATEGORIES.expense, ...DEFAULT_CATEGORIES.income];
}

export function getCategoriesByType(type: 'income' | 'expense' | 'all'): readonly Category[] {
  if (type === 'all') return getAllCategories();
  return DEFAULT_CATEGORIES[type] || [];
}
