const pool = require("../config/db");

const getResults = async () => {
  const { rows } = await pool.query(
    `SELECT qs.id,
            qs.username,
            qs.score,
            qs.started_at,
            COALESCE(qs.finished_at, qs.started_at) AS finished_at,
            COUNT(sq.question_id) AS total_questions,
            CASE
              WHEN COUNT(sq.question_id) > 0
              THEN ROUND((qs.score::float / COUNT(sq.question_id) * 100)::numeric, 2)::int
              ELSE 0
            END AS percentage
     FROM quiz_sessions qs
     LEFT JOIN session_questions sq ON sq.session_id = qs.id
     GROUP BY qs.id
     ORDER BY qs.started_at DESC`
  );

  return rows;
};

module.exports = { getResults };
