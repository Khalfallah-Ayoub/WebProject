const pool = require("../config/db");

const normalizeType = (type) =>
  typeof type === "string" ? type.trim().toUpperCase() : "";

const normalizeAnswers = (answers = []) =>
  answers.map((answer) => ({
    text: typeof answer.text === "string" ? answer.text.trim() : "",
    isCorrect:
      typeof answer.is_correct === "boolean"
        ? answer.is_correct
        : Boolean(answer.isCorrect),
  }));

const validateAnswers = (type, answers) => {
  if (!Array.isArray(answers) || answers.length === 0) {
    const error = new Error("Answers are required");
    error.status = 400;
    throw error;
  }

  const normalized = normalizeAnswers(answers);
  const invalid = normalized.some((answer) => !answer.text);
  if (invalid) {
    const error = new Error("Each answer must include text");
    error.status = 400;
    throw error;
  }

  const correctCount = normalized.filter((answer) => answer.isCorrect).length;
  if (type === "SCQ" && correctCount !== 1) {
    const error = new Error("SCQ questions require exactly one correct answer");
    error.status = 400;
    throw error;
  }
  if (type === "MCQ" && correctCount === 0) {
    const error = new Error("MCQ questions require at least one correct answer");
    error.status = 400;
    throw error;
  }

  return normalized;
};

const createQuestion = async ({ title, type, categoryId, answers }) => {
  const normalizedTitle = typeof title === "string" ? title.trim() : "";
  const normalizedType = normalizeType(type);
  const normalizedCategoryId = Number(categoryId);

  if (!normalizedTitle || !normalizedType || Number.isNaN(normalizedCategoryId)) {
    const error = new Error("title, type, and categoryId are required");
    error.status = 400;
    throw error;
  }

  if (!["SCQ", "MCQ"].includes(normalizedType)) {
    const error = new Error("type must be SCQ or MCQ");
    error.status = 400;
    throw error;
  }

  const normalizedAnswers = validateAnswers(normalizedType, answers);

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const categoryCheck = await client.query(
      "SELECT id FROM categories WHERE id = $1",
      [normalizedCategoryId]
    );
    if (categoryCheck.rows.length === 0) {
      const error = new Error("Category not found");
      error.status = 400;
      throw error;
    }

    const questionResult = await client.query(
      "INSERT INTO questions (title, type, category_id) VALUES ($1, $2, $3) RETURNING id, title, type, category_id, created_at",
      [normalizedTitle, normalizedType, normalizedCategoryId]
    );

    const question = questionResult.rows[0];
    const insertedAnswers = [];

    for (const answer of normalizedAnswers) {
      const { rows } = await client.query(
        "INSERT INTO answers (question_id, text, is_correct) VALUES ($1, $2, $3) RETURNING id, text, is_correct",
        [question.id, answer.text, answer.isCorrect]
      );
      insertedAnswers.push(rows[0]);
    }

    await client.query("COMMIT");

    return {
      question: {
        id: question.id,
        title: question.title,
        type: question.type,
        categoryId: question.category_id,
        createdAt: question.created_at,
      },
      answers: insertedAnswers,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const updateQuestion = async ({ id, title, type, categoryId, answers }) => {
  const questionId = Number(id);
  const normalizedTitle = typeof title === "string" ? title.trim() : "";
  const normalizedType = normalizeType(type);
  const normalizedCategoryId = Number(categoryId);

  if (Number.isNaN(questionId)) {
    const error = new Error("Invalid question id");
    error.status = 400;
    throw error;
  }

  if (!normalizedTitle || !normalizedType || Number.isNaN(normalizedCategoryId)) {
    const error = new Error("title, type, and categoryId are required");
    error.status = 400;
    throw error;
  }

  if (!["SCQ", "MCQ"].includes(normalizedType)) {
    const error = new Error("type must be SCQ or MCQ");
    error.status = 400;
    throw error;
  }

  const normalizedAnswers = validateAnswers(normalizedType, answers);

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const questionCheck = await client.query(
      "SELECT id FROM questions WHERE id = $1",
      [questionId]
    );
    if (questionCheck.rows.length === 0) {
      const error = new Error("Question not found");
      error.status = 404;
      throw error;
    }

    const categoryCheck = await client.query(
      "SELECT id FROM categories WHERE id = $1",
      [normalizedCategoryId]
    );
    if (categoryCheck.rows.length === 0) {
      const error = new Error("Category not found");
      error.status = 400;
      throw error;
    }

    await client.query(
      "UPDATE questions SET title = $1, type = $2, category_id = $3 WHERE id = $4",
      [normalizedTitle, normalizedType, normalizedCategoryId, questionId]
    );

    await client.query("DELETE FROM answers WHERE question_id = $1", [questionId]);

    const insertedAnswers = [];
    for (const answer of normalizedAnswers) {
      const { rows } = await client.query(
        "INSERT INTO answers (question_id, text, is_correct) VALUES ($1, $2, $3) RETURNING id, text, is_correct",
        [questionId, answer.text, answer.isCorrect]
      );
      insertedAnswers.push(rows[0]);
    }

    await client.query("COMMIT");

    return {
      question: {
        id: questionId,
        title: normalizedTitle,
        type: normalizedType,
        categoryId: normalizedCategoryId,
      },
      answers: insertedAnswers,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const deleteQuestion = async (id) => {
  const questionId = Number(id);
  if (Number.isNaN(questionId)) {
    const error = new Error("Invalid question id");
    error.status = 400;
    throw error;
  }

  const result = await pool.query(
    "DELETE FROM questions WHERE id = $1 RETURNING id",
    [questionId]
  );

  if (result.rows.length === 0) {
    const error = new Error("Question not found");
    error.status = 404;
    throw error;
  }

  return { deleted: true };
};

module.exports = {
  createQuestion,
  updateQuestion,
  deleteQuestion,
};
