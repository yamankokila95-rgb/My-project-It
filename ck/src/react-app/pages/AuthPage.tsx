import { useState } from "react";
import { useAuth } from "@/react-app/context/AuthContext";
import { Eye, EyeOff, Wallet, IndianRupee } from "lucide-react";

export default function AuthPage() {
  const { login } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch(`/api/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong"); return; }
      login(data.username, data.token);
    } catch {
      setError("Network error. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-primary p-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-white">SpendSmart</span>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center">
              <IndianRupee className="w-7 h-7 text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Track every rupee.<br />Spend with intention.
          </h2>
          <p className="text-white/70 text-lg">
            Simple, private expense tracking built for students and young professionals.
          </p>
        </div>
        <p className="text-white/40 text-sm">No ads. No trackers. Just your money.</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-foreground">SpendSmart</span>
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-1">
            {mode === "login" ? "Welcome back" : "Create account"}
          </h1>
          <p className="text-muted-foreground text-sm mb-8">
            {mode === "login" ? "Sign in to your account" : "Start tracking your spending today"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Username</label>
              <input type="text" placeholder="e.g. rahul_student"
                value={username} onChange={e => setUsername(e.target.value)}
                autoComplete="username"
                className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors text-sm" />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"}
                  placeholder={mode === "register" ? "At least 6 characters" : "Your password"}
                  value={password} onChange={e => setPassword(e.target.value)}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  className="w-full px-4 py-3 pr-11 rounded-xl border-2 border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors text-sm" />
                <button type="button" onClick={() => setShowPassword(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-60">
              {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}
            <button onClick={() => { setMode(m => m === "login" ? "register" : "login"); setError(""); }}
              className="ml-1.5 text-primary font-semibold hover:underline">
              {mode === "login" ? "Register" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
