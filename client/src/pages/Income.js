import React, { useEffect, useState } from "react";
import IncomeForm from "../components/IncomeForm";
import axios from "axios";
import apiPath from "../isProduction";
import { toast } from "react-toastify";
import "./Expense.scss";

import { ReactComponent as EditIcon } from "../assets/icons/edit.svg";
import { ReactComponent as DeleteIcon } from "../assets/icons/delete.svg";

const Expense = () => {
  const [isLoading, setLoading] = useState(true);

  const [incomes, setIncome] = useState([]);

  const [openModal, setOpenModal] = useState(false);
  const [editExpense, setEditExpense] = useState(null);

  async function getAllIncome() {
    try {
      if (incomes.length === 0) setLoading(true);

      const res = await axios.get(`${await apiPath()}/api/v1/expense`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("All Income:", res?.data?.data);
      setIncome(res?.data?.data);
    } catch (error) {
      alert(error);
    }

    setLoading(false);
  }

  useEffect(() => {
    getAllIncome();
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

      await getAllIncome(); // ✅ Refresh list
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

      await getAllIncome(); // ✅ Refresh list
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

      await getAllIncome();
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

  return (
    <main id="expense">
      <h1>Income</h1>

      <input type="search" placeholder="Search..." />

      <button onClick={handleAddClick}>Add Income</button>

      {openModal && (
        <div id="expense-modal">
          <IncomeForm
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
          incomes.length > 0 ? (
            incomes.map((income) => (
              <div className="expense-card" key={income._id}>
                <div className="expense-main">
                  <div className="expense-title">
                    <h3>{income.description}</h3>
                    <span className="expense-amount">₹{income.amount}</span>
                  </div>

                  <div className="expense-details">
                    <span>📌 {income.category || "Uncategorized"}</span>
                    <span>
                      🗓️{" "}
                      {new Date(income.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <span>💳 {income.paymentMethod || "Unknown"}</span>
                    {income.receipt && (
                      <span>
                        📄{" "}
                        <a
                          href={income.receipt}
                          target="_blank"
                          rel="noreferrer"
                        >
                          View Receipt
                        </a>
                      </span>
                    )}
                  </div>

                  {income.notes && (
                    <details className="expense-notes">
                      <summary>📝 Notes</summary>
                      <p>{income.notes}</p>
                    </details>
                  )}

                  <div className="expense-actions">
                    <button
                      className="edit-btn"
                      onClick={() => handleEditClick(income)}
                    >
                      <EditIcon />
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(income)}
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No Income Found</p>
          )
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </main>
  );
};

export default Expense;
