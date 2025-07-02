import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";

import {
  addExpense,
  deleteExpense,
  editExpense,
  getAllExpense,
} from "../controllers/expense.controller.js";

const ExpenseRouter = express.Router();

// Expense CRUD Routes
ExpenseRouter.get("/", verifyToken, getAllExpense);
ExpenseRouter.post("/", verifyToken, addExpense);
ExpenseRouter.put("/", verifyToken, editExpense);
ExpenseRouter.delete("/:id", verifyToken, deleteExpense);

export default ExpenseRouter;
