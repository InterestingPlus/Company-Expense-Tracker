// controllers/report.controller.js
import expenseModel from "../models/expense.model.js";
import incomeModel from "../models/income.model.js";
import mongoose from "mongoose";

export const getReport = async (req, res) => {
  try {
    const { from, to } = req.query;
    const adminId = req.admin.id;

    const fromDate = new Date(from);
    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999); // include entire day

    // Common filter
    const dateFilter = {
      adminId,
      date: { $gte: fromDate, $lte: toDate },
    };

    // -----------------------
    //  1. Totals
    const totalExpenseAgg = await expenseModel.aggregate([
      { $match: dateFilter },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalIncomeAgg = await incomeModel.aggregate([
      { $match: dateFilter },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalExpense = totalExpenseAgg[0]?.total || 0;
    const totalIncome = totalIncomeAgg[0]?.total || 0;
    const balance = totalIncome - totalExpense;

    // -----------------------
    //  2. Daily Average
    const days =
      Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 3600 * 24)) +
      1;

    const avgExpense = totalExpense / days;
    const avgIncome = totalIncome / days;

    // -----------------------
    //  3. Recent 6 Transactions
    const expenses = await expenseModel
      .find(dateFilter)
      .sort({ date: -1 })
      .limit(6);
    const incomes = await incomeModel
      .find(dateFilter)
      .sort({ date: -1 })
      .limit(6);

    const recent = [
      ...expenses.map((e) => ({ ...e.toObject(), type: "expense" })),
      ...incomes.map((i) => ({ ...i.toObject(), type: "income" })),
    ]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 6);

    // -----------------------
    //  4. Monthly Breakdown (max 8 months)
    const monthlyExpenses = await expenseModel.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: {
            month: { $month: "$date" },
            year: { $year: "$date" },
          },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 8 },
    ]);

    const monthlyIncomes = await incomeModel.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: {
            month: { $month: "$date" },
            year: { $year: "$date" },
          },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 8 },
    ]);

    // -----------------------
    //  5. Category-wise Expense Breakdown
    const categoryWise = await expenseModel.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
      { $sort: { total: -1 } },
    ]);

    // -----------------------
    //  6. Payment Method-wise Breakdown
    const methodWise = await expenseModel.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: "$paymentMethod",
          total: { $sum: "$amount" },
        },
      },
    ]);

    res.json({
      totals: {
        expense: totalExpense,
        income: totalIncome,
        balance,
      },
      dailyAverage: {
        expense: avgExpense,
        income: avgIncome,
      },
      recent,
      monthly: {
        expenses: monthlyExpenses,
        incomes: monthlyIncomes,
      },
      categoryWise,
      paymentMethodWise: methodWise,
    });
  } catch (error) {
    console.error("❌ Error generating report:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
