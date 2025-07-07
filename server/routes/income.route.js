import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";

import {
  addIncome,
  deleteIncome,
  editIncome,
  getAllIncome,
} from "../controllers/income.controller.js";

import { upload } from "../middleware/multer.js";

const IncomeRouter = express.Router();

// Income CRUD Routes
IncomeRouter.get("/", verifyToken, getAllIncome);
IncomeRouter.post("/", verifyToken, addIncome);
IncomeRouter.put("/", verifyToken, editIncome);
IncomeRouter.delete("/", verifyToken, deleteIncome);

IncomeRouter.post(
  "/upload",
  verifyToken,
  upload.single("receipt"),
  (req, res) => {
    res.status(200).json({ url: req.file.path });
  }
);

export default IncomeRouter;
