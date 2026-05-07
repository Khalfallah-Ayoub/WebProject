const { getResults } = require("../../services/resultsService");

const getAdminResults = async (req, res) => {
  const results = await getResults();
  res.json({ results });
};

module.exports = { getAdminResults };
