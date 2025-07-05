import React from "react";

import { Pie } from "react-chartjs-2";

const CategoryExpenseChart = ({ ChartDataLabels, isMobile }) => {
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
      <Pie
        key={JSON.stringify(data)}
        data={data}
        plugins={isMobile ? [ChartDataLabels] : null}
      />
    </div>
  );
};

export default CategoryExpenseChart;
