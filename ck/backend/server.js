import express from "express";
import cors from "cors";
import db from "./database.js";
import authRoutes from "./routes/auth.js";
import expensesRoutes from "./routes/expenses.js";

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", expensesRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`💰 SpendSmart server on port ${PORT}`));
