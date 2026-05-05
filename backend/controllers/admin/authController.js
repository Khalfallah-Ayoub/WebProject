const { login } = require("../../services/adminService");

const loginAdmin = async (req, res) => {
  const { token } = await login(req.body.username, req.body.password);
  res.json({ token });
};

module.exports = { loginAdmin };
