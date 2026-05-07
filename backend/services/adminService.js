const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const login = async (username, password) => {
  const normalizedUser = typeof username === "string" ? username.trim() : "";
  const normalizedPass = typeof password === "string" ? password : "";

  if (!normalizedUser || !normalizedPass) {
    const error = new Error("Username and password are required");
    error.status = 400;
    throw error;
  }

  const { rows } = await pool.query(
    "SELECT id, username, password FROM admins WHERE username = $1",
    [normalizedUser]
  );

  if (rows.length === 0) {
    const error = new Error("Invalid credentials");
    error.status = 401;
    throw error;
  }

  const admin = rows[0];
  const valid = await bcrypt.compare(normalizedPass, admin.password);
  if (!valid) {
    const error = new Error("Invalid credentials");
    error.status = 401;
    throw error;
  }

  const token = jwt.sign(
    { adminId: admin.id, username: admin.username },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );

  return { token };
};

module.exports = { login };
