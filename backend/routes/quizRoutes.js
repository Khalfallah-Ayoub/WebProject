const express = require("express");
const {
  startQuizSession,
  getQuizSession,
  getGroups,
  getCategoriesByGroupController,
  startQuizByGroup
} = require("../controllers/quiz/sessionController");
const { submitQuizAnswer, submitQuizSession } = require("../controllers/quiz/answerController");
const { asyncHandler } = require("../middleware/asyncHandler");

const router = express.Router();

// Public endpoints - Quiz Selection Flow
router.get("/groups", asyncHandler(getGroups));
router.get("/groups/:groupId/categories", asyncHandler(getCategoriesByGroupController));

// Start quiz endpoints
router.post("/start", asyncHandler(startQuizSession)); // legacy with examSetId
router.post("/start-by-group", asyncHandler(startQuizByGroup)); // new: with groupId and optional categoryId
router.post("/answer", asyncHandler(submitQuizAnswer));
router.post("/submit", asyncHandler(submitQuizSession));

// Must be last - matches :sessionId parameter
router.get("/:sessionId", asyncHandler(getQuizSession));

module.exports = router;
