import React, { useEffect, useState } from "react";
import ExpenseForm from "../components/ExpenseForm";
import axios from "axios";
import apiPath from "../isProduction";
import { toast } from "react-toastify";
import "./Expense.scss";

import { ReactComponent as EditIcon } from "../assets/icons/edit.svg";
import { ReactComponent as DeleteIcon } from "../assets/icons/delete.svg";

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
    console.log("Expense to be edited:", expense);

    try {
      const res = await axios.put(
        `${await apiPath()}/api/v1/expense`,
        expense,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Expense Updated successfully!");
      console.log("✅ Updated:", res?.data?.data);

      await getAllExpenses(); // ✅ Refresh list
    } catch (error) {
      console.error("❌ Error editing expense:", error);
      alert(error?.response?.data?.error || "Failed to update expense");
    }
  };

  const handleDelete = async (expense) => {
    console.log("Expense to be deleted:", expense);

    try {
      const res = await axios.delete(`${await apiPath()}/api/v1/expense`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: expense,
      });

      toast.success("Expense Deleted successfully!");
      console.log("✅ Deleted:", res?.data?.data);

      await getAllExpenses();
    } catch (error) {
      console.error("❌ Error deleting expense:", error);
      alert(error?.response?.data?.error || "Failed to delete expense");
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

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredExpenses, setFilteredExpenses] = useState([]);

  useEffect(() => {
    const filtered =
      searchQuery.trim().length > 0
        ? expenses.filter((expense) =>
            expense.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
          )
        : expenses;

    setFilteredExpenses(filtered);
  }, [searchQuery, expenses]);

  return (
    <main id="expense">
      <h1>Expenses</h1>

      <input
        type="search"
        id="search"
        placeholder="Search..."
        onInput={(e) => {
          setSearchQuery(e.target.value);
        }}
      />

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

      <div className="expense-cards">
        {!isLoading ? (
          expenses.length > 0 ? (
            filteredExpenses.map((expense) => (
              <div className="expense-card" key={expense._id}>
                <div className="expense-main">
                  <div className="expense-title">
                    <h3>{expense.description}</h3>
                    <span className="expense-amount">₹{expense.amount}</span>
                  </div>

                  <div className="expense-details">
                    <span>📌 {expense.category || "Uncategorized"}</span>
                    <span>
                      🗓️{" "}
                      {new Date(expense.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <span>💳 {expense.paymentMethod || "Unknown"}</span>
                    {expense.receipt && (
                      <span>
                        📄{" "}
                        <a
                          href={expense.receipt}
                          target="_blank"
                          rel="noreferrer"
                        >
                          View Receipt
                        </a>
                      </span>
                    )}
                  </div>

                  {expense.notes && (
                    <details className="expense-notes">
                      <summary>📝 Notes</summary>
                      <p>{expense.notes}</p>
                    </details>
                  )}

                  <div className="expense-actions">
                    <button
                      className="edit-btn"
                      onClick={() => handleEditClick(expense)}
                    >
                      <EditIcon />
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(expense)}
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No Expenses Found</p>
          )
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </main>
  );
};

export default Expense;
