require("dotenv").config();

const express = require("express");
const cors = require("cors");
const adminRoutes = require("./routes/adminRoutes");
const quizRoutes = require("./routes/quizRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");
const pool = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() as time, version() as version");
    res.json({
      status: "✅ OK",
      database: "✅ Connected",
      timestamp: new Date().toISOString(),
      pgVersion: result.rows[0].version.split(",")[0]
    });
  } catch (err) {
    res.status(503).json({
      status: "⚠️ Server Running",
      database: "❌ Not Connected",
      error: err.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.use("/admin", adminRoutes);
app.use("/quiz", quizRoutes);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(port, () => {
    console.log(`API listening on port ${port}`);
  });
}

module.exports = app;
