import budgetModel from "../models/budget.model.js";

export const getBudget = async (req, res) => {
  try {
    const budget = await budgetModel.findOne({ adminId: req.admin.id });
    res.status(200).json({ budget });
  } catch (error) {
    console.log("Error while Fetching Budget:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateBudget = async (req, res) => {
  try {
    const body = req.body;

    if (!body || !body.totalBudget) {
      return res.status(400).json({ message: "Budget data is missing." });
    }

    let budget = await budgetModel.findOneAndUpdate(
      { adminId: req.admin.id },
      { ...body, adminId: req.admin.id },
      { new: true, upsert: true }
    );

    console.log(
      `✅ Budget ${
        budget.createdAt === budget.updatedAt ? "Created" : "Updated"
      } by ${req.admin.name}, Total Budget: ₹${budget.totalBudget}`
    );

    res.status(200).json({ budget });
  } catch (error) {
    console.log("❌ Error while updating budget:", error);
    res.status(500).json({ message: error.message });
  }
};
