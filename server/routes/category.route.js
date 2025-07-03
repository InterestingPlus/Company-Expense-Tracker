import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";

import {
  getAllCategories,
  addCategory,
  editCategory,
  deleteCategory,
} from "../controllers/category.controller.js";

const CategoryRouter = express.Router();

// Expense CRUD Routes
CategoryRouter.get("/", verifyToken, getAllCategories);
CategoryRouter.post("/", verifyToken, addCategory);
CategoryRouter.put("/", verifyToken, editCategory);
CategoryRouter.delete("/", verifyToken, deleteCategory);

export default CategoryRouter;
