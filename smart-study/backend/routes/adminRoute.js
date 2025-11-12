import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

// ✅ GET: Admin Stats (total users, active users, avg streak)
router.get("/stats", protect, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ dailyStreak: { $gt: 0 } });
    const avgData = await User.aggregate([
      { $group: { _id: null, avgStreak: { $avg: "$dailyStreak" } } },
    ]);

    const avgStreak = avgData[0]?.avgStreak?.toFixed(1) || 0;

    res.json({
      totalUsers,
      activeUsers,
      avgStreak,
    });
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ message: "Error fetching stats" });
  }
});

// ✅ GET: Leaderboard (sorted by streak)
router.get("/leaderboard", protect, async (req, res) => {
  try {
    const leaderboard = await User.find()
      .sort({ dailyStreak: -1 })
      .select("name email dailyStreak");
    res.json({ leaderboard });
  } catch (err) {
    console.error("Error fetching leaderboard:", err);
    res.status(500).json({ message: "Error fetching leaderboard" });
  }
});

// ✅ POST: Add New User
router.post("/users", protect, async (req, res) => {
  try {
    const { name, email, dailyStreak } = req.body;
    if (!name || !email)
      return res.status(400).json({ message: "Name and Email required" });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "User with this email already exists" });

    const newUser = await User.create({
      name,
      email,
      dailyStreak: dailyStreak || 0,
      password: "123456", // default password (optional)
    });

    res.status(201).json({ message: "User created", user: newUser });
  } catch (err) {
    console.error("Error adding user:", err);
    res.status(500).json({ message: "Error adding user" });
  }
});

// ✅ PUT: Update User
router.put("/users/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
    res.json({ message: "User updated", user: updatedUser });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Error updating user" });
  }
});

// ✅ DELETE: Remove User
router.delete("/users/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.json({ message: "User deleted" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "Error deleting user" });
  }
});

export default router;
