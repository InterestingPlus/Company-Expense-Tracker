import React from "react";

import RecentExpenses from "../components/RecentExpenses";
import Average from "../components/Average";
import CategoryExpenseChart from "../components/CategoryExpenseChart";
import YearlyBar from "../components/YearlyBar";
import BalanceSummary from "../components/BalanceSummary";

import "./Home.scss";

const Home = () => {
  return (
    <main id="home">
      <h2>📊 Dashboard</h2>

      <div className="first">
        <BalanceSummary />

        <Average />

        <RecentExpenses />
      </div>

      <YearlyBar />

      <section id="charts">
        <CategoryExpenseChart />

        <div>
          🔹 3. Payment Method Distribution
          <br />A donut chart showing:
          <p>💵 Cash</p>
          <p>🏦 Bank</p>
          <p>📱 UPI</p>
          {/* <ResponsiveContainer width="100%" height={300}>
  <PieChart>
    <Pie data={methodData}  />
  </PieChart>
</ResponsiveContainer> */}
        </div>

        <div>
          {/* Monthly Badget */}
          {/* <ProgressBar
  completed={(totalExpenses / budget) * 100}
  label="₹85,000 of ₹1,00,000 used"
/> */}
        </div>
      </section>

      <section>
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
      </section>
    </main>
  );
};

export default Home;
