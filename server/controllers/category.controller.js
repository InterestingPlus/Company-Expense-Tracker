import categoryModel from "../models/category.model.js";

export const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find({ adminId: req.admin.id });

    console.log(`All Categories Fetched Successfully by ${req.admin.name}`);

    res.status(201).json({ data: categories });
  } catch (error) {
    res.status(500).json({ error: `Internal Sever Error: ${error.message}` });
  }
};

export const addCategory = async (req, res) => {
  const { name, icon } = req.body;

  try {
    const category = await categoryModel.create({
      name,
      icon,
      adminId: req.admin.id,
    });

    console.log(
      `Category Added Successfully by ${req.admin.name},\n with Name : ${category.icon} ${category.name}`
    );

    res.status(201).json({ name: category.name, icon: category.icon });
  } catch (error) {
    console.log(`Error adding Category: ${error.message}`);
    res.status(500).json({ error: `Error adding Category: ${error.message}` });
  }
};

export const editCategory = async (req, res) => {
  const { _id, name, icon } = req.body;

  if (!_id) {
    return res.status(400).json({ error: "Category ID is required." });
  }

  try {
    const updatedCategory = await categoryModel.findOneAndUpdate(
      { _id, adminId: req.admin.id },
      {
        name,
        icon,
      },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ error: "Category not found." });
    }

    console.log(
      `✅ Expense Updated by ${req.admin.name}: ${updatedCategory.name} ${updatedCategory.icon}`
    );

    res.status(200).json({
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    console.error("❌ Error updating :", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteCategory = async (req, res) => {
  if (!req.body._id) {
    return res.status(400).json({ error: "Category ID is required." });
  }

  try {
    const deletedCategory = await categoryModel.findOneAndDelete({
      _id: req.body._id,
      adminId: req.admin.id,
    });

    if (!deletedCategory) {
      return res.status(404).json({ error: "Category not found." });
    }

    console.log(
      `✅ Category Deleted by ${req.admin.name}: ${deletedCategory.name}`
    );

    res.status(200).json({
      message: "Category deleted successfully",
      data: deletedCategory,
    });
  } catch (error) {
    console.error("❌ Error deleting Category:", error.message);
    res
      .status(500)
      .json({ message: "Error deleting Category", error: error.message });
  }
};
