require("dotenv").config();

const bcrypt = require("bcrypt");
const request = require("supertest");
const app = require("../app");
const pool = require("../config/db");
const { schema } = require("../db/schema");

const uniqueSuffix = Date.now();
const adminUsername = `admin_test_${uniqueSuffix}`;
const adminPassword = "TestPassword123!";
const categoryName = `Category ${uniqueSuffix}`;

let adminToken;
let categoryId;
let questionId;
let quizSessionId;
let previousSettings;
let settingsId;
let createdQuestionIds = [];

const ensureSettings = async () => {
  const { rows } = await pool.query("SELECT id, number_of_questions FROM settings ORDER BY id LIMIT 1");
  if (rows.length === 0) {
    const insertResult = await pool.query(
      "INSERT INTO settings (number_of_questions) VALUES (1) RETURNING id, number_of_questions"
    );
    settingsId = insertResult.rows[0].id;
    previousSettings = null;
  } else {
    settingsId = rows[0].id;
    previousSettings = rows[0].number_of_questions;
    await pool.query("UPDATE settings SET number_of_questions = 1 WHERE id = $1", [settingsId]);
  }
};

const cleanupSettings = async () => {
  if (settingsId && previousSettings !== null && previousSettings !== undefined) {
    await pool.query("UPDATE settings SET number_of_questions = $1 WHERE id = $2", [
      previousSettings,
      settingsId,
    ]);
  }
};

beforeAll(async () => {
  await pool.query(schema);
  await ensureSettings();

  const hashed = await bcrypt.hash(adminPassword, 10);
  await pool.query(
    `INSERT INTO admins (username, password)
     VALUES ($1, $2)
     ON CONFLICT (username) DO UPDATE SET password = EXCLUDED.password`,
    [adminUsername, hashed]
  );

  const categoryResult = await pool.query(
    "INSERT INTO categories (name) VALUES ($1) RETURNING id",
    [categoryName]
  );
  categoryId = categoryResult.rows[0].id;

  const questionResult = await pool.query(
    "INSERT INTO questions (title, type, category_id) VALUES ($1, $2, $3) RETURNING id",
    [`Seed Question ${uniqueSuffix}`, "SCQ", categoryId]
  );
  const seedQuestionId = questionResult.rows[0].id;
  createdQuestionIds.push(seedQuestionId);

  await pool.query(
    `INSERT INTO answers (question_id, text, is_correct)
     VALUES ($1, $2, $3), ($1, $4, $5)`,
    [seedQuestionId, "Seed A", true, "Seed B", false]
  );
});

afterAll(async () => {
  if (createdQuestionIds.length > 0) {
    await pool.query("DELETE FROM questions WHERE id = ANY($1::int[])", [createdQuestionIds]);
  }
  if (quizSessionId) {
    await pool.query("DELETE FROM quiz_sessions WHERE id = $1", [quizSessionId]);
  }
  if (categoryId) {
    await pool.query("DELETE FROM categories WHERE id = $1", [categoryId]);
  }
  await pool.query("DELETE FROM admins WHERE username = $1", [adminUsername]);
  await cleanupSettings();
  await pool.end();
});

describe("Admin APIs", () => {
  test("POST /admin/login", async () => {
    const response = await request(app)
      .post("/admin/login")
      .send({ username: adminUsername, password: adminPassword })
      .expect(200);

    expect(response.body.token).toBeTruthy();
    adminToken = response.body.token;
  });

  test("POST /admin/questions", async () => {
    const response = await request(app)
      .post("/admin/questions")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        title: "Sample Question",
        type: "SCQ",
        categoryId,
        answers: [
          { text: "Answer A", isCorrect: true },
          { text: "Answer B", isCorrect: false },
        ],
      })
      .expect(201);

    expect(response.body.question).toBeTruthy();
    questionId = response.body.question.id;
    createdQuestionIds.push(questionId);
  });

  test("PUT /admin/questions/:id", async () => {
    const response = await request(app)
      .put(`/admin/questions/${questionId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        title: "Updated Question",
        type: "SCQ",
        categoryId,
        answers: [
          { text: "Answer A", isCorrect: true },
          { text: "Answer C", isCorrect: false },
        ],
      })
      .expect(200);

    expect(response.body.question.title).toBe("Updated Question");
  });

  test("DELETE /admin/questions/:id", async () => {
    const createResponse = await request(app)
      .post("/admin/questions")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        title: "Question to delete",
        type: "SCQ",
        categoryId,
        answers: [
          { text: "Yes", isCorrect: true },
          { text: "No", isCorrect: false },
        ],
      })
      .expect(201);

    const deleteId = createResponse.body.question.id;
    createdQuestionIds.push(deleteId);

    const response = await request(app)
      .delete(`/admin/questions/${deleteId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);

    expect(response.body.deleted).toBe(true);
  });
});

describe("Quiz APIs", () => {
  test("POST /quiz/start", async () => {
    const response = await request(app)
      .post("/quiz/start")
      .send({ username: `user_${uniqueSuffix}` })
      .expect(201);

    expect(response.body.sessionId).toBeTruthy();
    expect(Array.isArray(response.body.questions)).toBe(true);
    quizSessionId = response.body.sessionId;
  });

  test("GET /quiz/:sessionId", async () => {
    const response = await request(app)
      .get(`/quiz/${quizSessionId}`)
      .expect(200);

    expect(response.body.sessionId).toBe(quizSessionId);
    expect(Array.isArray(response.body.questions)).toBe(true);
  });

  test("POST /quiz/answer", async () => {
    const quizResponse = await request(app)
      .get(`/quiz/${quizSessionId}`)
      .expect(200);

    const question = quizResponse.body.questions[0];

    const { rows: correctAnswers } = await pool.query(
      "SELECT id FROM answers WHERE question_id = $1 AND is_correct = true",
      [question.id]
    );
    const answerIds = correctAnswers.map((row) => row.id);

    const response = await request(app)
      .post("/quiz/answer")
      .send({
        sessionId: quizSessionId,
        questionId: question.id,
        answerIds,
      })
      .expect(200);

    expect(response.body.saved).toBe(true);
  });

  test("POST /quiz/submit", async () => {
    const response = await request(app)
      .post("/quiz/submit")
      .send({ sessionId: quizSessionId })
      .expect(200);

    expect(response.body.sessionId).toBe(quizSessionId);
    expect(typeof response.body.score).toBe("number");
  });
});

describe("Admin results", () => {
  test("GET /admin/results", async () => {
    const response = await request(app)
      .get("/admin/results")
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);

    const match = response.body.results.find((row) => row.id === quizSessionId);
    expect(match).toBeTruthy();
  });
});
