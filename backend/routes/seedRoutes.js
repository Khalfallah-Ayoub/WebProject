const express = require("express");
const { seedDatabase, seedGroupsDatabase, seedCompleteDatabase } = require("../services/seedService");
const { asyncHandler } = require("../middleware/asyncHandler");

const router = express.Router();

// Allow seeding in development (Render environment)
router.post("/seed/programming", asyncHandler(async (req, res) => {
  const seedKey = req.body.key || req.headers['x-seed-key'];
  const isProduction = process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV !== 'preview';

  if (isProduction && seedKey !== process.env.SEED_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const result = await seedDatabase();
  res.json(result);
}));

// Endpoint for seeding the groups system
router.post("/seed/groups-system", asyncHandler(async (req, res) => {
  const seedKey = req.body.key || req.headers['x-seed-key'];
  const isProduction = process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV !== 'preview';

  if (isProduction && seedKey !== process.env.SEED_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const result = await seedGroupsDatabase();
  res.json(result);
}));

// Complete seed: Programming Languages + Culture groups
router.post("/seed/complete", asyncHandler(async (req, res) => {
  const seedKey = req.body.key || req.headers['x-seed-key'];
  const isProduction = process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV !== 'preview';

  if (isProduction && seedKey !== process.env.SEED_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const result = await seedCompleteDatabase();
  res.json(result);
}));

module.exports = router;
