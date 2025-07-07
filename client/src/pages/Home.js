import React, { useEffect, useState } from "react";

import RecentExpenses from "../components/RecentExpenses";
import Average from "../components/Average";
import CategoryExpenseChart from "../components/CategoryExpenseChart";
import BalanceSummary from "../components/BalanceSummary";

import "./Home.scss";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

import ChartDataLabels from "chartjs-plugin-datalabels";
import axios from "../config/axios";
import PaymentMethodExpenseChart from "../components/PaymentMethodExpenseChart";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ArcElement
);

const isMobile = window.innerWidth < 990;

if (isMobile) {
  ChartJS.register(ChartDataLabels);
}

const Home = () => {
  const [reportData, setReportData] = useState([]);

  const now = new Date();

  // First day of current month
  const from = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .split("T")[0];

  // Last day of current month
  const to = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    .toISOString()
    .split("T")[0];

  async function getReportData() {
    try {
      const res = await axios.get(`/report?from=${from}&to=${to}`);

      if (res) {
        setReportData(res?.data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    (async () => {
      await getReportData();
    })();
  }, []);

  return (
    <main id="home">
      <h2>📊 Dashboard</h2>

      <section id="charts">
        <BalanceSummary
          ChartDataLabels={ChartDataLabels}
          isMobile={isMobile}
          reportData={reportData}
        />

        <Average reportData={reportData} />

        <RecentExpenses reportData={reportData} />

        {/* <YearlyBar
          ChartDataLabels={ChartDataLabels}
          isMobile={isMobile}
          reportData={reportData}
        /> */}

        <CategoryExpenseChart
          ChartDataLabels={ChartDataLabels}
          isMobile={isMobile}
          reportData={reportData}
        />

        <PaymentMethodExpenseChart
          ChartDataLabels={ChartDataLabels}
          isMobile={isMobile}
          reportData={reportData}
        />
      </section>

      {/* <div>
        🔹 3. Payment Method Distribution
        <br />A donut chart showing:
        <p>💵 Cash</p>
        <p>🏦 Bank</p>
        <p>📱 UPI</p>
         <ResponsiveContainer width="100%" height={300}>
  <PieChart>
    <Pie data={methodData}  />
  </PieChart>
</ResponsiveContainer>  
      </div>

      <div>
         Monthly Badget  
        <ProgressBar
  completed={(totalExpenses / budget) * 100}
  label="₹85,000 of ₹1,00,000 used"
/> 
      </div> */}

      {/* <section>
        🔹 8. This Month Highlights
        <table>
          <tr>
            <th>Metric</th>
            <th>Example</th>
          </tr>

          <tr>
            <th>Highest Spending Day</th>
            <td>₹3,400 on 15 July</td>
          </tr>

          <tr>
            <th>Most Used Category</th>
            <td>🚌 Travel (₹6,000)</td>
          </tr>

          <tr>
            <th>Total Receipts Uploaded</th>
            <td>17</td>
          </tr>

          <tr>
            <th>UPI vs Cash Usage</th>
            <td>UPI: ₹8K, Cash: ₹2K</td>
          </tr>
        </table>
      </section> */}
    </main>
  );
};

export default Home;
