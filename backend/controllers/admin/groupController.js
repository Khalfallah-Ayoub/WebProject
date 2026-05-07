const {
  getAllGroups,
  getGroupById,
  createGroup,
  updateGroup,
  deleteGroup,
  getGroupQuestions,
} = require("../../services/groupService");

const getAdminGroups = async (req, res) => {
  const groups = await getAllGroups();
  res.json({ groups });
};

const getAdminGroupById = async (req, res) => {
  const group = await getGroupById(req.params.id);
  res.json({ group });
};

const createAdminGroup = async (req, res) => {
  const group = await createGroup(req.body.name, req.body.description);
  res.status(201).json({ group });
};

const updateAdminGroup = async (req, res) => {
  const group = await updateGroup(req.params.id, req.body.name, req.body.description);
  res.json({ group });
};

const deleteAdminGroup = async (req, res) => {
  const result = await deleteGroup(req.params.id);
  res.json(result);
};

const getGroupQuestionsController = async (req, res) => {
  const result = await getGroupQuestions(req.params.id);
  res.json(result);
};

module.exports = {
  getAdminGroups,
  getAdminGroupById,
  createAdminGroup,
  updateAdminGroup,
  deleteAdminGroup,
  getGroupQuestionsController,
};
