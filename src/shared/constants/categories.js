export const DEFAULT_CATEGORIES = {
  expense: [
    { id: 'food', name: 'Food & Dining', type: 'expense', icon: '🍔', isDefault: true },
    { id: 'transport', name: 'Transportation', type: 'expense', icon: '🚗', isDefault: true },
    { id: 'entertainment', name: 'Entertainment', type: 'expense', icon: '🎬', isDefault: true },
    { id: 'utilities', name: 'Utilities', type: 'expense', icon: '⚡', isDefault: true },
    { id: 'shopping', name: 'Shopping', type: 'expense', icon: '🛍️', isDefault: true },
    { id: 'healthcare', name: 'Healthcare', type: 'expense', icon: '🏥', isDefault: true },
    { id: 'education', name: 'Education', type: 'expense', icon: '📚', isDefault: true },
    { id: 'personal', name: 'Personal Care', type: 'expense', icon: '💇', isDefault: true },
    { id: 'housing', name: 'Housing', type: 'expense', icon: '🏠', isDefault: true },
    { id: 'other-expense', name: 'Other', type: 'expense', icon: '📦', isDefault: true }
  ],
  income: [
    { id: 'salary', name: 'Salary', type: 'income', icon: '💼', isDefault: true },
    { id: 'freelance', name: 'Freelance', type: 'income', icon: '💻', isDefault: true },
    { id: 'investment', name: 'Investment', type: 'income', icon: '📈', isDefault: true },
    { id: 'gift', name: 'Gift', type: 'income', icon: '🎁', isDefault: true },
    { id: 'bonus', name: 'Bonus', type: 'income', icon: '💰', isDefault: true },
    { id: 'other-income', name: 'Other', type: 'income', icon: '💵', isDefault: true }
  ]
};

export function getAllCategories() {
  return [...DEFAULT_CATEGORIES.expense, ...DEFAULT_CATEGORIES.income];
}

export function getCategoriesByType(type) {
  if (type === 'all') return getAllCategories();
  return DEFAULT_CATEGORIES[type] || [];
}
