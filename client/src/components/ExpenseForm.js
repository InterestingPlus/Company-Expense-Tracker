import { useEffect, useState } from "react";
import "./ExpenseForm.scss";

const ExpenseForm = ({ expense = {}, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    _id: "",
    description: "",
    amount: "",
    notes: "",
    category: "",
    date: "",
    paymentMethod: "",
    receipt: null,
  });

  useEffect(() => {
    if (expense?._id) {
      setFormData({
        _id: expense._id,
        description: expense.description || "",
        amount: expense.amount || "",
        notes: expense.notes || "",
        category: expense.category || "",
        date: expense.date?.substring(0, 10) || "", // ISO to YYYY-MM-DD
        paymentMethod: expense.paymentMethod || "",
        receipt: null, // Don't prefill files
      });
    }
  }, [expense]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "receipt") {
      setFormData({ ...formData, receipt: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // FormData to handle file upload
    const form = new FormData();
    for (let key in formData) {
      if (formData[key] !== null) {
        form.append(key, formData[key]);
      }
    }

    onSubmit(form);
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <h2>{formData._id ? "Edit Expense" : "Add New Expense"}</h2>

      <label>
        Description
        <input
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter description"
          required
        />
      </label>

      <label>
        Amount
        <input
          name="amount"
          type="number"
          value={formData.amount}
          onChange={handleChange}
          placeholder="Enter amount"
          required
        />
      </label>

      <label>
        Notes
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Any notes..."
        />
      </label>

      <label>
        Category
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select category</option>
          <option value="Shopping">Shopping</option>
          <option value="Food">Food</option>
          <option value="Travel">Travel</option>
          <option value="Rent">Rent</option>
          <option value="Misc">Misc</option>
        </select>
      </label>

      <label>
        Date
        <input
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Payment Method
        <select
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleChange}
          required
        >
          <option value="">Select payment method</option>
          <option value="Cash">Cash</option>
          <option value="UPI">UPI</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="Card">Card</option>
        </select>
      </label>

      <label>
        Receipt (optional)
        <input
          type="file"
          name="receipt"
          accept="image/*,application/pdf"
          onChange={handleChange}
        />
      </label>

      <div className="form-actions">
        <button type="submit">{formData._id ? "Update" : "Add"}</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;
