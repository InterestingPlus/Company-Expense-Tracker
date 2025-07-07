import React, { useEffect, useState } from "react";
import ExpenseForm from "../components/ExpenseForm";
import axios from "../config/axios";
import { toast } from "react-toastify";
import "./Expense.scss";

import { ReactComponent as EditIcon } from "../assets/icons/edit.svg";
import { ReactComponent as DeleteIcon } from "../assets/icons/delete.svg";
import { ReactComponent as NoExpenses } from "../assets/icons/no-data.svg";
import { useNavigate } from "react-router-dom";
import * as html2pdf from "html2pdf.js";

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

      const res = await axios.get("/expense");

      console.log("All Expenses:", res?.data?.data);
      setExpenses(res?.data?.data);
    } catch (error) {
      alert(error);
    }

    setLoading(false);
  }

  async function getAllCategories() {
    try {
      const res = await axios.get("/category");

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

      const res = await axios.post("/expense", expense);

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
      const res = await axios.put("/expense", expense);

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
      const res = await axios.delete("/expense", {
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

  // Search
  const [searchQuery, setSearchQuery] = useState("");

  // Filter
  const [filterCategory, setFilterCategory] = useState("");
  const [filterMethod, setFilterMethod] = useState("");

  // Data Filters
  const [filterDate, setFilterDate] = useState("");
  const [specificDate, setSpecificDate] = useState("");
  const [specificMonth, setSpecificMonth] = useState("");
  const [specificYear, setSpecificYear] = useState("");

  // Sort
  const [sortBy, setSortBy] = useState("");

  // FilteredData
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

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

  const [isPrinting, setIsPrinting] = useState(false);

  function printExpenses() {
    setIsPrinting(true);

    setTimeout(() => {
      setIsPrinting(true);

      const element = document.getElementById("expense-print-table");
      const today = new Date();
      const month = today.toLocaleString("default", { month: "long" });
      const year = today.getFullYear();

      const opt = {
        margin: [0.5, 0.5, 0.7, 0.5],
        filename: `Expenses Report - ${month} ${year}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      };

      html2pdf()
        .set(opt)
        .from(element)
        .toPdf()
        .get("pdf")
        .then((pdf) => {
          const totalPages = pdf.internal.getNumberOfPages();
          const footer = "Company Expense Tracker | Jatin Poriya";

          for (let i = 1; i <= totalPages; i++) {
            pdf.setPage(i);
            pdf.setFontSize(10);
            pdf.setTextColor(150);
            pdf.text(
              footer,
              pdf.internal.pageSize.getWidth() / 2,
              pdf.internal.pageSize.getHeight() - 0.3,
              { align: "center" }
            );
          }
        })
        .then((pdf) => {
          html2pdf().set(opt).from(element).save();
        });
    }, 2000);

    setTimeout(() => {
      setIsPrinting(false);
    }, 5000);
  }

  return (
    <main id="expense">
      <h1>Expenses</h1>

      <div className="action">
        <button onClick={handleAddClick} className="add-expense">
          Add Expense
        </button>

        <button onClick={printExpenses}>🖨 Print Expenses</button>

        <button
          className="toggle-filter"
          onClick={() => setShowFilters((prev) => !prev)}
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      <div className="filters">
        {showFilters && (
          <>
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
          </>
        )}
      </div>

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

      {/* Tablur Format */}
      <div
        id="expense-print-table"
        style={{ display: `${isPrinting ? "block" : "none"}` }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "10px" }}>
          Expenses Report
        </h1>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Description</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Payment Method</th>
              <th>Date</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map((exp) => (
              <tr key={exp._id}>
                <td>{exp.description}</td>
                <td>₹{exp.amount}</td>
                <td>{categoryName(exp.category)}</td>
                <td>{exp.paymentMethod}</td>
                <td>
                  {new Date(exp.date).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td>{exp.notes || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default Expense;
