import { CATEGORY_ICONS } from "@/react-app/data/stubData";

interface CategoryBreakdownProps {
  categories: { category: string; amount: number; percentage: number; color: string }[];
}

export function CategoryBreakdown({ categories }: CategoryBreakdownProps) {
  const maxAmount = Math.max(...categories.map(c => c.amount), 1);
  return (
    <div className="rounded-xl bg-card p-5 shadow-sm border border-border/50">
      <h3 className="text-sm font-semibold text-foreground mb-4">Spending by Category</h3>
      {categories.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-6">No data yet</p>
      ) : (
        <div className="space-y-4">
          {categories.map(cat => (
            <div key={cat.category} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">{CATEGORY_ICONS[cat.category]}</span>
                  <span className="text-sm font-medium text-foreground">{cat.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">₹{cat.amount.toLocaleString()}</span>
                  <span className="text-xs text-muted-foreground">({cat.percentage}%)</span>
                </div>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${(cat.amount / maxAmount) * 100}%`, backgroundColor: cat.color }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
