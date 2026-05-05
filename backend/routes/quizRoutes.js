const express = require("express");
const { startQuizSession, getQuizSession } = require("../controllers/quiz/sessionController");
const { submitQuizAnswer, submitQuizSession } = require("../controllers/quiz/answerController");
const { asyncHandler } = require("../middleware/asyncHandler");
const { getExamSetsByAllCategories } = require("../services/examSetService");

const router = express.Router();

// Public endpoint - students need to access categories without authentication
router.get("/categories", asyncHandler(async (req, res) => {
  const result = await getExamSetsByAllCategories();
  res.json(result);
}));

router.post("/start", asyncHandler(startQuizSession));
router.get("/:sessionId", asyncHandler(getQuizSession));
router.post("/answer", asyncHandler(submitQuizAnswer));
router.post("/submit", asyncHandler(submitQuizSession));

module.exports = router;
