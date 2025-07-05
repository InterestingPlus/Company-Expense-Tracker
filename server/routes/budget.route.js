import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { getBudget, updateBudget } from "../controllers/budget.controller.js";

const BudgetRouter = express.Router();

BudgetRouter.get("/", verifyToken, getBudget);
BudgetRouter.put("/", verifyToken, updateBudget);

export default BudgetRouter;
