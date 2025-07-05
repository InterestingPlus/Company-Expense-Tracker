import mongoose from "mongoose";

const subcategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
});

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  subcategories: [subcategorySchema],
});

const budgetSchema = new mongoose.Schema(
  {
    totalBudget: { type: Number, required: true },
    adminId: {
      type: String,
      required: true,
    },
    categories: [categorySchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Budget", budgetSchema);
