import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";

import {
  addExpense,
  deleteExpense,
  editExpense,
  getAllExpense,
} from "../controllers/expense.controller.js";

import { upload } from "../middleware/multer.js";

const ExpenseRouter = express.Router();

// Expense CRUD Routes
ExpenseRouter.get("/", verifyToken, getAllExpense);
ExpenseRouter.post("/", verifyToken, addExpense);
ExpenseRouter.put("/", verifyToken, editExpense);
ExpenseRouter.delete("/", verifyToken, deleteExpense);

ExpenseRouter.post(
  "/upload",
  verifyToken,
  upload.single("receipt"),
  (req, res) => {
    res.status(200).json({ url: req.file.path });
  }
);

export default ExpenseRouter;
