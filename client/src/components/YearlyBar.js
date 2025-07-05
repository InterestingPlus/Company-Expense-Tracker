import React from "react";
import "./YearlyBar.scss";

import { Bar } from "react-chartjs-2";

import { ReactComponent as ExpenseIcon } from "../assets/icons/expense2.svg";
import { ReactComponent as IncomeIcon } from "../assets/icons/income2.svg";

const YearlyBar = ({ ChartDataLabels, isMobile }) => {
  const chartData = {
    labels: ["March", "April", "May", "Jun", "July"], // e.g. ["Jan", "Feb", "Mar"]
    datasets: [
      {
        label: "Expense",
        data: [5000, 3200, 4800, 6300, 7000], // e.g. [5000, 3200, 4800]
        backgroundColor: "#e74a3b",
        // "#4e73df",
        // "#1cc88a",
        // "#36b9cc",
        // "#f6c23e",
        borderRadius: 5,
      },
      {
        label: "Income",
        data: [9000, 3520, 3000, 5000, 9500], // e.g. [5000, 3200, 4800]
        backgroundColor: "#4e73df",
        borderRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: {
        stacked: false,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  const optionsValues = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      datalabels: {
        anchor: "end",
        align: "top",
        formatter: (value) => `₹${value}`, // Optional: format with currency
        color: "#4496fe",
        font: {
          weight: "bold",
        },
      },
      tooltip: {
        enabled: false, // 👈 Disable tooltip if not needed
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <section id="yearlyBar">
      <div className="title">
        <h3>Last 5 Month</h3>

        <div className="amount">
          <div className="expense">
            <span className="icon">
              <ExpenseIcon />
            </span>
            <span className="amount">
              ₹<h4>50000</h4>
            </span>
          </div>

          <div className="income">
            <span className="icon">
              <IncomeIcon />
            </span>
            <span className="amount">
              ₹<h4>75000</h4>
            </span>
          </div>
        </div>
      </div>

      <Bar
        data={chartData}
        options={isMobile ? optionsValues : options}
        plugins={isMobile ? [ChartDataLabels] : null}
      />
    </section>
  );
};

export default YearlyBar;
