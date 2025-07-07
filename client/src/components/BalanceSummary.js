import React from "react";

import { Doughnut } from "react-chartjs-2";

import { ReactComponent as ExpenseIcon } from "../assets/icons/expense2.svg";
import { ReactComponent as IncomeIcon } from "../assets/icons/income2.svg";
import { ReactComponent as BalanceIcon } from "../assets/icons/balance.svg";

import "./BalanceSummary.scss";

const BalanceSummary = ({ ChartDataLabels, isMobile, reportData = {} }) => {
  const chartData = {
    labels: ["expense", "income", "balance"],
    datasets: [
      {
        data: [
          reportData?.totals?.expense || 0,
          reportData?.totals?.income || 0,
          reportData?.totals?.balance || 0,
        ],
        backgroundColor: ["#ff5512", "#12be54", "#0d2accc7"],
        borderWidth: 1,
        cutout: "60%", // This makes it donut!
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      tooltip: {
        callbacks: {
          label: (context) =>
            `${context.label}: ₹${context.parsed.toLocaleString()}`,
        },
      },
    },
  };

  const optionsValues = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      datalabels: {
        // anchor: "end",
        // align: "top",
        formatter: (value) => `₹${value}`, // Optional: format with currency
        color: "#fff",
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
    <section id="summary">
      <div className="info">
        <div className="card expense">
          <span className="icon">
            <ExpenseIcon />
          </span>

          <div>
            <h3>Total Expenses</h3>
            <p>
              ₹<span>{reportData?.totals?.expense || 0}</span>
            </p>
          </div>
        </div>

        <div className="card income">
          <span className="icon">
            <IncomeIcon />
          </span>

          <div>
            <h3>Total Income</h3>
            <p>
              ₹<span>{reportData?.totals?.income || 0}</span>
            </p>
          </div>
        </div>

        <div className="card balance">
          <span className="icon">
            <BalanceIcon />
          </span>

          <div>
            <h3>Balance</h3>
            <p>
              ₹<span>{reportData?.totals?.balance || 0}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="chart">
        <Doughnut
          data={chartData}
          options={isMobile ? optionsValues : options}
          plugins={isMobile ? [ChartDataLabels] : null}
        />
      </div>
    </section>
  );
};

export default BalanceSummary;
