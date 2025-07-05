import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Budget.scss";
import apiPath from "../isProduction";

import BudgetTree from "../components/BudgetTree";

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
      const res = await axios.get(`${await apiPath()}/api/v1/budget`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

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
      await axios.put(
        `${await apiPath()}/api/v1/budget`,
        {
          totalBudget,
          categories,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
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

  return (
    <main id="budget">
      <h1> Monthly Budget </h1>

      {!modify ? (
        <section className="tree">
          <button onClick={() => setModify(true)}>Modify</button>

          <BudgetTree totalBudget={totalBudget} categories={categories} />
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

          <button onClick={addCategory}>+ Add Category</button>
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
        </section>
      )}
    </main>
  );
};

export default Budget;
