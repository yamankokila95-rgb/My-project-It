export interface Expense {
  id: number; date: string;
  category: 'Food' | 'Travel' | 'Recharge' | 'Shopping' | 'Other';
  amount: number; description: string;
}

export interface CategorySummary {
  category: string; amount: number; percentage: number; color: string;
}

export const CATEGORIES = ['Food', 'Travel', 'Recharge', 'Shopping', 'Other'] as const;

export const CATEGORY_COLORS: Record<string, string> = {
  Food: 'hsl(32, 95%, 48%)',
  Travel: 'hsl(16, 90%, 52%)',
  Recharge: 'hsl(200, 80%, 50%)',
  Shopping: 'hsl(280, 60%, 55%)',
  Other: 'hsl(340, 75%, 55%)',
};

export const CATEGORY_ICONS: Record<string, string> = {
  Food: '🍕', Travel: '🚌', Recharge: '📱', Shopping: '🛒', Other: '📦',
};

export function calculateCategorySummary(categories: { category: string; amount: number; percentage: number }[]): CategorySummary[] {
  return categories.map(c => ({ ...c, color: CATEGORY_COLORS[c.category] || CATEGORY_COLORS.Other }));
}
