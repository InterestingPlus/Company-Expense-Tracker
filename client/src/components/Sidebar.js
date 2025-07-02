import "./Sidebar.scss";
import { ReactComponent as HomeIcon } from "../assets/icons/home.svg";
import { ReactComponent as ExpenseIcon } from "../assets/icons/expense.svg";
import { ReactComponent as IncomeIcon } from "../assets/icons/income.svg";
import { ReactComponent as ReportIcon } from "../assets/icons/report.svg";
import { ReactComponent as BudgetIcon } from "../assets/icons/budget.svg";
import { ReactComponent as CategoryIcon } from "../assets/icons/category.svg";
import { ReactComponent as SettingsIcon } from "../assets/icons/settings.svg";

import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <h1>Company Expense Tracker</h1>

      {/* <div className="sidebar-header">
        <div
          className="avatar"
          style={{
            backgroundImage: 'url("")',
            background: "blue",
          }}
        ></div>
        <div className="user-info">
          <h1 className="user-name">Olivia</h1>
          <p className="user-role">Admin</p>
        </div>
      </div> */}

      <div className="sidebar-menu">
        <NavLink to="/" className="menu-item">
          <HomeIcon className="menu-icon" />
          <p className="menu-label">Dashboard</p>
        </NavLink>

        <NavLink to="/expense" className="menu-item">
          <ExpenseIcon className="menu-icon" />
          <p className="menu-label">Expenses</p>
        </NavLink>

        <NavLink to="/income" className="menu-item">
          <IncomeIcon className="menu-icon" />
          <p className="menu-label">Income</p>
        </NavLink>

        <NavLink to="/report" className="menu-item">
          <ReportIcon className="menu-icon" />
          <p className="menu-label">Reports</p>
        </NavLink>

        <NavLink to="/budget" className="menu-item">
          <BudgetIcon className="menu-icon" />
          <p className="menu-label">Budget</p>
        </NavLink>

        <NavLink to="/category" className="menu-item">
          <CategoryIcon className="menu-icon" />
          <p className="menu-label">Categories</p>
        </NavLink>

        <NavLink to="/settings" className="menu-item">
          <SettingsIcon className="menu-icon" />
          <p className="menu-label">Settings</p>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
