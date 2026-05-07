const {
  startQuiz,
  getQuiz,
  getGroupsForQuiz,
  getCategoriesByGroup,
  startQuizByGroupAndCategory
} = require("../../services/quizService");

const startQuizSession = async (req, res) => {
  const result = await startQuiz(req.body.username, req.body.examSetId);
  res.status(201).json(result);
};

const getQuizSession = async (req, res) => {
  const result = await getQuiz(req.params.sessionId);
  res.json(result);
};

// Get all groups for quiz selection
const getGroups = async (req, res) => {
  const groups = await getGroupsForQuiz();
  res.json({ groups });
};

// Get categories in a group
const getCategoriesByGroupController = async (req, res) => {
  const categories = await getCategoriesByGroup(req.params.groupId);
  res.json({ categories });
};

// Start quiz with group and category selection
const startQuizByGroup = async (req, res) => {
  try {
    if (!req.body.username || !req.body.groupId) {
      return res.status(400).json({
        error: "username and groupId are required"
      });
    }

    const result = await startQuizByGroupAndCategory(
      req.body.username,
      req.body.groupId,
      req.body.categoryId // optional - if not provided, all categories in group
    );
    res.status(201).json(result);
  } catch (error) {
    console.error('Error in startQuizByGroup:', error);
    const status = error.status || 500;
    res.status(status).json({
      error: error.message || "Failed to start quiz"
    });
  }
};

module.exports = {
  startQuizSession,
  getQuizSession,
  getGroups,
  getCategoriesByGroupController,
  startQuizByGroup
};
