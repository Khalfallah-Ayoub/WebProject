const express = require("express");
const { startQuizSession, getQuizSession } = require("../controllers/quiz/sessionController");
const { submitQuizAnswer, submitQuizSession } = require("../controllers/quiz/answerController");
const { asyncHandler } = require("../middleware/asyncHandler");
const { getExamSetsByAllCategories } = require("../services/examSetService");

const router = express.Router();

// Public endpoints (must come BEFORE :sessionId route)
router.get("/categories", asyncHandler(async (req, res) => {
  const result = await getExamSetsByAllCategories();
  res.json(result);
}));

// Sessions endpoints
router.post("/start", asyncHandler(startQuizSession));
router.post("/answer", asyncHandler(submitQuizAnswer));
router.post("/submit", asyncHandler(submitQuizSession));

// Must be last - matches :sessionId parameter
router.get("/:sessionId", asyncHandler(getQuizSession));

module.exports = router;
