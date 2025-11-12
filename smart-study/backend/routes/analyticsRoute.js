import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Quiz from "../models/Quiz.js";
import Note from "../models/Note.js";
import User from "../models/User.js";
import mongoose from "mongoose";

const router = express.Router();

// GET /api/analytics
router.get("/", protect, async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch user name
    const user = await User.findById(userId).select("name");
    const userName = user?.name || "User";

    // Total topics studied (from quizzes + notes)
    const quizTopics = await Quiz.distinct("topic", { user: userId });
    const noteTopics = await Note.distinct("topic", { user: userId });
    const allTopics = Array.from(new Set([...quizTopics, ...noteTopics]));
    const totalTopics = allTopics.length;

    // Total quizzes taken
    const quizzesTaken = await Quiz.countDocuments({ user: userId });

    // Total notes taken
    const notesTaken = await Note.countDocuments({ user: userId });

    // Recent 5 quiz scores
    const recentQuizzes = await Quiz.find({ user: userId })
      .sort({ created_at: -1 })
      .limit(5)
      .select("topic score created_at");

    const recentScores = recentQuizzes.map((q) => ({
      quiz: q.topic,
      score: q.score || 0,
    }));

    // Activity trend: last 7 days
    const today = new Date();
    const past7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      return d.toISOString().slice(0, 10); // format YYYY-MM-DD
    }).reverse();

    const activityTrend = await Promise.all(
      past7Days.map(async (dateStr) => {
        const start = new Date(dateStr + "T00:00:00Z");
        const end = new Date(dateStr + "T23:59:59Z");

        const quizzes = await Quiz.countDocuments({
          user: userId,
          created_at: { $gte: start, $lte: end },
        });

        const notes = await Note.countDocuments({
          user: userId,
          created_at: { $gte: start, $lte: end },
        });

        // Topics studied = unique topics in quizzes + notes that day
        const dailyQuizTopics = await Quiz.distinct("topic", {
          user: userId,
          created_at: { $gte: start, $lte: end },
        });
        const dailyNoteTopics = await Note.distinct("topic", {
          user: userId,
          created_at: { $gte: start, $lte: end },
        });
        const dailyTopics = Array.from(new Set([...dailyQuizTopics, ...dailyNoteTopics]));

        return {
          date: dateStr,
          quizzes,
          notes,
          topics: dailyTopics.length,
        };
      })
    );

    res.json({
      userName,
      totalTopics,
      quizzesTaken,
      notesTaken,
      recentScores,
      activityTrend,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
});

export default router;
