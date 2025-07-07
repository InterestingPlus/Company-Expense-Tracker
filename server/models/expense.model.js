import mongoose from "mongoose";

const ExpenseSchema = mongoose.Schema({
  description: { type: String, required: true },
  notes: { type: String },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: Date, required: true },
  paymentMethod: { type: String, required: true }, // Enum(["Cash", "Bank", "UPI", "Card"])
  receipt: { type: String },
  adminId: { type: String, required: true },
});

export default mongoose.model("Expense", ExpenseSchema);
