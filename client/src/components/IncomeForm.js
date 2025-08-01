import { useEffect, useState } from "react";
import "./ExpenseForm.scss";
import axios from "../config/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const IncomeForm = ({ income = {}, onSubmit, onCancel }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    _id: "",
    description: "",
    amount: "",
    notes: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    paymentMethod: "",
  });

  const [categories, setCategories] = useState([
    {
      _id: "a1",
      name: "Shopping",
      icon: "🛍️",
    },
    {
      _id: "b2",
      name: "Food",
      icon: "🍔",
    },
    {
      _id: "c3",
      name: "Travel",
      icon: "🚗",
    },
    {
      _id: "d4",
      name: "Rent",
      icon: "🏠",
    },
    {
      _id: "e5",
      name: "Misc",
      icon: "📦",
    },
  ]);

  useEffect(() => {
    if (income?._id) {
      setFormData({
        _id: income._id,
        description: income.description || "",
        amount: income.amount || "",
        notes: income.notes || "",
        category: income.category || "",
        date:
          income.date?.substring(0, 10) ||
          new Date().toISOString().split("T")[0],
        paymentMethod: income.paymentMethod || "",
      });
    }
  }, [income]);

  async function getAllCategories() {
    try {
      const res = await axios.get("/category");

      console.log("All Categories:", res?.data?.data);
      setCategories(res?.data?.data);
    } catch (error) {
      toast.error(error);
      alert(error);
    }
  }

  useEffect(() => {
    getAllCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });

    if (name === "category") {
      if (value === "navigate") {
        navigate("/category");
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit(formData);
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <h2>{formData._id ? "Edit Income" : "Add New Income"}</h2>

      <label>
        Description *
        <input
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter description"
          required
        />
      </label>

      <label>
        Amount *
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
        Category *
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select category</option>

          {categories?.map((category) => (
            <option value={category._id}>
              {category.icon} {category.name}
            </option>
          ))}

          <option value="navigate">Modify Categories</option>
        </select>
      </label>

      <label>
        Date *
        <input
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Payment Method *
        <select
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleChange}
          required
        >
          <option value="">Select payment method</option>
          <option value="Cash">Cash</option>
          <option value="UPI">UPI</option>
          <option value="Bank">Bank</option>
          <option value="Card">Card</option>
        </select>
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

export default IncomeForm;
