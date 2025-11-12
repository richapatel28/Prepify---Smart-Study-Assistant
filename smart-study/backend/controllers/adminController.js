// backend/controllers/adminController.js
import User from "../models/User.js";

// 📊 GET ADMIN DASHBOARD STATS
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ dailyStreak: { $gt: 0 } });

    const totalStreaks = await User.aggregate([
      { $group: { _id: null, total: { $sum: "$dailyStreak" } } },
    ]);

    const avgStreak = totalUsers
      ? Math.round(totalStreaks[0]?.total / totalUsers)
      : 0;

    res.json({
      totalUsers,
      activeUsers,
      avgStreak,
    });
  } catch (error) {
    console.error("Admin Stats Error:", error);
    res.status(500).json({ message: "Failed to fetch admin stats" });
  }
};

// 🏆 GET LEADERBOARD
export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.find({})
      .sort({ dailyStreak: -1 })
      .limit(10)
      .select("name email dailyStreak");

    res.json({ leaderboard });
  } catch (error) {
    console.error("Leaderboard Error:", error);
    res.status(500).json({ message: "Failed to fetch leaderboard" });
  }
};
