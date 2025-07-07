import React, { useEffect, useState } from "react";
import BudgetTree from "../components/BudgetTree";
import axios from "../config/axios";

import { ReactComponent as EditIcon } from "../assets/icons/edit.svg";
import "./Budget.scss";
import * as html2pdf from "html2pdf.js";

const Budget = () => {
  const [modify, setModify] = useState(false);

  const [totalBudget, setTotalBudget] = useState(100000);

  const [categories, setCategories] = useState([
    {
      name: "Food",
      amount: 20000,
      subcategories: [
        { name: "Groceries", amount: 12000 },
        { name: "Dining", amount: 8000 },
      ],
    },
    {
      name: "Transport",
      amount: 15000,
      subcategories: [
        { name: "Fuel", amount: 10000 },
        { name: "Public", amount: 5000 },
      ],
    },
  ]);

  async function getBudget() {
    try {
      const res = await axios.get("budget");

      console.log(res?.data);

      if (res?.data?.budget) {
        setTotalBudget(res?.data?.budget?.totalBudget);
        setCategories(res?.data?.budget?.categories);
      }
    } catch (error) {
      console.log("Error Fetching Budget:", error);
    }
  }

  async function updateBudget() {
    try {
      await axios.put("budget", {
        totalBudget,
        categories,
      });
    } catch (error) {
      console.log("Error Setting up Budget:", error);
    }
  }

  useEffect(() => {
    getBudget();
  }, []);

  const updateCategory = (index, field, value) => {
    const copy = [...categories];
    copy[index][field] = value;
    setCategories(copy);
  };

  const updateSubCategory = (catIndex, subIndex, field, value) => {
    const copy = [...categories];
    copy[catIndex].subcategories[subIndex][field] = value;
    setCategories(copy);
  };

  const addCategory = () =>
    setCategories([...categories, { name: "", amount: 0, subcategories: [] }]);

  const addSubCategory = (index) => {
    const copy = [...categories];
    copy[index].subcategories.push({ name: "", amount: 0 });
    setCategories(copy);
  };

  function printBudget() {
    const element = document.querySelector(".budget-tree-hierarchy");

    const today = new Date();
    const month = today.toLocaleString("default", { month: "long" });
    const year = today.getFullYear();

    const opt = {
      margin: [0.5, 0.5, 0.7, 0.5], // Top, left, bottom, right (in inches)
      filename: `Budget Tree - ${month} ${year}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
      },
      jsPDF: {
        unit: "in",
        format: "a4",
        orientation: "portrait",
      },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    };

    html2pdf()
      .set(opt)
      .from(element)
      .toPdf()
      .get("pdf")
      .then((pdf) => {
        const totalPages = pdf.internal.getNumberOfPages();
        const footer = "Company Expense Tracker | Jatin Poriya";

        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i);
          pdf.setFontSize(10);
          pdf.setTextColor(150);
          pdf.text(
            footer,
            pdf.internal.pageSize.getWidth() / 2,
            pdf.internal.pageSize.getHeight() - 0.3,
            { align: "center" }
          );
        }
      })
      .then(function (pdf) {
        html2pdf().set(opt).from(element).save();
      });
  }

  return (
    <main id="budget">
      <h1> Monthly Budget </h1>

      {!modify ? (
        <section className="tree">
          <button onClick={() => setModify(true)}>
            {" "}
            <EditIcon /> Modify
          </button>
          <button onClick={printBudget}> 🖨 Print</button>

          <div className="budget-tree-hierarchy">
            <BudgetTree totalBudget={totalBudget} categories={categories} />
          </div>
        </section>
      ) : (
        <section className="setBudget">
          <h2>Budget Breakdown</h2>

          <label>
            💰 Total Budget:
            <input
              type="number"
              value={totalBudget}
              onChange={(e) => setTotalBudget(Number(e.target.value))}
            />
          </label>

          <div className="categories">
            {categories.map((cat, i) => (
              <div key={i} className="category">
                <input
                  placeholder="Category name"
                  value={cat.name}
                  onChange={(e) => updateCategory(i, "name", e.target.value)}
                />
                <input
                  type="number"
                  value={cat.amount}
                  onChange={(e) =>
                    updateCategory(i, "amount", Number(e.target.value))
                  }
                />
                <button onClick={() => addSubCategory(i)}>+ Sub</button>

                <div className="subcategories">
                  {cat.subcategories.map((sub, j) => (
                    <div key={j} className="sub">
                      <input
                        placeholder="Subcategory"
                        value={sub.name}
                        onChange={(e) =>
                          updateSubCategory(i, j, "name", e.target.value)
                        }
                      />
                      <input
                        type="number"
                        value={sub.amount}
                        onChange={(e) =>
                          updateSubCategory(
                            i,
                            j,
                            "amount",
                            Number(e.target.value)
                          )
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="control">
            <button onClick={addCategory} className="add">
              {" "}
              + Add Category
            </button>
            <button
              onClick={() => {
                updateBudget();

                console.log({
                  totalBudget,
                  categories,
                });
                setModify(false);
              }}
            >
              ✅ Save Tree
            </button>
          </div>
        </section>
      )}
    </main>
  );
};

export default Budget;
