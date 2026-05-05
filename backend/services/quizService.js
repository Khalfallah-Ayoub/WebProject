const pool = require("../config/db");
const { shuffle } = require("../utils/shuffle");

const mapQuestions = (rows) => {
  const questions = new Map();

  rows.forEach((row) => {
    if (!questions.has(row.question_id)) {
      questions.set(row.question_id, {
        id: row.question_id,
        title: row.title,
        type: row.type,
        categoryId: row.category_id,
        answers: [],
      });
    }

    questions.get(row.question_id).answers.push({
      id: row.answer_id,
      text: row.answer_text,
    });
  });

  return Array.from(questions.values());
};

const fetchSessionQuestions = async (sessionId) => {
  const { rows } = await pool.query(
    `SELECT q.id AS question_id,
            q.title,
            q.type,
            q.category_id,
            a.id AS answer_id,
            a.text AS answer_text
     FROM session_questions sq
     JOIN questions q ON q.id = sq.question_id
     JOIN answers a ON a.question_id = q.id
     WHERE sq.session_id = $1
     ORDER BY q.id, a.id`,
    [sessionId]
  );

  return mapQuestions(rows);
};

const startQuiz = async (username) => {
  const normalizedUser = typeof username === "string" ? username.trim() : "";
  if (!normalizedUser) {
    const error = new Error("username is required");
    error.status = 400;
    throw error;
  }

  const settingsResult = await pool.query(
    "SELECT number_of_questions FROM settings ORDER BY id LIMIT 1"
  );
  const desiredCount = settingsResult.rows[0]?.number_of_questions || 10;

  const { rows: questionRows } = await pool.query("SELECT id FROM questions");
  const questionIds = questionRows.map((row) => row.id);
  if (questionIds.length === 0) {
    const error = new Error("No questions available");
    error.status = 400;
    throw error;
  }

  const selectedIds = shuffle(questionIds).slice(
    0,
    Math.min(desiredCount, questionIds.length)
  );

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const sessionResult = await client.query(
      "INSERT INTO quiz_sessions (username) VALUES ($1) RETURNING id",
      [normalizedUser]
    );
    const sessionId = sessionResult.rows[0].id;

    for (const questionId of selectedIds) {
      await client.query(
        "INSERT INTO session_questions (session_id, question_id) VALUES ($1, $2)",
        [sessionId, questionId]
      );
    }

    await client.query("COMMIT");

    const questions = await fetchSessionQuestions(sessionId);
    return { sessionId, questions };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const getQuiz = async (sessionId) => {
  const normalizedSessionId = Number(sessionId);
  if (Number.isNaN(normalizedSessionId)) {
    const error = new Error("Invalid session id");
    error.status = 400;
    throw error;
  }

  const sessionCheck = await pool.query(
    "SELECT id FROM quiz_sessions WHERE id = $1",
    [normalizedSessionId]
  );
  if (sessionCheck.rows.length === 0) {
    const error = new Error("Session not found");
    error.status = 404;
    throw error;
  }

  const questions = await fetchSessionQuestions(normalizedSessionId);
  return { sessionId: normalizedSessionId, questions };
};

const submitAnswer = async ({ sessionId, questionId, answerIds }) => {
  const normalizedSessionId = Number(sessionId);
  const normalizedQuestionId = Number(questionId);
  const normalizedAnswerIds = Array.isArray(answerIds)
    ? answerIds.map((id) => Number(id)).filter((id) => !Number.isNaN(id))
    : [];

  if (Number.isNaN(normalizedSessionId) || Number.isNaN(normalizedQuestionId)) {
    const error = new Error("sessionId and questionId are required");
    error.status = 400;
    throw error;
  }

  if (normalizedAnswerIds.length === 0) {
    const error = new Error("At least one answerId is required");
    error.status = 400;
    throw error;
  }

  const sessionQuestionCheck = await pool.query(
    "SELECT 1 FROM session_questions WHERE session_id = $1 AND question_id = $2",
    [normalizedSessionId, normalizedQuestionId]
  );
  if (sessionQuestionCheck.rows.length === 0) {
    const error = new Error("Question does not belong to session");
    error.status = 400;
    throw error;
  }

  const questionTypeResult = await pool.query(
    "SELECT type FROM questions WHERE id = $1",
    [normalizedQuestionId]
  );
  if (questionTypeResult.rows.length === 0) {
    const error = new Error("Question not found");
    error.status = 404;
    throw error;
  }

  if (questionTypeResult.rows[0].type === "SCQ" && normalizedAnswerIds.length !== 1) {
    const error = new Error("SCQ questions accept exactly one answer");
    error.status = 400;
    throw error;
  }

  const answersCheck = await pool.query(
    "SELECT id FROM answers WHERE question_id = $1 AND id = ANY($2::int[])",
    [normalizedQuestionId, normalizedAnswerIds]
  );
  if (answersCheck.rows.length !== normalizedAnswerIds.length) {
    const error = new Error("One or more answers are invalid for this question");
    error.status = 400;
    throw error;
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      "DELETE FROM user_answers WHERE session_id = $1 AND question_id = $2",
      [normalizedSessionId, normalizedQuestionId]
    );

    for (const answerId of normalizedAnswerIds) {
      await client.query(
        "INSERT INTO user_answers (session_id, question_id, answer_id) VALUES ($1, $2, $3)",
        [normalizedSessionId, normalizedQuestionId, answerId]
      );
    }

    await client.query("COMMIT");
    return { saved: true };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const submitQuiz = async (sessionId) => {
  const normalizedSessionId = Number(sessionId);
  if (Number.isNaN(normalizedSessionId)) {
    const error = new Error("sessionId is required");
    error.status = 400;
    throw error;
  }

  const { rows } = await pool.query(
    `SELECT q.id AS question_id,
            ARRAY_AGG(DISTINCT CASE WHEN a.is_correct THEN a.id END) AS correct_ids,
            ARRAY_AGG(DISTINCT ua.answer_id) AS user_ids
     FROM session_questions sq
     JOIN questions q ON q.id = sq.question_id
     LEFT JOIN answers a ON a.question_id = q.id
     LEFT JOIN user_answers ua ON ua.session_id = sq.session_id AND ua.question_id = q.id
     WHERE sq.session_id = $1
     GROUP BY q.id`,
    [normalizedSessionId]
  );

  if (rows.length === 0) {
    const error = new Error("Session not found");
    error.status = 404;
    throw error;
  }

  let score = 0;
  rows.forEach((row) => {
    const correctIds = (row.correct_ids || []).filter((id) => id !== null);
    const userIds = (row.user_ids || []).filter((id) => id !== null);
    const correctSet = new Set(correctIds);
    const userSet = new Set(userIds);

    const isCorrect =
      correctSet.size === userSet.size &&
      Array.from(correctSet).every((id) => userSet.has(id));

    if (isCorrect) {
      score += 1;
    }
  });

  await pool.query(
    "UPDATE quiz_sessions SET score = $1, finished_at = NOW() WHERE id = $2",
    [score, normalizedSessionId]
  );

  const percentage = rows.length > 0 ? Math.round((score / rows.length) * 100) : 0;

  return { sessionId: normalizedSessionId, score, totalQuestions: rows.length, percentage };
};

module.exports = {
  startQuiz,
  getQuiz,
  submitAnswer,
  submitQuiz,
};
