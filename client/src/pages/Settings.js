import React from "react";
import { useAuth } from "../config/AuthContext";

const Settings = () => {
  const { logout } = useAuth();

  return (
    <main>
      <h1>Settings</h1>

      <button onClick={() => logout()}>Logout</button>
    </main>
  );
};

export default Settings;
