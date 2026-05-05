require("dotenv").config();

const bcrypt = require("bcrypt");
const pool = require("../config/db");

const [,, username, password] = process.argv;

if (!username || !password) {
  console.error("Usage: node scripts/create-admin.js <username> <password>");
  process.exit(1);
}

const createAdmin = async () => {
  try {
    const hashed = await bcrypt.hash(password, 10);
    await pool.query(
      `INSERT INTO admins (username, password)
       VALUES ($1, $2)
       ON CONFLICT (username) DO UPDATE SET password = EXCLUDED.password`,
      [username, hashed]
    );
    console.log("Admin user created/updated");
  } catch (error) {
    console.error("Failed to create admin:", error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

createAdmin();
