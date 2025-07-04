import { useEffect, useState } from "react";
import apiPath from "../isProduction";
import axios from "axios";
import "./Average.scss";

import { ReactComponent as ExpenseIcon } from "../assets/icons/expense2.svg";
import { ReactComponent as IncomeIcon } from "../assets/icons/income2.svg";

const Average = () => {
  const [averageExpense, setAverageExpense] = useState();
  const [averageIncome, setAverageIncome] = useState();
  const [loading, setLoading] = useState(true);

  async function getAverageExpense() {
    try {
      const res = await axios.get(`${await apiPath()}/api/v1/expense/average`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setAverageExpense(parseFloat(res?.data?.data).toFixed(2));
    } catch (error) {
      alert(error);
    }
  }

  async function getAverageIncome() {
    try {
      const res = await axios.get(`${await apiPath()}/api/v1/expense/average`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setAverageIncome(parseFloat(res?.data?.data).toFixed(2));
    } catch (error) {
      alert(error);
    }

    setLoading(false);
  }

  useEffect(() => {
    getAverageExpense();
    getAverageIncome();
  }, []);

  return (
    <section id="average">
      <h2>Daily Average</h2>

      <div className="two">
        <div className="info">
          <span className="icon">
            <ExpenseIcon />
          </span>

          <div className="expense">
            <h3>Expense</h3>
            <p>
              $<span>{averageExpense}</span>
            </p>
          </div>
        </div>

        <div className="info">
          <span className="icon">
            <IncomeIcon />
          </span>

          <div className="income">
            <h3>Income</h3>
            <p>
              $<span>{averageIncome}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Average;
