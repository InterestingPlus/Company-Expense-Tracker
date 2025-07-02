import expenseModel from "../models/expense.model.js";

export const getAllExpense = async (req, res) => {
  try {
    const expense = await expenseModel.find({ adminId: req.admin.id });

    console.log(`All Expenses Fetched Successfully by ${req.admin.name}`);

    res.status(201).json({ data: expense });
  } catch (error) {
    res.status(500).json({ error: `Internal Sever Error: ${error.message}` });
  }
};

export const addExpense = async (req, res) => {
  const { description, notes, amount, category, date, paymentMethod, receipt } =
    req.body;

  try {
    const expense = await expenseModel.create({
      description,
      notes,
      amount,
      category,
      date,
      paymentMethod,
      receipt,
      adminId: req.admin.id,
    });

    console.log(
      `Expense Added Successfully by ${req.admin.name},\n with Description : ${expense.description}, Amount : ${expense.amount}`
    );

    res
      .status(201)
      .json({ description: expense.description, amount: expense.amount });
  } catch (error) {
    console.log(`Error adding Expenses: ${error.message}`);
    res.status(500).json({ error: `Error adding Expenses: ${error.message}` });
  }
};

export const editExpense = async (req, res) => {
  const {
    _id,
    description,
    notes,
    amount,
    category,
    date,
    paymentMethod,
    receipt,
  } = req.body;

  if (!_id) {
    return res.status(400).json({ error: "Expense ID is required." });
  }

  try {
    const updatedExpense = await expenseModel.findOneAndUpdate(
      { _id, adminId: req.admin.id },
      {
        description,
        notes,
        amount,
        category,
        date,
        paymentMethod,
        receipt,
      },
      { new: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({ error: "Expense not found." });
    }

    console.log(
      `✅ Expense Updated by ${req.admin.name}: ${updatedExpense.description}, ₹${updatedExpense.amount}`
    );

    res.status(200).json({
      message: "Expense updated successfully",
      data: updatedExpense,
    });
  } catch (error) {
    console.error("❌ Error updating expense:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteExpense = async (req, res) => {
  const { description, notes, amount, category, date, paymentMethod, receipt } =
    req.body;

  try {
    const expense = await expenseModel.create({
      description,
      notes,
      amount,
      category,
      date,
      paymentMethod,
      receipt,
      adminId: req.admin._id,
    });

    console.log(
      `Expense Added Successfully by ${req.admin.name},\n with Description : ${expense.description}, Amount : ${expense.amount}`
    );

    res
      .status(201)
      .json({ description: expense.description, amount: expense.amount });
  } catch (error) {
    res.status(500).json({ error: `Internal Sever Error: ${error.message}` });
  }
};
