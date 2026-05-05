const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../../services/categoryService");

const getAdminCategories = async (req, res) => {
  const categories = await getAllCategories();
  res.json({ categories });
};

const getAdminCategoryById = async (req, res) => {
  const category = await getCategoryById(req.params.id);
  res.json({ category });
};

const createAdminCategory = async (req, res) => {
  const category = await createCategory(req.body.name);
  res.status(201).json({ category });
};

const updateAdminCategory = async (req, res) => {
  const category = await updateCategory(req.params.id, req.body.name);
  res.json({ category });
};

const deleteAdminCategory = async (req, res) => {
  const result = await deleteCategory(req.params.id);
  res.json(result);
};

module.exports = {
  getAdminCategories,
  getAdminCategoryById,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
};
