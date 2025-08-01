import { useEffect, useState } from "react";
import "./CategoryForm.scss";

const CategoryForm = ({ category = {}, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    icon: "",
  });

  useEffect(() => {
    if (category?._id) {
      setFormData({
        _id: category._id,
        name: category.name || "",
        icon: category.icon || "",
      });
    }
  }, [category]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "receipt") {
      setFormData({ ...formData, receipt: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit(formData);
  };

  return (
    <form className="category-form" onSubmit={handleSubmit}>
      <h2>{formData._id ? "Edit Category" : "Add New Category"}</h2>

      <label>
        Name
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter Category Name"
          maxLength={20}
          required
        />
      </label>

      <label>
        Icon
        <input
          name="icon"
          value={formData.icon}
          onChange={handleChange}
          placeholder="Enter Icon"
          maxLength={4}
        />
      </label>

      <div className="form-actions">
        <button type="submit">{formData._id ? "Update" : "Add"}</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;
