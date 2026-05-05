const pool = require("../config/db");

// Create exam set
const createExamSet = async ({ categoryId, name, difficulty, description }) => {
  const normalizedCategoryId = Number(categoryId);
  const normalizedName = typeof name === "string" ? name.trim() : "";
  const normalizedDifficulty = typeof difficulty === "string" ? difficulty.toLowerCase() : "beginner";
  const normalizedDescription = typeof description === "string" ? description.trim() : "";

  if (!normalizedName || !["beginner", "intermediate", "advanced"].includes(normalizedDifficulty)) {
    const error = new Error("name and valid difficulty level are required");
    error.status = 400;
    throw error;
  }

  // Check category exists
  const categoryCheck = await pool.query(
    "SELECT id FROM categories WHERE id = $1",
    [normalizedCategoryId]
  );
  if (categoryCheck.rows.length === 0) {
    const error = new Error("Category not found");
    error.status = 404;
    throw error;
  }

  const result = await pool.query(
    "INSERT INTO exam_sets (category_id, name, difficulty, description) VALUES ($1, $2, $3, $4) RETURNING *",
    [normalizedCategoryId, normalizedName, normalizedDifficulty, normalizedDescription]
  );

  return { examSet: result.rows[0] };
};

// Get exam sets by category
const getExamSetsByCategory = async (categoryId) => {
  const normalizedCategoryId = Number(categoryId);

  const result = await pool.query(
    `SELECT es.*, COUNT(esq.question_id) as question_count
     FROM exam_sets es
     LEFT JOIN exam_set_questions esq ON es.id = esq.exam_set_id
     WHERE es.category_id = $1
     GROUP BY es.id
     ORDER BY es.difficulty ASC, es.name ASC`,
    [normalizedCategoryId]
  );

  return { examSets: result.rows };
};

// Get all categories with their exam sets
const getExamSetsByAllCategories = async () => {
  const result = await pool.query(
    `SELECT c.id, c.name,
            json_agg(
              jsonb_build_object(
                'id', es.id,
                'name', es.name,
                'difficulty', es.difficulty,
                'description', es.description,
                'questionCount', COUNT(esq.question_id)
              ) ORDER BY es.difficulty
            ) as exam_sets
     FROM categories c
     LEFT JOIN exam_sets es ON c.id = es.category_id
     LEFT JOIN exam_set_questions esq ON es.id = esq.exam_set_id
     GROUP BY c.id, c.name
     ORDER BY c.name ASC`
  );

  return { categoriesWithExamSets: result.rows };
};

// Get exam set questions
const getExamSetQuestions = async (examSetId) => {
  const normalizedExamSetId = Number(examSetId);

  const result = await pool.query(
    `SELECT q.id, q.title, q.type, q.category_id,
            json_agg(
              jsonb_build_object(
                'id', a.id,
                'text', a.text
              )
            ) as answers
     FROM exam_set_questions esq
     JOIN questions q ON esq.question_id = q.id
     JOIN answers a ON a.question_id = q.id
     WHERE esq.exam_set_id = $1
     GROUP BY q.id, q.title, q.type, q.category_id
     ORDER BY q.id`,
    [normalizedExamSetId]
  );

  return { questions: result.rows };
};

// Add question to exam set
const addQuestionToExamSet = async (examSetId, questionId) => {
  const normalizedExamSetId = Number(examSetId);
  const normalizedQuestionId = Number(questionId);

  // Check exam set exists
  const examSetCheck = await pool.query(
    "SELECT id FROM exam_sets WHERE id = $1",
    [normalizedExamSetId]
  );
  if (examSetCheck.rows.length === 0) {
    const error = new Error("Exam set not found");
    error.status = 404;
    throw error;
  }

  // Check question exists
  const questionCheck = await pool.query(
    "SELECT id FROM questions WHERE id = $1",
    [normalizedQuestionId]
  );
  if (questionCheck.rows.length === 0) {
    const error = new Error("Question not found");
    error.status = 404;
    throw error;
  }

  await pool.query(
    "INSERT INTO exam_set_questions (exam_set_id, question_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
    [normalizedExamSetId, normalizedQuestionId]
  );

  return { added: true };
};

// Remove question from exam set
const removeQuestionFromExamSet = async (examSetId, questionId) => {
  const normalizedExamSetId = Number(examSetId);
  const normalizedQuestionId = Number(questionId);

  const result = await pool.query(
    "DELETE FROM exam_set_questions WHERE exam_set_id = $1 AND question_id = $2",
    [normalizedExamSetId, normalizedQuestionId]
  );

  return { removed: result.rowCount > 0 };
};

// Update exam set
const updateExamSet = async (examSetId, { name, difficulty, description }) => {
  const normalizedExamSetId = Number(examSetId);
  const normalizedName = typeof name === "string" ? name.trim() : "";
  const normalizedDifficulty = typeof difficulty === "string" ? difficulty.toLowerCase() : "";
  const normalizedDescription = typeof description === "string" ? description.trim() : "";

  if (!["beginner", "intermediate", "advanced"].includes(normalizedDifficulty)) {
    const error = new Error("Invalid difficulty level");
    error.status = 400;
    throw error;
  }

  const result = await pool.query(
    "UPDATE exam_sets SET name = $1, difficulty = $2, description = $3 WHERE id = $4 RETURNING *",
    [normalizedName || null, normalizedDifficulty || null, normalizedDescription || null, normalizedExamSetId]
  );

  if (result.rows.length === 0) {
    const error = new Error("Exam set not found");
    error.status = 404;
    throw error;
  }

  return { examSet: result.rows[0] };
};

// Delete exam set
const deleteExamSet = async (examSetId) => {
  const normalizedExamSetId = Number(examSetId);

  const result = await pool.query(
    "DELETE FROM exam_sets WHERE id = $1 RETURNING id",
    [normalizedExamSetId]
  );

  if (result.rows.length === 0) {
    const error = new Error("Exam set not found");
    error.status = 404;
    throw error;
  }

  return { deleted: true };
};

module.exports = {
  createExamSet,
  getExamSetsByCategory,
  getExamSetsByAllCategories,
  getExamSetQuestions,
  addQuestionToExamSet,
  removeQuestionFromExamSet,
  updateExamSet,
  deleteExamSet,
};
