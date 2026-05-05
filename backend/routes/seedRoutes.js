const express = require("express");
const { seedDatabase } = require("../services/seedService");
const { asyncHandler } = require("../middleware/asyncHandler");

const router = express.Router();

// Allow seeding in development (Render environment)
router.post("/seed/programming", asyncHandler(async (req, res) => {
  // Allow seeding in development or with valid key
  const seedKey = req.body.key || req.headers['x-seed-key'];
  const isProduction = process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV !== 'preview';

  // Allow if: development mode, or valid key provided, or Render preview
  if (isProduction && seedKey !== process.env.SEED_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const result = await seedDatabase();
  res.json(result);
}));

module.exports = router;
