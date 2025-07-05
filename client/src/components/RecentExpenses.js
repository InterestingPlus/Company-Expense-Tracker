import React, { useEffect, useState } from "react";
import apiPath from "../isProduction";
import axios from "axios";
import { Link } from "react-router-dom";

import "./RecentExpenses.scss";

const RecentExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setLoading] = useState(true);

  async function getRecentExpenses() {
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
      console.error(error);
    }

    setLoading(false);
  }

  useEffect(() => {
    getRecentExpenses();
  }, []);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

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
      console.error(error);
    }
  }

  useEffect(() => {
    getAllCategories();
  }, []);

  return (
    <section id="recent">
      <div>
        <h3>Recent Expenses</h3>
        <Link to="/expense" title="View All">
          View All {">"}
        </Link>
      </div>
      <ul>
        {!isLoading ? (
          expenses?.length > 0 ? (
            expenses?.map((expense) => {
              return (
                <li>
                  <span className="expense-icon">
                    {categories.find(
                      (category) => category._id === expense?.category
                    )?.icon || "d"}
                  </span>

                  <div className="expense-info">
                    <h4>{expense?.description}</h4>
                    <span>
                      {new Date(expense.date).getDate()}
                      {", "}
                      {months[new Date(expense.date).getMonth()]}
                    </span>
                  </div>
                  <h5>₹{expense?.amount}</h5>
                </li>
              );
            })
          ) : (
            <h2>No Expenses Found</h2>
          )
        ) : (
          <div className="loading-state">
            <span className="spinner"> </span>
            <p>Loading Recent Expenses...</p>
          </div>
        )}
      </ul>
    </section>
  );
};

export default RecentExpenses;
