import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import Quiz from "../models/Quiz.js";

const router = express.Router();

/**
 * GET /api/leaderboard?limit=10
 * Returns top users ordered by points (descending).
 */
router.get("/", protect, async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);

    // Return top users by points, omit sensitive fields
    const top = await User.find({})
      .sort({ points: -1 })
      .limit(limit)
      .select("name points dailyStreak createdAt");

    res.json(top);
  } catch (err) {
    console.error("Leaderboard error:", err);
    res.status(500).json({ message: "Failed to fetch leaderboard" });
  }
});

/**
 * POST /api/leaderboard/add-points
 * Body { userId, points, reason? }
 * Use this to add points after quiz completion.
 * protect ensures req.user exists; you can require admin if needed.
 */
router.post("/add-points", protect, async (req, res) => {
  try {
    const userId = req.body.userId || req.user.id; // default to current user
    const points = Number(req.body.points) || 0;

    if (!points) return res.status(400).json({ message: "points required" });

    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { points } },
      { new: true, projection: "name points dailyStreak" }
    );

    // Optionally emit real-time update via socket.io here

    res.json({ message: "Points added", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add points" });
  }
});

export default router;
