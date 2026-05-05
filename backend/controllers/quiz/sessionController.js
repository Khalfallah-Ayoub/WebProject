const { startQuiz, getQuiz } = require("../../services/quizService");

const startQuizSession = async (req, res) => {
  const result = await startQuiz(req.body.username);
  res.status(201).json(result);
};

const getQuizSession = async (req, res) => {
  const result = await getQuiz(req.params.sessionId);
  res.json(result);
};

module.exports = { startQuizSession, getQuizSession };
