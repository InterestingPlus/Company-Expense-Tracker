import React, { useEffect, useState } from "react";
import apiPath from "../isProduction";
import axios from "axios";
import { Link } from "react-router-dom";

import "./RecentExpenses.scss";

const RecentExpenses = ({ reportData }) => {
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

      // console.log("All Categories:", res?.data?.data);
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
        <h3>Recent Transactions</h3>
        <Link to="/expense" title="View All">
          View All {">"}
        </Link>
      </div>

      <ul>
        {reportData?.recent?.length > 0 ? (
          reportData?.recent?.map((transaction) => (
            <li key={transaction._id || transaction.date + transaction.amount}>
              <span className="transaction-icon">
                {categories.find(
                  (category) => category._id === transaction?.category
                )?.icon || "❔"}
              </span>

              <div className="transaction-info">
                <h4>{transaction?.description}</h4>
                <span>
                  {new Date(transaction.date).getDate()}
                  {", "}
                  {months[new Date(transaction.date).getMonth()]}
                </span>
              </div>
              <h5
                className={transaction.type === "income" ? "income" : "expense"}
              >
                {transaction.type === "income" ? "+" : "-"} ₹
                {transaction?.amount}
              </h5>
            </li>
          ))
        ) : (
          <h2>No Transactions Found</h2>
        )}
      </ul>
    </section>
  );
};

export default RecentExpenses;
