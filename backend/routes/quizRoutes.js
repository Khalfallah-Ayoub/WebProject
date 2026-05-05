const express = require("express");
const { startQuizSession, getQuizSession } = require("../controllers/quiz/sessionController");
const { submitQuizAnswer, submitQuizSession } = require("../controllers/quiz/answerController");
const { asyncHandler } = require("../middleware/asyncHandler");

const router = express.Router();

router.post("/start", asyncHandler(startQuizSession));
router.get("/:sessionId", asyncHandler(getQuizSession));
router.post("/answer", asyncHandler(submitQuizAnswer));
router.post("/submit", asyncHandler(submitQuizSession));

module.exports = router;
