import { useState, useEffect, useCallback } from "react";
import { AppLayout } from "@/react-app/components/AppLayout";
import { StatCard } from "@/react-app/components/StatCard";
import { CategoryBreakdown } from "@/react-app/components/CategoryBreakdown";
import { RecentExpenses } from "@/react-app/components/RecentExpenses";
import { Wallet, CalendarDays, TrendingUp, PiggyBank, Target, Pencil, AlertCircle, Plus } from "lucide-react";
import { useAuth } from "@/react-app/context/AuthContext";
import { authFetch } from "@/react-app/lib/api";
import { useNavigate } from "react-router-dom";
import { CATEGORY_COLORS } from "@/react-app/data/stubData";

type DashboardData = {
  monthTotal: number; todayTotal: number; avgDaily: number;
  categories: { category: string; amount: number; percentage: number }[];
  recent: { id: number; amount: number; category: string; description: string; date: string }[];
  monthlyBudget: number; currentMonth: string;
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingBudget, setEditingBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState("");
  const [savingBudget, setSavingBudget] = useState(false);

  const today = new Date();
  const getGreeting = () => {
    const h = today.getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const load = useCallback(async () => {
    try {
      const r = await authFetch("/api/dashboard");
      if (!r.ok) { setError("Could not load data"); return; }
      const d = await r.json();
      setData(d);
    } catch { setError("Could not connect to server"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const saveBudget = async () => {
    setSavingBudget(true);
    try {
      await authFetch("/api/budget", { method: "PATCH", body: JSON.stringify({ budget: Number(budgetInput) }) });
      setEditingBudget(false);
      load();
    } finally { setSavingBudget(false); }
  };

  const budgetPct = data && data.monthlyBudget > 0 ? Math.min(100, Math.round((data.monthTotal / data.monthlyBudget) * 100)) : 0;
  const budgetColor = budgetPct >= 90 ? "bg-destructive" : budgetPct >= 70 ? "bg-amber-500" : "bg-primary";

  return (
    <AppLayout>
      <div className="px-4 lg:px-8 py-6 lg:py-8">
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-1">
            {getGreeting()}, <span className="capitalize">{user?.username}</span>! 👋
          </h1>
          <p className="text-muted-foreground">Here's your spending overview</p>
        </div>

        {error && (
          <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm mb-6">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[1,2,3,4].map(i => <div key={i} className="h-28 bg-muted rounded-xl animate-pulse" />)}
          </div>
        ) : data ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard title="This Month" value={data.monthTotal}
                subtitle={new Date().toLocaleString("en-US", { month: "long", year: "numeric" })}
                icon={<Wallet className="w-5 h-5 text-primary" />} accentColor={CATEGORY_COLORS.Food} />
              <StatCard title="Today's Spending" value={data.todayTotal}
                subtitle={today.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                icon={<CalendarDays className="w-5 h-5 text-amber-600" />} accentColor={CATEGORY_COLORS.Travel} />
              <StatCard title="Top Category"
                value={data.categories[0]?.category || "None"}
                subtitle={data.categories[0] ? `₹${data.categories[0].amount.toLocaleString()} (${data.categories[0].percentage}%)` : undefined}
                icon={<TrendingUp className="w-5 h-5 text-sky-600" />} accentColor={CATEGORY_COLORS.Recharge} />
              <StatCard title="Daily Average" value={data.avgDaily}
                subtitle="This month"
                icon={<PiggyBank className="w-5 h-5 text-purple-600" />} accentColor={CATEGORY_COLORS.Shopping} />
            </div>

            {/* Budget tracker */}
            <div className="bg-card border border-border rounded-xl p-5 mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">Monthly Budget</span>
                </div>
                {!editingBudget ? (
                  <button onClick={() => { setEditingBudget(true); setBudgetInput(String(data.monthlyBudget || "")); }}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                    <Pencil className="w-3 h-3" />{data.monthlyBudget > 0 ? "Edit" : "Set Budget"}
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">₹</span>
                    <input type="number" value={budgetInput} onChange={e => setBudgetInput(e.target.value)}
                      className="w-24 px-2 py-1 text-xs border-2 border-primary rounded-lg bg-background focus:outline-none" placeholder="Amount" />
                    <button onClick={saveBudget} disabled={savingBudget}
                      className="px-2 py-1 text-xs bg-primary text-white rounded-lg">Save</button>
                    <button onClick={() => setEditingBudget(false)} className="px-2 py-1 text-xs bg-muted rounded-lg">Cancel</button>
                  </div>
                )}
              </div>
              {data.monthlyBudget > 0 ? (
                <>
                  <div className="flex justify-between text-xs text-muted-foreground mb-2">
                    <span>₹{data.monthTotal.toLocaleString()} spent</span>
                    <span>₹{data.monthlyBudget.toLocaleString()} budget</span>
                  </div>
                  <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-700 ${budgetColor}`} style={{ width: `${budgetPct}%` }} />
                  </div>
                  <p className={`text-xs mt-1.5 font-medium ${budgetPct >= 90 ? "text-destructive" : "text-muted-foreground"}`}>
                    {budgetPct >= 100 ? "⚠️ Over budget!" : budgetPct >= 90 ? `⚡ ${100 - budgetPct}% remaining` : `${100 - budgetPct}% remaining`}
                  </p>
                </>
              ) : (
                <p className="text-xs text-muted-foreground">Set a monthly budget to track your progress</p>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CategoryBreakdown categories={data.categories.map(c => ({ ...c, color: CATEGORY_COLORS[c.category] || CATEGORY_COLORS.Other }))} />
              <RecentExpenses expenses={data.recent} onRefresh={load} />
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">💸</p>
            <h3 className="text-lg font-semibold text-foreground mb-2">No expenses yet</h3>
            <p className="text-muted-foreground text-sm mb-4">Start tracking your spending today</p>
            <button onClick={() => navigate("/add")} className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium">
              <Plus className="w-4 h-4" />Add First Expense
            </button>
          </div>
        )}

        {/* Mobile FAB */}
        <div className="fixed bottom-6 right-6 lg:hidden">
          <button onClick={() => navigate("/add")}
            className="flex items-center justify-center w-14 h-14 rounded-full bg-primary text-white shadow-lg hover:shadow-xl transition-shadow">
            <span className="text-2xl font-light">+</span>
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
