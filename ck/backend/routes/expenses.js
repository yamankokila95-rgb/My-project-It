import express from "express";
import { requireAuth } from "../middleware/auth.js";
import db from "../database.js";

const router = express.Router();
router.use(requireAuth);

const VALID_CATEGORIES = ["Food", "Travel", "Recharge", "Shopping", "Other"];

// GET /api/expenses
router.get("/expenses", (req, res) => {
  try {
    const { month } = req.query;
    let query = "SELECT * FROM expenses WHERE userId = ?";
    const params = [req.user.id];
    if (month) {
      query += " AND date LIKE ?";
      params.push(`${month}%`);
    }
    query += " ORDER BY date DESC, createdAt DESC";
    const rows = db.prepare(query).all(...params);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/expenses
router.post("/expenses", (req, res) => {
  try {
    const { amount, category, description, date } = req.body;
    if (!amount || !category || !description || !date)
      return res.status(400).json({ error: "All fields required" });
    if (!VALID_CATEGORIES.includes(category))
      return res.status(400).json({ error: "Invalid category" });
    if (isNaN(Number(amount)) || Number(amount) <= 0)
      return res.status(400).json({ error: "Amount must be a positive number" });

    const result = db.prepare(
      "INSERT INTO expenses (userId, amount, category, description, date) VALUES (?, ?, ?, ?, ?)"
    ).run(req.user.id, Number(amount), category, description.trim(), date);

    res.json({ id: result.lastInsertRowid, message: "Expense added" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE /api/expenses/:id
router.delete("/expenses/:id", (req, res) => {
  try {
    const result = db.prepare("DELETE FROM expenses WHERE id = ? AND userId = ?")
      .run(req.params.id, req.user.id);
    if (result.changes === 0) return res.status(404).json({ error: "Expense not found" });
    res.json({ message: "Deleted" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/dashboard
router.get("/dashboard", (req, res) => {
  try {
    const now = new Date();
    const currentMonth = now.toISOString().slice(0, 7);
    const today = now.toISOString().split("T")[0];

    const monthExpenses = db.prepare(
      "SELECT * FROM expenses WHERE userId = ? AND date LIKE ?"
    ).all(req.user.id, `${currentMonth}%`);

    const monthTotal = monthExpenses.reduce((s, e) => s + e.amount, 0);
    const todayTotal = monthExpenses
      .filter(e => e.date === today)
      .reduce((s, e) => s + e.amount, 0);

    const catTotals = {};
    monthExpenses.forEach(e => {
      catTotals[e.category] = (catTotals[e.category] || 0) + e.amount;
    });

    const categories = Object.entries(catTotals)
      .map(([category, amount]) => ({
        category, amount,
        percentage: monthTotal > 0 ? Math.round((amount / monthTotal) * 100) : 0
      }))
      .sort((a, b) => b.amount - a.amount);

    const daysElapsed = Math.max(1, now.getDate());
    const avgDaily = Math.round(monthTotal / daysElapsed);

    const recent = db.prepare(
      "SELECT * FROM expenses WHERE userId = ? ORDER BY date DESC, createdAt DESC LIMIT 5"
    ).all(req.user.id);

    const user = db.prepare("SELECT monthlyBudget FROM users WHERE id = ?").get(req.user.id);

    res.json({
      monthTotal, todayTotal, avgDaily, categories, recent,
      monthlyBudget: user.monthlyBudget || 0, currentMonth
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PATCH /api/budget
router.patch("/budget", (req, res) => {
  try {
    const { budget } = req.body;
    if (isNaN(Number(budget)) || Number(budget) < 0)
      return res.status(400).json({ error: "Budget must be a non-negative number" });
    db.prepare("UPDATE users SET monthlyBudget = ? WHERE id = ?").run(Number(budget), req.user.id);
    res.json({ message: "Budget updated" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;
