import React, { useEffect, useState } from "react";
import IncomeForm from "../components/IncomeForm";
import axios from "../config/axios";
import { toast } from "react-toastify";
import "./Expense.scss";

import { ReactComponent as EditIcon } from "../assets/icons/edit.svg";
import { ReactComponent as DeleteIcon } from "../assets/icons/delete.svg";
import { ReactComponent as NoIncomes } from "../assets/icons/no-data.svg";
import { useNavigate } from "react-router-dom";

const Income = () => {
  const [isLoading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [incomes, setIncomes] = useState([]);
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
  const [editIncome, setEditIncome] = useState(null);

  async function getAllIncomes() {
    try {
      if (incomes.length === 0) setLoading(true);

      const res = await axios.get("/income");

      console.log("All Incomes:", res?.data?.data);
      setIncomes(res?.data?.data);
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
    getAllIncomes();
    getAllCategories();
  }, []);

  const handleAddIncome = async (income) => {
    try {
      setLoading(true);

      const res = await axios.post("/income", income);

      toast.success("Income added successfully!");
      console.log("✅ Added:", res?.data?.data);

      await getAllIncomes(); // ✅ Refresh list
    } catch (error) {
      console.error("❌ Error adding Income:", error);
      alert(error?.response?.data?.error || "Failed to add Income");
    } finally {
      setLoading(false);
    }
  };

  const handleEditIncome = async (income) => {
    console.log("Income to be edited:", income);

    try {
      const res = await axios.put("/income", income);

      toast.success("Income Updated successfully!");
      console.log("✅ Updated:", res?.data?.data);

      await getAllIncomes(); // ✅ Refresh list
    } catch (error) {
      console.error("❌ Error editing Income:", error);
      alert(error?.response?.data?.error || "Failed to update Income");
    }
  };

  const handleDelete = async (income) => {
    console.log("Income to be deleted:", income);

    try {
      const res = await axios.delete("/income", {
        data: income,
      });

      toast.success("Income Deleted successfully!");
      console.log("✅ Deleted:", res?.data?.data);

      await getAllIncomes();
    } catch (error) {
      console.error("❌ Error deleting Income:", error);
      alert(error?.response?.data?.error || "Failed to delete Income");
    }
  };

  const handleAddClick = () => {
    setEditIncome(null);
    setOpenModal(true);
  };

  const handleEditClick = (income) => {
    setEditIncome(income);
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
  const [filteredIncomes, setFilteredIncomes] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    let filtered = [...incomes];
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
        (income) =>
          income.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          income.amount.toString().includes(searchQuery) ||
          income.notes?.toLowerCase().includes(searchQuery)
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

    setFilteredIncomes(filtered);
  }, [
    searchQuery,
    filterCategory,
    filterMethod,
    specificDate,
    specificMonth,
    specificYear,
    filterDate,
    sortBy,
    incomes,
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
      <h1>Incomes</h1>

      <div className="action">
        <button onClick={handleAddClick} className="add-expense">
          Add Income
        </button>

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
          <IncomeForm
            income={editIncome}
            onCancel={() => {
              setOpenModal(false);
              setEditIncome();
            }}
            onSubmit={(data) => {
              if (!editIncome) {
                handleAddIncome(data);
              } else {
                handleEditIncome(data);
              }
              setOpenModal(false);
            }}
          />
        </div>
      )}

      <div className="expense-cards">
        {!isLoading ? (
          incomes.length > 0 && filteredIncomes.length > 0 ? (
            filteredIncomes.map((income) => (
              <div className="expense-card" key={income._id}>
                <div className="expense-main">
                  <div className="expense-title">
                    <h3>{income.description}</h3>
                    <span className="expense-amount">₹{income.amount}</span>
                  </div>

                  <div className="expense-details">
                    <span>
                      {categoryIcon(income.category) || "📌"}{" "}
                      {categoryName(income.category) || "Uncategorized"}
                    </span>
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
            <div className="empty-state">
              <NoIncomes />
              <h2>No Incomes Found</h2>
              <p>Try adjusting your filters or add a new Income.</p>
            </div>
          )
        ) : (
          <div className="loading-state">
            <span className="spinner"> </span>
            <p>Loading your Incomes...</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Income;
