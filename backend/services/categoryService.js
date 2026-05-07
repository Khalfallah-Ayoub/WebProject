const pool = require("../config/db");

const getAllCategories = async () => {
  const result = await pool.query(
    "SELECT id, name FROM categories ORDER BY name ASC"
  );
  return result.rows;
};

const getCategoryById = async (id) => {
  const categoryId = Number(id);
  if (Number.isNaN(categoryId)) {
    const error = new Error("Invalid category id");
    error.status = 400;
    throw error;
  }

  const result = await pool.query(
    "SELECT id, name FROM categories WHERE id = $1",
    [categoryId]
  );

  if (result.rows.length === 0) {
    const error = new Error("Category not found");
    error.status = 404;
    throw error;
  }

  return result.rows[0];
};

const createCategory = async (name) => {
  const normalizedName = typeof name === "string" ? name.trim() : "";

  if (!normalizedName) {
    const error = new Error("Category name is required");
    error.status = 400;
    throw error;
  }

  if (normalizedName.length > 100) {
    const error = new Error("Category name must not exceed 100 characters");
    error.status = 400;
    throw error;
  }

  try {
    const result = await pool.query(
      "INSERT INTO categories (name) VALUES ($1) RETURNING id, name",
      [normalizedName]
    );
    return result.rows[0];
  } catch (error) {
    if (error.code === "23505") {
      const duplicateError = new Error(
        `Category "${normalizedName}" already exists`
      );
      duplicateError.status = 409;
      throw duplicateError;
    }
    throw error;
  }
};

const updateCategory = async (id, name) => {
  const categoryId = Number(id);
  const normalizedName = typeof name === "string" ? name.trim() : "";

  if (Number.isNaN(categoryId)) {
    const error = new Error("Invalid category id");
    error.status = 400;
    throw error;
  }

  if (!normalizedName) {
    const error = new Error("Category name is required");
    error.status = 400;
    throw error;
  }

  if (normalizedName.length > 100) {
    const error = new Error("Category name must not exceed 100 characters");
    error.status = 400;
    throw error;
  }

  // Check if category exists
  const categoryCheck = await pool.query(
    "SELECT id FROM categories WHERE id = $1",
    [categoryId]
  );
  if (categoryCheck.rows.length === 0) {
    const error = new Error("Category not found");
    error.status = 404;
    throw error;
  }

  try {
    const result = await pool.query(
      "UPDATE categories SET name = $1 WHERE id = $2 RETURNING id, name",
      [normalizedName, categoryId]
    );
    return result.rows[0];
  } catch (error) {
    if (error.code === "23505") {
      const duplicateError = new Error(
        `Category "${normalizedName}" already exists`
      );
      duplicateError.status = 409;
      throw duplicateError;
    }
    throw error;
  }
};

const deleteCategory = async (id) => {
  const categoryId = Number(id);
  if (Number.isNaN(categoryId)) {
    const error = new Error("Invalid category id");
    error.status = 400;
    throw error;
  }

  try {
    const result = await pool.query(
      "DELETE FROM categories WHERE id = $1 RETURNING id",
      [categoryId]
    );

    if (result.rows.length === 0) {
      const error = new Error("Category not found");
      error.status = 404;
      throw error;
    }

    return { deleted: true, id: categoryId };
  } catch (error) {
    // PostgreSQL error code 23503 is foreign key constraint violation
    if (error.code === "23503") {
      const constraintError = new Error(
        "Cannot delete category that has associated questions"
      );
      constraintError.status = 409;
      throw constraintError;
    }
    throw error;
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
