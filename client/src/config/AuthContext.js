import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

import apiPath from "../isProduction";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    const token = localStorage.getItem("token");
    return token ? jwtDecode(token) : null;
  });

  const login = async (email, password) => {
    const res = await axios.post(`${await apiPath()}/api/v1/admin/login`, {
      email,
      password,
    });
    const token = res.data.token;
    localStorage.setItem("token", token);
    setAdmin(jwtDecode(token));
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAdmin(null);
  };

  const value = { admin, login, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
