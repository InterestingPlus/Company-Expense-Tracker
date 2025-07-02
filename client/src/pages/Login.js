import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../config/AuthContext";
import "./Login.scss";

export default function Login() {
  const { login, admin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  if (admin) return <Navigate to="/" />;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h1 className="brand">Company Expense Tracker</h1>
        <h2 className="title">Login as a Admin</h2>

        <form className="form" onSubmit={handleLogin}>
          <label htmlFor="email">Email</label>
          <input
            className="input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id="email"
            type="email"
            name="email"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            className="input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id="password"
            type="password"
            name="password"
            required
          />
          <button className="btn" type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
