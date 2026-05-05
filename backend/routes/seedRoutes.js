const express = require("express");
const { seedDatabase } = require("../services/seedService");
const { asyncHandler } = require("../middleware/asyncHandler");

const router = express.Router();

// Only allow seeding in development or with special key
router.post("/seed/programming", asyncHandler(async (req, res) => {
  const seedKey = req.body.key || req.headers['x-seed-key'];
  if (seedKey !== process.env.SEED_KEY && process.env.NODE_ENV === 'production') {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const result = await seedDatabase();
  res.json(result);
}));

module.exports = router;
