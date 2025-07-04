import React, { useEffect, useState } from "react";
import ExpenseForm from "../components/ExpenseForm";
import axios from "axios";
import apiPath from "../isProduction";
import { toast } from "react-toastify";
import "./Expense.scss";

import { ReactComponent as EditIcon } from "../assets/icons/edit.svg";
import { ReactComponent as DeleteIcon } from "../assets/icons/delete.svg";
import { ReactComponent as NoExpenses } from "../assets/icons/no-data.svg";
import { useNavigate } from "react-router-dom";

const Expense = () => {
  const [isLoading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
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

  const paymentMethods = [
    {
      _id: "1gl3kjl",
      name: "Cash",
    },
    {
      _id: "12l3kjl",
      name: "Card",
    },
    {
      _id: "14gl3kjl",
      name: "Bank",
    },
    {
      _id: "153kjl",
      name: "UPI",
    },
  ];

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

  async function getAllCategories() {
    try {
      const res = await axios.get(`${await apiPath()}/api/v1/category`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("All Categories:", res?.data?.data);
      setCategories(res?.data?.data);
    } catch (error) {
      alert(error);
    }
  }

  useEffect(() => {
    getAllExpenses();
    getAllCategories();
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
  const [filterCategory, setFilterCategory] = useState("");
  const [filterMethod, setFilterMethod] = useState("");

  const [filterDate, setFilterDate] = useState("");
  const [specificDate, setSpecificDate] = useState("");
  const [specificMonth, setSpecificMonth] = useState("");
  const [specificYear, setSpecificYear] = useState("");

  const [sortBy, setSortBy] = useState("");

  const [filteredExpenses, setFilteredExpenses] = useState([]);

  useEffect(() => {
    let filtered = [...expenses];
    const now = new Date();

    // 🔥 Auto-set filterDate visually when specificDate/Month/Year matches
    const todayMatch =
      specificDate &&
      (() => {
        const d = new Date(specificDate);
        return (
          d.getDate() === now.getDate() &&
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      })();

    const thisMonthMatch =
      specificMonth &&
      (() => {
        const d = new Date(specificMonth);
        return (
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      })();

    const thisYearMatch =
      specificYear &&
      (() => {
        const y = new Date(`${specificYear}-01-01`);
        return y.getFullYear() === now.getFullYear();
      })();

    // 🧠 Update filterDate to reflect match (visually in <select>)
    if (todayMatch) setFilterDate("today");
    else if (thisMonthMatch) setFilterDate("thisMonth");
    else if (thisYearMatch) setFilterDate("thisYear");

    // 🔄 Apply effective filterDate (from select or auto)
    const effectiveFilterDate = filterDate;

    if (effectiveFilterDate === "today") {
      filtered = filtered.filter((exp) => {
        const d = new Date(exp.date);
        return (
          d.getDate() === now.getDate() &&
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      });
    } else if (effectiveFilterDate === "thisMonth") {
      filtered = filtered.filter((exp) => {
        const d = new Date(exp.date);
        return (
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      });
    } else if (effectiveFilterDate === "thisYear") {
      filtered = filtered.filter((exp) => {
        const d = new Date(exp.date);
        return d.getFullYear() === now.getFullYear();
      });
    }

    // 🔍 Search
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (expense) =>
          expense.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          expense.amount.toString().includes(searchQuery) ||
          expense.notes?.toLowerCase().includes(searchQuery)
      );
    }

    // 🎯 Category and Method
    if (filterCategory) {
      filtered = filtered.filter((exp) => exp.category === filterCategory);
    }
    if (filterMethod) {
      filtered = filtered.filter((exp) => exp.paymentMethod === filterMethod);
    }

    // 📅 Specific Date Filters
    if (specificDate) {
      filtered = filtered.filter((exp) => {
        const expDate = new Date(exp.date).toISOString().split("T")[0];
        return expDate === specificDate;
      });
    }

    if (specificMonth) {
      filtered = filtered.filter((exp) => {
        const d = new Date(exp.date);
        const y = d.getFullYear();
        const m = (d.getMonth() + 1).toString().padStart(2, "0");
        return `${y}-${m}` === specificMonth;
      });
    }

    if (specificYear) {
      filtered = filtered.filter(
        (exp) => new Date(exp.date).getFullYear().toString() === specificYear
      );
    }

    // ↕️ Sorting
    if (sortBy === "amount") {
      filtered.sort((a, b) => b.amount - a.amount);
    } else if (sortBy === "date") {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    setFilteredExpenses(filtered);
  }, [
    searchQuery,
    filterCategory,
    filterMethod,
    specificDate,
    specificMonth,
    specificYear,
    filterDate,
    sortBy,
    expenses,
  ]);

  const categoryIcon = (categoryId) => {
    return (
      categories.find((category) => category._id === categoryId)?.icon || ""
    );
  };

  const categoryName = (categoryId) => {
    return (
      categories.find((category) => category._id === categoryId)?.name || ""
    );
  };

  return (
    <main id="expense">
      <h1>Expenses</h1>

      <div className="filters">
        <div className="search-filter">
          <div className="search">
            <input
              type="search"
              id="search"
              placeholder="Search..."
              onInput={(e) => {
                setSearchQuery(e.target.value);
              }}
            />
          </div>

          <div className="filter">
            <select
              value={filterDate}
              onChange={(e) => {
                setSpecificDate("");
                setSpecificMonth("");
                setSpecificYear("");
                setFilterDate(e.target.value);
              }}
              className={`${filterDate !== "" ? "active" : ""}`}
            >
              <option value="">All Time</option>
              <option value="today">Today</option>
              <option value="thisMonth">This Month</option>
              <option value="thisYear">This Year</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => {
                if (e.target.value === "navigate") {
                  navigate("/category");
                }

                setFilterCategory(e.target.value);
              }}
              className={`${filterCategory !== "" ? "active" : ""}`}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.icon} {category.name}
                </option>
              ))}
              <option value="navigate">Modify Categories</option>
            </select>

            <select
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value)}
              className={`${filterMethod !== "" ? "active" : ""}`}
            >
              <option value="">All Methods</option>
              {paymentMethods.map((method) => (
                <option key={method._id} value={method.name}>
                  {method.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="sort">
          <span>Sort By :</span>
          <input
            type="radio"
            name="sortBy"
            value=""
            id="none"
            onChange={(e) => setSortBy(e.target.value)}
          />
          <label htmlFor="none">none</label>
          <input
            type="radio"
            name="sortBy"
            value="amount"
            id="amount"
            onChange={(e) => setSortBy(e.target.value)}
          />
          <label htmlFor="amount">Amount</label>
          <input
            type="radio"
            name="sortBy"
            value="date"
            id="date"
            onChange={(e) => setSortBy(e.target.value)}
          />
          <label htmlFor="date">Date</label>
        </div>

        <div className="date-filters">
          Specific :
          <div className="date-input">
            <label htmlFor="date">Day</label>
            <input
              type="date"
              name="date"
              id="date"
              value={specificDate}
              onChange={(e) => {
                setSpecificMonth("");
                setSpecificYear("");
                setFilterDate("");
                setSpecificDate(e.target.value);
              }}
              className={`${specificDate !== "" ? "active" : ""}`}
            />
          </div>
          <div className="date-input">
            <label htmlFor="month">Month</label>
            <input
              type="month"
              value={specificMonth}
              id="month"
              name="month"
              onChange={(e) => {
                setSpecificDate("");
                setSpecificYear("");
                setFilterDate("");
                setSpecificMonth(e.target.value);
              }}
              className={`${specificMonth !== "" ? "active" : ""}`}
            />
          </div>
          <div className="date-input">
            <label htmlFor="year">Year</label>
            <input
              type="number"
              placeholder="2025"
              min="2000"
              max="2099"
              step="1"
              name="year"
              id="year"
              value={specificYear}
              onChange={(e) => {
                setSpecificDate("");
                setSpecificMonth("");
                setFilterDate("");
                setSpecificYear(e.target.value);
              }}
              className={`${specificYear !== "" ? "active" : ""}`}
            />
          </div>
        </div>
      </div>

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
          expenses.length > 0 && filteredExpenses.length > 0 ? (
            filteredExpenses.map((expense) => (
              <div className="expense-card" key={expense._id}>
                <div className="expense-main">
                  <div className="expense-title">
                    <h3>{expense.description}</h3>
                    <span className="expense-amount">₹{expense.amount}</span>
                  </div>

                  <div className="expense-details">
                    <span>
                      {categoryIcon(expense.category) || "📌"}{" "}
                      {categoryName(expense.category) || "Uncategorized"}
                    </span>
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
            <div className="empty-state">
              <NoExpenses />
              <h2>No Expenses Found</h2>
              <p>Try adjusting your filters or add a new expense.</p>
            </div>
          )
        ) : (
          <div className="loading-state">
            <span className="spinner"> </span>
            <p>Loading your expenses...</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Expense;
