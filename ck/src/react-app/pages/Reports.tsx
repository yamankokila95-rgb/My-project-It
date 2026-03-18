import { useState, useEffect, useCallback } from "react";
import { AppLayout } from "@/react-app/components/AppLayout";
import { authFetch } from "@/react-app/lib/api";
import { Trash2, AlertCircle, TrendingDown, IndianRupee } from "lucide-react";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "@/react-app/data/stubData";

type Expense = { id: number; amount: number; category: string; description: string; date: string };

const MONTHS = Array.from({ length: 6 }, (_, i) => {
  const d = new Date();
  d.setMonth(d.getMonth() - i);
  return { value: d.toISOString().slice(0, 7), label: d.toLocaleString("en-US", { month: "long", year: "numeric" }) };
});

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function Reports() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[0].value);
  const [filterCategory, setFilterCategory] = useState("All");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await authFetch(`/api/expenses?month=${selectedMonth}`);
      if (!r.ok) { setError("Could not load expenses"); return; }
      setExpenses(await r.json());
    } catch { setError("Could not connect to server"); }
    finally { setLoading(false); }
  }, [selectedMonth]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this expense?")) return;
    setDeletingId(id);
    try {
      await authFetch(`/api/expenses/${id}`, { method: "DELETE" });
      setExpenses(prev => prev.filter(e => e.id !== id));
    } finally { setDeletingId(null); }
  };

  const filtered = filterCategory === "All" ? expenses : expenses.filter(e => e.category === filterCategory);
  const total = filtered.reduce((s, e) => s + e.amount, 0);

  // Category totals for mini chart
  const catTotals: Record<string, number> = {};
  expenses.forEach(e => { catTotals[e.category] = (catTotals[e.category] || 0) + e.amount; });
  const grandTotal = Object.values(catTotals).reduce((s, v) => s + v, 0);
  const catSummary = Object.entries(catTotals).sort((a, b) => b[1] - a[1]);

  // Daily spending for the month
  const dailyTotals: Record<string, number> = {};
  expenses.forEach(e => { dailyTotals[e.date] = (dailyTotals[e.date] || 0) + e.amount; });
  const dailyEntries = Object.entries(dailyTotals).sort((a, b) => a[0].localeCompare(b[0]));
  const maxDay = Math.max(...dailyEntries.map(([, v]) => v), 1);

  const categories = ["All", "Food", "Travel", "Recharge", "Shopping", "Other"];

  return (
    <AppLayout>
      <div className="px-4 lg:px-8 py-6 lg:py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Reports</h1>
          <p className="text-muted-foreground text-sm mt-1">Analyse your spending patterns</p>
        </div>

        {error && (
          <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm mb-6">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
          </div>
        )}

        {/* Month selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          {MONTHS.map(m => (
            <button key={m.value} onClick={() => setSelectedMonth(m.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                selectedMonth === m.value ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:text-foreground"
              }`}>
              {m.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-muted rounded-xl animate-pulse" />)}</div>
        ) : expenses.length === 0 ? (
          <div className="text-center py-20">
            <TrendingDown className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-1">No expenses this month</h3>
            <p className="text-muted-foreground text-sm">Nothing recorded for this period</p>
          </div>
        ) : (
          <>
            {/* Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              <div className="bg-card border border-border rounded-xl p-4">
                <p className="text-xs text-muted-foreground mb-1">Total Spent</p>
                <p className="text-xl font-bold text-foreground flex items-center gap-0.5"><IndianRupee className="w-4 h-4" />{grandTotal.toLocaleString()}</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-4">
                <p className="text-xs text-muted-foreground mb-1">Transactions</p>
                <p className="text-xl font-bold text-foreground">{expenses.length}</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-4">
                <p className="text-xs text-muted-foreground mb-1">Top Category</p>
                <p className="text-xl font-bold text-foreground">{catSummary[0]?.[0] || "—"}</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-4">
                <p className="text-xs text-muted-foreground mb-1">Avg per Day</p>
                <p className="text-xl font-bold text-foreground flex items-center gap-0.5">
                  <IndianRupee className="w-4 h-4" />
                  {dailyEntries.length > 0 ? Math.round(grandTotal / dailyEntries.length).toLocaleString() : 0}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Category breakdown */}
              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="text-sm font-semibold text-foreground mb-4">By Category</h3>
                <div className="space-y-3">
                  {catSummary.map(([cat, amt]) => (
                    <div key={cat}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="flex items-center gap-2 text-foreground font-medium">
                          {CATEGORY_ICONS[cat]} {cat}
                        </span>
                        <span className="font-semibold">₹{amt.toLocaleString()} <span className="text-muted-foreground font-normal text-xs">({Math.round(amt/grandTotal*100)}%)</span></span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(amt/grandTotal)*100}%`, backgroundColor: CATEGORY_COLORS[cat] }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Daily spending */}
              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="text-sm font-semibold text-foreground mb-4">Daily Spending</h3>
                {dailyEntries.length === 0 ? <p className="text-muted-foreground text-sm">No data</p> : (
                  <div className="flex items-end gap-1 h-32">
                    {dailyEntries.map(([date, amt]) => (
                      <div key={date} className="flex-1 flex flex-col items-center gap-1 group relative">
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-10">
                          ₹{amt.toLocaleString()}
                        </div>
                        <div className="w-full rounded-t-sm transition-all duration-500"
                          style={{ height: `${(amt/maxDay)*100}%`, backgroundColor: "hsl(32 95% 48%)", minHeight: "4px" }} />
                        <span className="text-xs text-muted-foreground">{new Date(date).getDate()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Expense list with filter + delete */}
            <div className="bg-card border border-border rounded-xl">
              <div className="flex items-center justify-between p-5 border-b border-border flex-wrap gap-3">
                <h3 className="text-sm font-semibold text-foreground">All Expenses</h3>
                <div className="flex gap-2 flex-wrap">
                  {categories.map(cat => (
                    <button key={cat} onClick={() => setFilterCategory(cat)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                        filterCategory === cat ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}>
                      {cat === "All" ? `All (${expenses.length})` : `${CATEGORY_ICONS[cat]} ${cat}`}
                    </button>
                  ))}
                </div>
              </div>

              {filtered.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground text-sm">No {filterCategory} expenses</div>
              ) : (
                <div className="divide-y divide-border">
                  {filtered.map(expense => (
                    <div key={expense.id} className="flex items-center gap-3 px-5 py-3 hover:bg-muted/30 transition-colors">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                        style={{ backgroundColor: `${CATEGORY_COLORS[expense.category]}20` }}>
                        {CATEGORY_ICONS[expense.category]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{expense.description}</p>
                        <p className="text-xs text-muted-foreground">{expense.category} · {formatDate(expense.date)}</p>
                      </div>
                      <p className="text-sm font-semibold text-foreground">-₹{expense.amount.toLocaleString()}</p>
                      <button onClick={() => handleDelete(expense.id)} disabled={deletingId === expense.id}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors ml-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <div className="px-5 py-3 bg-muted/30 flex justify-between text-sm font-semibold">
                    <span className="text-muted-foreground">{filtered.length} expenses</span>
                    <span className="text-foreground">₹{total.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
