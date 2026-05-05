const {
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getAllQuestionsWithAnswers,
} = require("../../services/questionService");

const getAdminQuestions = async (req, res) => {
  const result = await getAllQuestionsWithAnswers();
  res.json(result);
};

const createAdminQuestion = async (req, res) => {
  const result = await createQuestion({
    title: req.body.title,
    type: req.body.type,
    categoryId: req.body.categoryId ?? req.body.category_id,
    answers: req.body.answers,
  });
  res.status(201).json(result);
};

const updateAdminQuestion = async (req, res) => {
  const result = await updateQuestion({
    id: req.params.id,
    title: req.body.title,
    type: req.body.type,
    categoryId: req.body.categoryId ?? req.body.category_id,
    answers: req.body.answers,
  });
  res.json(result);
};

const deleteAdminQuestion = async (req, res) => {
  const result = await deleteQuestion(req.params.id);
  res.json(result);
};

module.exports = {
  getAdminQuestions,
  createAdminQuestion,
  updateAdminQuestion,
  deleteAdminQuestion,
};
