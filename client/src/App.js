import "./App.scss";

import { Routes, Route, BrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Dashboard from "./layouts/Dashboard";
import ErrorPage from "./pages/ErrorPage";

import { Navigate } from "react-router-dom";
import { useAuth } from "./config/AuthContext";
import Expense from "./pages/Expense";
import Income from "./pages/Income";
import Report from "./pages/Report";
import Budget from "./pages/Budget";
import Category from "./pages/Category";
import Settings from "./pages/Settings";

function App() {
  const ProtectedRoute = ({ children }) => {
    const { admin } = useAuth();
    console.log(admin);
    if (!admin) return <Navigate to="/login" />;
    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="/expense" element={<Expense />} />
          <Route path="/income" element={<Income />} />
          <Route path="/report" element={<Report />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/category" element={<Category />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
