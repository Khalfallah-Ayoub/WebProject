const pool = require("../config/db");

// Get all groups
const getAllGroups = async () => {
  const result = await pool.query(
    "SELECT id, name, description, created_at FROM groups ORDER BY name ASC"
  );
  return result.rows;
};

// Get group by ID
const getGroupById = async (id) => {
  const groupId = Number(id);
  if (Number.isNaN(groupId)) {
    const error = new Error("Invalid group id");
    error.status = 400;
    throw error;
  }

  const result = await pool.query(
    "SELECT id, name, description, created_at FROM groups WHERE id = $1",
    [groupId]
  );

  if (result.rows.length === 0) {
    const error = new Error("Group not found");
    error.status = 404;
    throw error;
  }

  return result.rows[0];
};

// Create group
const createGroup = async (name, description = "") => {
  const normalizedName = typeof name === "string" ? name.trim() : "";
  const normalizedDescription = typeof description === "string" ? description.trim() : "";

  if (!normalizedName) {
    const error = new Error("Group name is required");
    error.status = 400;
    throw error;
  }

  if (normalizedName.length > 100) {
    const error = new Error("Group name must not exceed 100 characters");
    error.status = 400;
    throw error;
  }

  try {
    const result = await pool.query(
      "INSERT INTO groups (name, description) VALUES ($1, $2) RETURNING id, name, description, created_at",
      [normalizedName, normalizedDescription]
    );
    return result.rows[0];
  } catch (error) {
    if (error.code === "23505") {
      const duplicateError = new Error(
        `Group "${normalizedName}" already exists`
      );
      duplicateError.status = 409;
      throw duplicateError;
    }
    throw error;
  }
};

// Update group
const updateGroup = async (id, name, description = "") => {
  const groupId = Number(id);
  const normalizedName = typeof name === "string" ? name.trim() : "";
  const normalizedDescription = typeof description === "string" ? description.trim() : "";

  if (Number.isNaN(groupId)) {
    const error = new Error("Invalid group id");
    error.status = 400;
    throw error;
  }

  if (!normalizedName) {
    const error = new Error("Group name is required");
    error.status = 400;
    throw error;
  }

  if (normalizedName.length > 100) {
    const error = new Error("Group name must not exceed 100 characters");
    error.status = 400;
    throw error;
  }

  // Check if group exists
  const groupCheck = await pool.query(
    "SELECT id FROM groups WHERE id = $1",
    [groupId]
  );
  if (groupCheck.rows.length === 0) {
    const error = new Error("Group not found");
    error.status = 404;
    throw error;
  }

  try {
    const result = await pool.query(
      "UPDATE groups SET name = $1, description = $2 WHERE id = $3 RETURNING id, name, description, created_at",
      [normalizedName, normalizedDescription, groupId]
    );
    return result.rows[0];
  } catch (error) {
    if (error.code === "23505") {
      const duplicateError = new Error(
        `Group "${normalizedName}" already exists`
      );
      duplicateError.status = 409;
      throw duplicateError;
    }
    throw error;
  }
};

// Delete group
const deleteGroup = async (id) => {
  const groupId = Number(id);
  if (Number.isNaN(groupId)) {
    const error = new Error("Invalid group id");
    error.status = 400;
    throw error;
  }

  const result = await pool.query(
    "DELETE FROM groups WHERE id = $1 RETURNING id",
    [groupId]
  );

  if (result.rows.length === 0) {
    const error = new Error("Group not found");
    error.status = 404;
    throw error;
  }

  return { deleted: true, id: groupId };
};

// Get questions in a group
const getGroupQuestions = async (groupId) => {
  const normalizedGroupId = Number(groupId);

  if (Number.isNaN(normalizedGroupId)) {
    const error = new Error("Invalid group id");
    error.status = 400;
    throw error;
  }

  const groupCheck = await pool.query(
    "SELECT id FROM groups WHERE id = $1",
    [normalizedGroupId]
  );
  if (groupCheck.rows.length === 0) {
    const error = new Error("Group not found");
    error.status = 404;
    throw error;
  }

  const result = await pool.query(
    `SELECT q.id, q.title, q.type, q.category_id as "categoryId", q.group_id as "groupId",
            array_agg(jsonb_build_object('id', a.id, 'text', a.text, 'isCorrect', a.is_correct)) as "answers"
     FROM questions q
     LEFT JOIN answers a ON q.id = a.question_id
     WHERE q.group_id = $1
     GROUP BY q.id, q.title, q.type, q.category_id, q.group_id
     ORDER BY q.id`,
    [normalizedGroupId]
  );

  return {
    questions: result.rows.map(row => ({
      id: row.id,
      title: row.title,
      type: row.type,
      categoryId: row.categoryId,
      groupId: row.groupId,
      answers: row.answers || [],
    })),
  };
};

module.exports = {
  getAllGroups,
  getGroupById,
  createGroup,
  updateGroup,
  deleteGroup,
  getGroupQuestions,
};
