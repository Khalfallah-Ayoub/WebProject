const notFound = (req, res) => {
  res.status(404).json({ error: "Not found" });
};

const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error(`❌ Error: ${err.message}`);
  console.error(`📍 Stack: ${err.stack}`);

  const status = err.status || 500;
  const message = err.message || "Server error";
  res.status(status).json({ error: message });
};

module.exports = { notFound, errorHandler };
