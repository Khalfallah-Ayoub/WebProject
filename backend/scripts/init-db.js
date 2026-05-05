require("dotenv").config();

const pool = require("../config/db");
const { schema } = require("../db/schema");

const ensureSettings = async () => {
  const { rows } = await pool.query("SELECT id FROM settings LIMIT 1");
  if (rows.length === 0) {
    await pool.query("INSERT INTO settings (number_of_questions) VALUES (10)");
  }
};

const init = async () => {
  try {
    await pool.query(schema);
    await ensureSettings();
    console.log("Database initialized");
  } catch (error) {
    console.error("Database initialization failed:", error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

init();
