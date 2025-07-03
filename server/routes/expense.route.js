import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";

import {
  addExpense,
  deleteExpense,
  editExpense,
  getAllExpense,
  MonthlySpendExpense,
  YearlySpendExpense,
} from "../controllers/expense.controller.js";

const ExpenseRouter = express.Router();

// Expense CRUD Routes
ExpenseRouter.get("/", verifyToken, getAllExpense);
ExpenseRouter.post("/", verifyToken, addExpense);
ExpenseRouter.put("/", verifyToken, editExpense);
ExpenseRouter.delete("/", verifyToken, deleteExpense);

ExpenseRouter.post("/monthly", verifyToken, MonthlySpendExpense);
ExpenseRouter.post("/yearly", verifyToken, YearlySpendExpense);

export default ExpenseRouter;
