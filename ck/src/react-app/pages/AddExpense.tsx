import { useState } from "react";
import { AppLayout } from "@/react-app/components/AppLayout";
import { useNavigate } from "react-router-dom";
import { authFetch } from "@/react-app/lib/api";
import { CheckCircle2, IndianRupee } from "lucide-react";
import { CATEGORIES, CATEGORY_ICONS, CATEGORY_COLORS } from "@/react-app/data/stubData";

export default function AddExpense() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category || !description || !date) { setError("Please fill all fields"); return; }
    if (!category) { setError("Please select a category"); return; }
    setError(""); setLoading(true);
    try {
      const res = await authFetch("/api/expenses", {
        method: "POST",
        body: JSON.stringify({ amount: Number(amount), category, description, date }),
      });
      let json: any = {};
      try { json = await res.json(); } catch {}
      if (!res.ok) { setError(json.error || "Failed to add expense"); return; }
      setSuccess(true);
      setTimeout(() => navigate("/"), 1500);
    } catch { setError("Network error. Is the server running?"); }
    finally { setLoading(false); }
  };

  if (success) return (
    <AppLayout>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Expense Added!</h2>
          <p className="text-muted-foreground text-sm">Redirecting to dashboard...</p>
        </div>
      </div>
    </AppLayout>
  );

  return (
    <AppLayout>
      <div className="px-4 lg:px-8 py-6 lg:py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Add Expense</h1>
          <p className="text-muted-foreground text-sm mt-1">Record a new expense entry</p>
        </div>

        <div className="max-w-lg">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Amount */}
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Amount</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <IndianRupee className="w-4 h-4" />
                </div>
                <input type="number" min="1" step="0.01" placeholder="0.00"
                  value={amount} onChange={e => setAmount(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-border bg-background text-foreground focus:outline-none focus:border-primary transition-colors text-lg font-semibold" />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">Category</label>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                {CATEGORIES.map(cat => (
                  <button key={cat} type="button" onClick={() => setCategory(cat)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                      category === cat ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                    }`}>
                    <span className="text-xl">{CATEGORY_ICONS[cat]}</span>
                    <span className="text-xs font-medium text-foreground">{cat}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Description</label>
              <input type="text" placeholder="e.g. Lunch at college canteen"
                value={description} onChange={e => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground focus:outline-none focus:border-primary transition-colors" />
            </div>

            {/* Date */}
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground focus:outline-none focus:border-primary transition-colors" />
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm px-4 py-3 rounded-xl">{error}</div>
            )}

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => navigate("/")}
                className="flex-1 py-3 rounded-xl border-2 border-border text-foreground font-medium text-sm hover:bg-muted transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={loading}
                className="flex-1 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-60">
                {loading ? "Adding..." : "Add Expense"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
