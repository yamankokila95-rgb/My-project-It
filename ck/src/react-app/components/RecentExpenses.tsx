import { Expense, CATEGORY_COLORS, CATEGORY_ICONS } from "@/react-app/data/stubData";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface RecentExpensesProps {
  expenses: Expense[];
  onRefresh?: () => void;
}

export function RecentExpenses({ expenses, onRefresh: _ }: RecentExpensesProps) {
  const navigate = useNavigate();
  const formatDate = (dateStr: string) => {
    const today = new Date().toISOString().split("T")[0];
    const yest = new Date(); yest.setDate(yest.getDate()-1);
    const yesterdayStr = yest.toISOString().split("T")[0];
    if (dateStr === today) return "Today";
    if (dateStr === yesterdayStr) return "Yesterday";
    return new Date(dateStr).toLocaleDateString("en-IN", { month: "short", day: "numeric" });
  };

  return (
    <div className="rounded-xl bg-card p-5 shadow-sm border border-border/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Recent Expenses</h3>
        <button onClick={() => navigate("/reports")} className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
          View All <ArrowRight className="w-3 h-3" />
        </button>
      </div>
      {expenses.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground text-sm">No expenses yet</p>
          <button onClick={() => navigate("/add")} className="mt-2 text-xs text-primary hover:underline">Add one now</button>
        </div>
      ) : (
        <div className="space-y-2">
          {expenses.map(expense => (
            <div key={expense.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 hover:bg-muted transition-colors">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl text-base flex-shrink-0"
                style={{ backgroundColor: `${CATEGORY_COLORS[expense.category]}20` }}>
                {CATEGORY_ICONS[expense.category]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{expense.description}</p>
                <p className="text-xs text-muted-foreground">{expense.category} · {formatDate(expense.date)}</p>
              </div>
              <p className="text-sm font-semibold text-foreground whitespace-nowrap">-₹{expense.amount.toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
