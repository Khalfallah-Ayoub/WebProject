const pool = require("../config/db");

const getResults = async () => {
  const { rows } = await pool.query(
    `SELECT qs.id,
            qs.username,
            qs.score,
            qs.started_at,
            qs.finished_at,
            COUNT(sq.question_id) AS total_questions
     FROM quiz_sessions qs
     LEFT JOIN session_questions sq ON sq.session_id = qs.id
     GROUP BY qs.id
     ORDER BY qs.started_at DESC`
  );

  return rows;
};

module.exports = { getResults };
