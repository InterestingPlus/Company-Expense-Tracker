import axios from "../config/axios";
import { useEffect, useState } from "react";
import BalanceSummary from "../components/BalanceSummary";
import Average from "../components/Average";
import RecentExpenses from "../components/RecentExpenses";
import YearlyBar from "../components/YearlyBar";
import CategoryExpenseChart from "../components/CategoryExpenseChart";

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
import PaymentMethodExpenseChart from "../components/PaymentMethodExpenseChart";

import "./Report.scss";

// PDF Export
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
import html2pdf from "html2pdf.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ArcElement
);

const Report = () => {
  const isMobile = window.innerWidth < 990;
  // const chartsRef = useRef(null);

  if (isMobile) {
    ChartJS.register(ChartDataLabels);
  }

  const [reportData, setReportData] = useState([]);

  const now = new Date();
  const [from, setFrom] = useState(
    new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0]
  );
  const [to, setTo] = useState(
    new Date(now.getFullYear(), now.getMonth() + 1, 0)
      .toISOString()
      .split("T")[0]
  );

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

  function printReport() {
    const element = document.getElementById("charts");

    const opt = {
      margin: [20, 10, 20, 10], // top, left, bottom, right
      filename: `Expense-Report-${from}_to_${to}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "landscape", // ⬅️ landscape mode
      },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    };

    html2pdf()
      .set(opt)
      .from(element)
      .toPdf()
      .get("pdf")
      .then((pdf) => {
        const pageCount = pdf.internal.getNumberOfPages();
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const today = new Date().toLocaleDateString("en-IN");

        for (let i = 1; i <= pageCount; i++) {
          pdf.setPage(i);
          pdf.setFontSize(10);
          pdf.setTextColor(150);

          // 📄 Footer on every page
          pdf.text(
            "Company Expense Tracker | Jatin Poriya",
            pageWidth / 2,
            pageHeight - 8,
            { align: "center" }
          );

          // 🧾 Optional: Page number & Date
          pdf.text(`Page ${i} of ${pageCount}`, pageWidth - 25, pageHeight - 8);
          pdf.text(today, 15, pageHeight - 8);

          // 🏷️ Title only on first page
          if (i === 1) {
            pdf.setFontSize(14);
            pdf.setTextColor(30);
            pdf.text(`Report - ${from} to ${to}`, pageWidth / 2, 15, {
              align: "center",
            });
          }
        }
      })
      .save();
  }

  return (
    <main>
      <h1>Report & Analytics</h1>

      <div className="control">
        <div>
          <label htmlFor="from">From</label>
          <input
            type="date"
            value={from}
            onChange={(e) => {
              setFrom(e.target.value);

              (async () => {
                await getReportData();
              })();
            }}
            id="from"
            name="from"
          />
        </div>

        <div>
          <label htmlFor="to">To</label>
          <input
            type="date"
            value={to}
            onChange={(e) => {
              setTo(e.target.value);

              (async () => {
                await getReportData();
              })();
            }}
            id="to"
            name="to"
          />
        </div>

        <div>
          <button onClick={printReport}>🖨 Print</button>
        </div>
      </div>

      <section id="charts" className="no-break">
        <BalanceSummary
          ChartDataLabels={ChartDataLabels}
          isMobile={isMobile}
          reportData={reportData}
        />

        <Average reportData={reportData} />

        <RecentExpenses reportData={reportData} />

        <YearlyBar
          ChartDataLabels={ChartDataLabels}
          isMobile={isMobile}
          reportData={reportData}
        />

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

        {/* <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={methodData}  />
        </PieChart>
      </ResponsiveContainer> */}
      </section>
    </main>
  );
};

export default Report;
