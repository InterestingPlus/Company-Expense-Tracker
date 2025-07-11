import express from "express";
import DBConnection from "./config/db.js";
import { configDotenv } from "dotenv";
import cors from "cors";
import AdminRouter from "./routes/admin.route.js";
import ExpenseRouter from "./routes/expense.route.js";
import CategoryRouter from "./routes/category.route.js";
import job from "./config/cron.js";
import BudgetRouter from "./routes/budget.route.js";
import ReportRouter from "./routes/report.route.js";
import IncomeRouter from "./routes/income.route.js";

const app = express();
app.use(cors());
app.use(express.json());

configDotenv();
const PORT = process.env.PORT || 5000;

// Default Route
app.get("/", (req, res) => {
  res
    .json({
      message: "Hello, Welcome to the Expense Tracker API",
      success: true,
    })
    .status(200);
});

// Admin Route
app.use("/api/v1/admin", AdminRouter);
app.use("/api/v1/expense", ExpenseRouter);
app.use("/api/v1/income", IncomeRouter);
app.use("/api/v1/category", CategoryRouter);
app.use("/api/v1/budget", BudgetRouter);
app.use("/api/v1/report", ReportRouter);

// Expense Route
// app.use("api/v1/expense", ExpenseRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});

// DataBase Connection
DBConnection();

job.start();
