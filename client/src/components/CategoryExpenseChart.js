import React from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryExpenseChart = () => {
  const data = {
    // labels: categories.map((c) => c.name),
    labels: ["Food", "Transport", "Entertainment", "Other"],
    datasets: [
      {
        // label: "Expenses by Category",

        // data: categories.map((c) => c.amount),
        data: [2000, 4000, 5000, 7500],
        backgroundColor: ["#4e73df", "#1cc88a", "#36b9cc", "#f6c23e"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div
      className="card top-category"
      style={{
        width: "100%",
        maxWidth: "300px",
      }}
    >
      Category-wise Spending
      <Pie key={JSON.stringify(data)} data={data} />
    </div>
  );
};

export default CategoryExpenseChart;
