import "./Average.scss";

import { ReactComponent as ExpenseIcon } from "../assets/icons/expense2.svg";
import { ReactComponent as IncomeIcon } from "../assets/icons/income2.svg";

const Average = ({ reportData }) => {
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
              ₹
              <span>
                {parseFloat(reportData?.dailyAverage?.expense || 0).toFixed(2)}
              </span>
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
              ₹
              <span>
                {parseFloat(reportData?.dailyAverage?.income || 0).toFixed(2)}
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Average;
