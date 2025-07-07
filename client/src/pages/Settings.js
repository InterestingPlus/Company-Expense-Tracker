import { useNavigate } from "react-router-dom";

import { useAuth } from "../config/AuthContext";
import { useState } from "react";

import { ReactComponent as BudgetIcon } from "../assets/icons/budget.svg";
import { ReactComponent as CategoryIcon } from "../assets/icons/category.svg";

import "./Settings.scss";
import { toast } from "react-toastify";
import axios from "../config/axios";

const Settings = () => {
  const { logout, admin, login } = useAuth();
  const navigate = useNavigate();

  const changePassword = () => {
    console.log("Change Password");
  };

  const [isEdit, setIsEdit] = useState(false);

  const [adminName, setAdminName] = useState(admin?.name || "");
  const [adminEmail, setAdminEmail] = useState(admin?.email || "");
  const [companyName, setCompanyName] = useState(admin?.companyName || "");
  const [currency, setCurrency] = useState(admin?.currency || "₹");

  const updateProfile = async () => {
    try {
      const updatedProfile = {
        name: adminName,
        email: adminEmail,
        companyName,
        currency,
      };

      const res = await axios.put("/admin", updatedProfile);

      if (res?.data?.admin) {
        login(adminEmail, prompt("Enter Password to Update"));
        toast.success("Profile Updated successfully!");
        console.log("profile Updated Successfully!");
      }
    } catch (error) {
      toast.error(error);
      console.log(error);
    }

    setIsEdit(false);
  };

  return (
    <main id="settings">
      <h1>Settings</h1>

      <hr />
      <section className="action">
        <button onClick={() => navigate("/budget")}>
          <BudgetIcon /> Manage Budget
        </button>

        <button onClick={() => navigate("/category")}>
          <CategoryIcon /> Manage Category
        </button>
      </section>

      <hr />
      <section id="profile">
        <h3>Profile Info</h3>

        <label htmlFor="name">Name</label>
        <input
          type="text"
          value={adminName}
          name="name"
          id="name"
          onInput={(e) => {
            setIsEdit(true);
            setAdminName(e.target.value);
          }}
          placeholder="Name"
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          value={adminEmail}
          name="email"
          id="email"
          onInput={(e) => {
            setIsEdit(true);
            setAdminEmail(e.target.value);
          }}
          placeholder="Email Address"
        />

        <label htmlFor="company">Company Name</label>
        <input
          type="text"
          value={companyName}
          id="company"
          name="company"
          onInput={(e) => {
            setIsEdit(true);
            setCompanyName(e.target.value);
          }}
          placeholder="Company Name"
        />

        <label htmlFor="currency">Currency</label>
        <select
          id="currency"
          value={currency}
          onChange={(e) => {
            setIsEdit(true);
            setCurrency(e.target.value);
          }}
        >
          <option value="$"> USD ($)</option>
          <option value="€"> EUR (€)</option>
          <option value="₹"> INR (₹)</option>
          <option value="£"> GBP (£) </option>
          <option value="¥"> JPY (¥)</option>
          <option value="₽"> RUB (₽)</option>
          <option value="R$"> BRL (R$)</option>
          <option value="₩"> KRW (₩)</option>
          <option value="﷼"> SAR (﷼)</option>
        </select>

        {isEdit ? <button onClick={updateProfile}>Update</button> : null}

        <button onClick={() => changePassword()}>Change Password</button>

        <button onClick={() => logout()}>Logout</button>
      </section>
    </main>
  );
};

export default Settings;
