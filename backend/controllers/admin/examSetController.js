const {
  createExamSet,
  getExamSetsByCategory,
  getExamSetsByAllCategories,
  getExamSetQuestions,
  addQuestionToExamSet,
  removeQuestionFromExamSet,
  updateExamSet,
  deleteExamSet,
} = require("../../services/examSetService");

const getExamSets = async (req, res) => {
  const { categoryId } = req.query;

  if (categoryId) {
    const result = await getExamSetsByCategory(categoryId);
    res.json(result);
  } else {
    const result = await getExamSetsByAllCategories();
    res.json(result);
  }
};

const createAdminExamSet = async (req, res) => {
  const result = await createExamSet({
    categoryId: req.body.categoryId,
    name: req.body.name,
    difficulty: req.body.difficulty,
    description: req.body.description,
  });
  res.status(201).json(result);
};

const getQuestions = async (req, res) => {
  const result = await getExamSetQuestions(req.params.id);
  res.json(result);
};

const addQuestion = async (req, res) => {
  const result = await addQuestionToExamSet(req.params.id, req.body.questionId);
  res.json(result);
};

const removeQuestion = async (req, res) => {
  const result = await removeQuestionFromExamSet(req.params.id, req.body.questionId);
  res.json(result);
};

const updateAdminExamSet = async (req, res) => {
  const result = await updateExamSet(req.params.id, {
    name: req.body.name,
    difficulty: req.body.difficulty,
    description: req.body.description,
  });
  res.json(result);
};

const deleteAdminExamSet = async (req, res) => {
  const result = await deleteExamSet(req.params.id);
  res.json(result);
};

module.exports = {
  getExamSets,
  createAdminExamSet,
  getQuestions,
  addQuestion,
  removeQuestion,
  updateAdminExamSet,
  deleteAdminExamSet,
};
