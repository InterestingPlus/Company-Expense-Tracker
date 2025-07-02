import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import "./Dashboard.scss";

const Dashboard = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />

      <Outlet />
    </div>
  );
};

export default Dashboard;
