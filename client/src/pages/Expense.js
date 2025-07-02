import React, { useEffect, useState } from "react";
import ExpenseForm from "../components/ExpenseForm";
import axios from "axios";
import apiPath from "../isProduction";
import { toast } from "react-toastify";
import "./Expense.scss";

const Expense = () => {
  const [isLoading, setLoading] = useState(true);

  const [expenses, setExpenses] = useState([]);

  const [openModal, setOpenModal] = useState(false);
  const [editExpense, setEditExpense] = useState(null);

  async function getAllExpenses() {
    try {
      if (expenses.length === 0) setLoading(true);

      const res = await axios.get(`${await apiPath()}/api/v1/expense`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("All Expenses:", res?.data?.data);
      setExpenses(res?.data?.data);
    } catch (error) {
      alert(error);
    }

    setLoading(false);
  }

  useEffect(() => {
    getAllExpenses();
  }, []);

  const handleAddExpense = async (expense) => {
    try {
      setLoading(true);

      const res = await axios.post(
        `${await apiPath()}/api/v1/expense`,
        expense,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Expense added successfully!");
      console.log("✅ Added:", res?.data?.data);

      await getAllExpenses(); // ✅ Refresh list
    } catch (error) {
      console.error("❌ Error adding expense:", error);
      alert(error?.response?.data?.error || "Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  const handleEditExpense = async (expense) => {
    try {
      const res = await axios.put(
        `${await apiPath()}/api/v1/expense`,
        { _id: expense._id, ...expense },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("✅ Updated:", res?.data?.data);

      await getAllExpenses(); // ✅ Refresh list
    } catch (error) {
      console.error("❌ Error editing expense:", error);
      alert(error?.response?.data?.error || "Failed to update expense");
    }
  };

  const handleAddClick = () => {
    setEditExpense(null);
    setOpenModal(true);
  };

  const handleEditClick = (expense) => {
    setEditExpense(expense);
    setOpenModal(true);
  };

  return (
    <main id="expense">
      <h1>Expenses</h1>

      <input type="search" placeholder="Search..." />

      <button onClick={handleAddClick}>Add Expense</button>

      {openModal && (
        <div id="expense-modal">
          <ExpenseForm
            expense={editExpense}
            onCancel={() => {
              setOpenModal(false);
              setEditExpense();
            }}
            onSubmit={(data) => {
              if (!editExpense) {
                handleAddExpense(data);
              } else {
                handleEditExpense(data);
              }
              setOpenModal(false);
            }}
          />
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {!isLoading ? (
            expenses.length > 0 ? (
              expenses?.map((expense) => (
                <tr key={expense?._id}>
                  <td>{expense?.description}</td>
                  <td>₹{expense?.amount}</td>
                  <td>
                    <button onClick={() => handleEditClick(expense)}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3}>No Expenses Found</td>
              </tr>
            )
          ) : (
            <tr>
              <td colSpan={3}>Loading...</td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  );
};

export default Expense;
