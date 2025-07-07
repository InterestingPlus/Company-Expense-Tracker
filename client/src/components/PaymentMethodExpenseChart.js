import React from "react";
import "./PaymentMethodExpenseChart.scss";
import { Pie } from "react-chartjs-2";

const PaymentMethodExpenseChart = ({
  ChartDataLabels,
  isMobile,
  reportData,
}) => {
  const data = {
    labels: reportData?.paymentMethodWise?.map((data) => data._id),

    datasets: [
      {
        data: reportData?.paymentMethodWise?.map((data) => data.total),
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
    <section className="card">
      <h3>Payment-Method-Wise Spending</h3>

      <Pie
        key={JSON.stringify(data)} // 🔄 force re-render when data updates
        data={data}
        plugins={isMobile ? [ChartDataLabels] : null}
      />
    </section>
  );
};

export default PaymentMethodExpenseChart;
