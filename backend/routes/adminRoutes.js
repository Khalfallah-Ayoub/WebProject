const express = require("express");
const { loginAdmin } = require("../controllers/admin/authController");
const {
  getAdminQuestions,
  createAdminQuestion,
  updateAdminQuestion,
  deleteAdminQuestion,
} = require("../controllers/admin/questionController");
const { getAdminResults } = require("../controllers/admin/resultsController");
const {
  getAdminCategories,
  getAdminCategoryById,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
} = require("../controllers/admin/categoryController");
const {
  getExamSets,
  createAdminExamSet,
  getQuestions,
  addQuestion,
  removeQuestion,
  updateAdminExamSet,
  deleteAdminExamSet,
} = require("../controllers/admin/examSetController");
const { asyncHandler } = require("../middleware/asyncHandler");
const { authenticateAdmin } = require("../middleware/auth");

const router = express.Router();

router.post("/login", asyncHandler(loginAdmin));

router.use(authenticateAdmin);

// Category management routes (protected)
router.get("/categories", asyncHandler(getAdminCategories));
router.get("/categories/:id", asyncHandler(getAdminCategoryById));
router.post("/categories", asyncHandler(createAdminCategory));
router.put("/categories/:id", asyncHandler(updateAdminCategory));
router.delete("/categories/:id", asyncHandler(deleteAdminCategory));

// Question management routes (protected)
router.get("/questions", asyncHandler(getAdminQuestions));
router.post("/questions", asyncHandler(createAdminQuestion));
router.put("/questions/:id", asyncHandler(updateAdminQuestion));
router.delete("/questions/:id", asyncHandler(deleteAdminQuestion));

// Exam sets routes (protected)
router.get("/exam-sets", asyncHandler(getExamSets));
router.post("/exam-sets", asyncHandler(createAdminExamSet));
router.get("/exam-sets/:id/questions", asyncHandler(getQuestions));
router.post("/exam-sets/:id/questions", asyncHandler(addQuestion));
router.delete("/exam-sets/:id/questions", asyncHandler(removeQuestion));
router.put("/exam-sets/:id", asyncHandler(updateAdminExamSet));
router.delete("/exam-sets/:id", asyncHandler(deleteAdminExamSet));

// Results routes (protected)
router.get("/results", asyncHandler(getAdminResults));

module.exports = router;
