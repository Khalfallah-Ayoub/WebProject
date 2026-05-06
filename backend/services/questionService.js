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

const createQuestion = async ({ title, type, categoryId, groupId, answers }) => {
  const normalizedTitle = typeof title === "string" ? title.trim() : "";
  const normalizedType = normalizeType(type);
  const normalizedCategoryId = Number(categoryId);
  const normalizedGroupId = groupId ? Number(groupId) : null;

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

    // Check if group exists (if provided)
    if (normalizedGroupId) {
      const groupCheck = await client.query(
        "SELECT id FROM groups WHERE id = $1",
        [normalizedGroupId]
      );
      if (groupCheck.rows.length === 0) {
        const error = new Error("Group not found");
        error.status = 400;
        throw error;
      }
    }

    const questionResult = await client.query(
      "INSERT INTO questions (title, type, category_id, group_id) VALUES ($1, $2, $3, $4) RETURNING id, title, type, category_id, group_id, created_at",
      [normalizedTitle, normalizedType, normalizedCategoryId, normalizedGroupId]
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
        groupId: question.group_id,
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

const updateQuestion = async ({ id, title, type, categoryId, groupId, answers }) => {
  const questionId = Number(id);
  const normalizedTitle = typeof title === "string" ? title.trim() : "";
  const normalizedType = normalizeType(type);
  const normalizedCategoryId = Number(categoryId);
  const normalizedGroupId = groupId ? Number(groupId) : null;

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

    // Check if group exists (if provided)
    if (normalizedGroupId) {
      const groupCheck = await client.query(
        "SELECT id FROM groups WHERE id = $1",
        [normalizedGroupId]
      );
      if (groupCheck.rows.length === 0) {
        const error = new Error("Group not found");
        error.status = 400;
        throw error;
      }
    }

    await client.query(
      "UPDATE questions SET title = $1, type = $2, category_id = $3, group_id = $4 WHERE id = $5",
      [normalizedTitle, normalizedType, normalizedCategoryId, normalizedGroupId, questionId]
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
        groupId: normalizedGroupId,
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

const getAllQuestionsWithAnswers = async () => {
  // Get all questions
  const questionsResult = await pool.query(
    `SELECT id, title, type, category_id, group_id
     FROM questions
     ORDER BY id`
  );

  // Get all answers
  const answersResult = await pool.query(
    `SELECT id, question_id, text, is_correct
     FROM answers
     ORDER BY question_id, id`
  );

  // Build a map of answers by question_id
  const answersMap = {};
  answersResult.rows.forEach(answer => {
    if (!answersMap[answer.question_id]) {
      answersMap[answer.question_id] = [];
    }
    answersMap[answer.question_id].push({
      id: answer.id,
      text: answer.text,
      isCorrect: answer.is_correct,
    });
  });

  // Combine questions with their answers
  const questions = questionsResult.rows.map(q => ({
    id: q.id,
    title: q.title,
    type: q.type,
    categoryId: q.category_id,
    groupId: q.group_id,
    answers: answersMap[q.id] || [],
  }));

  return { questions };
};

module.exports = {
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getAllQuestionsWithAnswers,
};
