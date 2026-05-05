const express = require("express");
const { loginAdmin } = require("../controllers/admin/authController");
const {
  createAdminQuestion,
  updateAdminQuestion,
  deleteAdminQuestion,
} = require("../controllers/admin/questionController");
const { getAdminResults } = require("../controllers/admin/resultsController");
const { asyncHandler } = require("../middleware/asyncHandler");
const { authenticateAdmin } = require("../middleware/auth");

const router = express.Router();

router.post("/login", asyncHandler(loginAdmin));

router.use(authenticateAdmin);
router.post("/questions", asyncHandler(createAdminQuestion));
router.put("/questions/:id", asyncHandler(updateAdminQuestion));
router.delete("/questions/:id", asyncHandler(deleteAdminQuestion));
router.get("/results", asyncHandler(getAdminResults));

module.exports = router;
