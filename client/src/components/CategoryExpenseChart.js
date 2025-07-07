import React, { useEffect, useState } from "react";
import axios from "../config/axios";
import { Pie } from "react-chartjs-2";
import "./CategoryExpenseChart.scss";

const CategoryExpenseChart = ({ ChartDataLabels, isMobile, reportData }) => {
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
    async function getAllCategories() {
      try {
        const res = await axios.get("/category");

        setCategories(res?.data?.data || []);
      } catch (error) {
        console.error("❌ Error loading categories:", error);
      }
    }

    getAllCategories();
  }, []);

  const categoryLabels =
    reportData?.categoryWise?.map((cat) => {
      const matched = categories.find((c) => c._id === cat._id);
      return matched ? `${matched.icon || ""} ${matched.name}` : "Unknown";
    }) || [];

  const categoryData = reportData?.categoryWise?.map((cat) => cat.total) || [];

  const data = {
    labels: categoryLabels,
    datasets: [
      {
        data: categoryData,
        backgroundColor: [
          "#4e73df",
          "#1cc88a",
          "#36b9cc",
          "#f6c23e",
          "#fd7e14",
          "#20c997",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <section className="category">
      <h3>Category-wise Spending</h3>

      <Pie
        key={JSON.stringify(data)} // 🔄 force re-render when data updates
        data={data}
        plugins={isMobile ? [ChartDataLabels] : null}
      />
    </section>
  );
};

export default CategoryExpenseChart;
