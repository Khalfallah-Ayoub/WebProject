const { submitAnswer, submitQuiz } = require("../../services/quizService");

const submitQuizAnswer = async (req, res) => {
  const result = await submitAnswer({
    sessionId: req.body.sessionId,
    questionId: req.body.questionId,
    answerIds: Array.isArray(req.body.answerIds)
      ? req.body.answerIds
      : req.body.answerId
        ? [req.body.answerId]
        : [],
  });
  res.json(result);
};

const submitQuizSession = async (req, res) => {
  const result = await submitQuiz(req.body.sessionId);
  res.json(result);
};

module.exports = { submitQuizAnswer, submitQuizSession };
