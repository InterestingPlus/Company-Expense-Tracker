import React from "react";
import "./YearlyBar.scss";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

import { ReactComponent as ExpenseIcon } from "../assets/icons/expense2.svg";
import { ReactComponent as IncomeIcon } from "../assets/icons/income2.svg";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const YearlyBar = () => {
  const chartData = {
    labels: ["March", "April", "May", "Jun", "July"], // e.g. ["Jan", "Feb", "Mar"]
    datasets: [
      {
        // label: "Monthly Expenses",
        data: [5000, 3200, 4800, 6300, 7000], // e.g. [5000, 3200, 4800]
        backgroundColor: [
          "#4e73df",
          "#1cc88a",
          "#36b9cc",
          "#f6c23e",
          "#e74a3b",
        ],
        borderRadius: 8,
      },
    ],
  };

  const chartData2 = {
    labels: ["March", "April", "May", "Jun", "July"], // e.g. ["Jan", "Feb", "Mar"]
    datasets: [
      {
        // label: "Monthly Expenses",
        data: [9000, 3520, 3000, 5000, 9500], // e.g. [5000, 3200, 4800]
        backgroundColor: [
          "#4e73df",
          "#1cc88a",
          "#36b9cc",
          "#f6c23e",
          "#e74a3b",
        ],
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <section id="yearlyBar">
      <div className="chart-card expense">
        <div className="title">
          <h3>Expense - Last 5 Month</h3>

          <div>
            <span className="icon">
              <ExpenseIcon />
            </span>
            <span className="amount">
              ₹<h4>50000</h4>
            </span>
          </div>
        </div>
        <Bar data={chartData} options={options} />
      </div>

      <div className="chart-card income">
        <div className="title">
          <h3>Income - Last 5 Month</h3>
          <div>
            <span className="icon">
              <IncomeIcon />
            </span>
            <span className="amount">
              ₹<h4>75000</h4>
            </span>
          </div>
        </div>

        <Bar data={chartData2} options={options} />
      </div>
    </section>
  );
};

export default YearlyBar;
