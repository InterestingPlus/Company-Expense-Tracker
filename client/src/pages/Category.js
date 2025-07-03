import React, { useEffect, useState } from "react";
import CategoryForm from "../components/CategoryForm";
import axios from "axios";
import apiPath from "../isProduction";
import { toast } from "react-toastify";
import "./Category.scss";

import { ReactComponent as EditIcon } from "../assets/icons/edit.svg";
import { ReactComponent as DeleteIcon } from "../assets/icons/delete.svg";

const Category = () => {
  const [isLoading, setLoading] = useState(true);

  const [category, setCategory] = useState([
    {
      _id: "a1",
      name: "Shopping",
      icon: "🛍️",
    },
    {
      _id: "b2",
      name: "Food",
      icon: "🍔",
    },
    {
      _id: "c3",
      name: "Travel",
      icon: "🚗",
    },
    {
      _id: "d4",
      name: "Rent",
      icon: "🏠",
    },
    {
      _id: "e5",
      name: "Misc",
      icon: "📦",
    },
  ]);

  const [openModal, setOpenModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null);

  async function getAllCategories() {
    try {
      if (category.length === 0) setLoading(true);

      const res = await axios.get(`${await apiPath()}/api/v1/category`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("All Categories:", res?.data?.data);
      setCategory(res?.data?.data);
    } catch (error) {
      alert(error);
    }

    setLoading(false);
  }

  useEffect(() => {
    getAllCategories();
  }, []);

  const handleAddCategory = async (category) => {
    try {
      setLoading(true);

      const res = await axios.post(
        `${await apiPath()}/api/v1/category`,
        category,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Category added successfully!");
      console.log("✅ Added:", res?.data?.data);

      await getAllCategories(); // ✅ Refresh list
    } catch (error) {
      console.error("❌ Error adding Category:", error);
      alert(error?.response?.data?.error || "Failed to add Category");
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategory = async (category) => {
    console.log("Category to be edited:", category);

    try {
      const res = await axios.put(
        `${await apiPath()}/api/v1/category`,
        category,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Category Updated successfully!");
      console.log("✅ Updated:", res?.data?.data);

      await getAllCategories(); // ✅ Refresh list
    } catch (error) {
      console.error("❌ Error editing Category:", error);
      alert(error?.response?.data?.error || "Failed to update Category");
    }
  };

  const handleDelete = async (category) => {
    console.log("Category to be deleted:", category);

    try {
      const res = await axios.delete(`${await apiPath()}/api/v1/category`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: category,
      });

      toast.success("Category Deleted successfully!");
      console.log("✅ Deleted:", res?.data?.data);

      await getAllCategories();
    } catch (error) {
      console.error("❌ Error deleting Category:", error);
      alert(error?.response?.data?.error || "Failed to delete Category");
    }
  };

  const handleAddClick = () => {
    setEditCategory(null);
    setOpenModal(true);
  };

  const handleEditClick = (category) => {
    setEditCategory(category);
    setOpenModal(true);
  };

  return (
    <main id="category">
      <h1>Income</h1>

      <input type="search" placeholder="Search..." />

      <button onClick={handleAddClick}>Add Category</button>

      {openModal && (
        <div id="category-modal">
          <CategoryForm
            category={editCategory}
            onCancel={() => {
              setOpenModal(false);
              setEditCategory();
            }}
            onSubmit={(data) => {
              if (!editCategory) {
                handleAddCategory(data);
              } else {
                handleEditCategory(data);
              }
              setOpenModal(false);
            }}
          />
        </div>
      )}

      <div className="category-cards">
        {!isLoading ? (
          category.length > 0 ? (
            category.map((category) => (
              <div className="category-card" key={category._id}>
                <div className="category-main">
                  <div className="category-title">
                    <h3>{category.name}</h3>
                  </div>

                  <span>{category.icon && `${category.icon}`}</span>

                  <div className="category-actions">
                    <button
                      className="edit-btn"
                      onClick={() => handleEditClick(category)}
                    >
                      <EditIcon />
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(category)}
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No Categories Found</p>
          )
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </main>
  );
};

export default Category;
