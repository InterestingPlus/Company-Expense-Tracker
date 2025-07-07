import React from "react";
import "./YearlyBar.scss";

import { Bar } from "react-chartjs-2";

import { ReactComponent as ExpenseIcon } from "../assets/icons/expense2.svg";
import { ReactComponent as IncomeIcon } from "../assets/icons/income2.svg";

const YearlyBar = ({ ChartDataLabels, isMobile, reportData }) => {
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

  const isExpense =
    reportData?.monthly?.expenses?.length >
    reportData?.monthly?.incomes?.length;
  const maxLength = isExpense
    ? reportData?.monthly?.expenses.length
    : reportData?.monthly?.incomes.length;

  const monthlyLabels = isExpense
    ? reportData?.monthly?.expenses.map((entry) => {
        const month = entry?._id?.month - 1;
        const year = entry?._id?.year;
        return `${months[month]} ${year}`;
      })
    : reportData?.monthly?.incomes.map((entry) => {
        const month = entry?._id?.month - 1;
        const year = entry?._id?.year;
        return `${months[month]} ${year}`;
      }) || [];

  const monthlyExpenseData =
    reportData?.monthly?.expenses?.map((entry) => entry.total)?.reverse() || [];

  const monthlyIncomeData =
    reportData?.monthly?.incomes?.map((entry) => entry.total)?.reverse() || [];

  const totalExpense = monthlyExpenseData.reduce((a, b) => a + b, 0);
  const totalIncome = monthlyIncomeData.reduce((a, b) => a + b, 0);

  const chartData = {
    labels: monthlyLabels,
    datasets: [
      {
        label: "Expense",
        data: monthlyExpenseData,
        backgroundColor: "#e74a3b",
        borderRadius: 5,
      },
      {
        label: "Income",
        data: monthlyIncomeData,
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
    <>
      {maxLength > 1 && (
        <section id="yearlyBar">
          <div className="title">
            <h3>
              Last{" "}
              {isExpense
                ? reportData?.monthly?.expenses.length
                : reportData?.monthly?.incomes.length}{" "}
              Month
            </h3>

            <div className="amount">
              <div className="expense">
                <span className="icon">
                  <ExpenseIcon />
                </span>
                <span className="amount">
                  ₹<h4>{totalExpense.toLocaleString("en-IN")}</h4>
                </span>
              </div>

              <div className="income">
                <span className="icon">
                  <IncomeIcon />
                </span>
                <span className="amount">
                  ₹<h4>{totalIncome.toLocaleString("en-IN")}</h4>
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
      )}
    </>
  );
};

export default YearlyBar;
