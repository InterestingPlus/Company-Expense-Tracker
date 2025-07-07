import incomeModel from "../models/income.model.js";

export const getAllIncome = async (req, res) => {
  try {
    const income = await incomeModel.find({ adminId: req.admin.id });

    console.log(`All Income Fetched Successfully by ${req.admin.name}`);

    res.status(201).json({ data: income });
  } catch (error) {
    res.status(500).json({ error: `Internal Sever Error: ${error.message}` });
  }
};

export const addIncome = async (req, res) => {
  const { description, notes, amount, category, date, paymentMethod } =
    req.body;

  try {
    const income = await incomeModel.create({
      description,
      notes,
      amount,
      category,
      date,
      paymentMethod,

      adminId: req.admin.id,
    });

    console.log(
      `Income Added Successfully by ${req.admin.name},\n with Description : ${income.description}, Amount : ${income.amount}`
    );

    res
      .status(201)
      .json({ description: income.description, amount: income.amount });
  } catch (error) {
    console.log(`Error adding Income: ${error.message}`);
    res.status(500).json({ error: `Error adding Income: ${error.message}` });
  }
};

export const editIncome = async (req, res) => {
  const { _id, description, notes, amount, category, date, paymentMethod } =
    req.body;

  if (!_id) {
    return res.status(400).json({ error: "Income ID is required." });
  }

  try {
    const updatedIncome = await incomeModel.findOneAndUpdate(
      { _id, adminId: req.admin.id },
      {
        description,
        notes,
        amount,
        category,
        date,
        paymentMethod,
      },
      { new: true }
    );

    if (!updatedIncome) {
      return res.status(404).json({ error: "Income not found." });
    }

    console.log(
      `✅ Income Updated by ${req.admin.name}: ${updatedIncome.description}, ₹${updatedIncome.amount}`
    );

    res.status(200).json({
      message: "Income updated successfully",
      data: updatedIncome,
    });
  } catch (error) {
    console.error("❌ Error updating Income:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteIncome = async (req, res) => {
  if (!req.body._id) {
    return res.status(400).json({ error: "Income ID is required." });
  }

  try {
    const deletedIncome = await incomeModel.findOneAndDelete({
      _id: req.body._id,
      adminId: req.admin.id,
    });

    if (!deletedIncome) {
      return res.status(404).json({ error: "Income not found." });
    }

    console.log(
      `✅ Income Deleted by ${req.admin.name}: ${deletedIncome.description}`
    );

    res.status(200).json({
      message: "Income deleted successfully",
      data: deletedIncome,
    });
  } catch (error) {
    console.error("❌ Error deleting Income:", error.message);
    res
      .status(500)
      .json({ message: "Error deleting Income", error: error.message });
  }
};
