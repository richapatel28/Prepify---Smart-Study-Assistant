import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Quiz from "../models/Quiz.js";

const router = express.Router();

// ✅ GET all quizzes OR topic-specific quizzes
router.get("/", protect, async (req, res) => {
  try {
    const topic = req.query.topic;
    const filter = { user: req.user.id };
    if (topic) filter.topic = topic;

    const quizzes = await Quiz.find(filter).sort({ created_at: -1 });

    if (topic) return res.json(quizzes);

    const topics = {};
    quizzes.forEach((q) => {
      if (!topics[q.topic]) topics[q.topic] = [];
      topics[q.topic].push(q);
    });

    res.json(topics);
  } catch (err) {
    console.error("Quiz fetch error:", err);
    res.status(500).json({ message: "Failed to fetch quizzes" });
  }
});


// ✅ POST — Save / Update quiz score after completion
router.post("/score", protect, async (req, res) => {
  try {
    const { topic, score } = req.body;

    // Find latest quiz for this user + topic
    const existingQuiz = await Quiz.findOne({ user: req.user.id, topic })
      .sort({ created_at: -1 });

    if (existingQuiz) {
      existingQuiz.score = score;
      await existingQuiz.save();
      return res.json({ message: "✅ Score updated successfully" });
    } else {
      // Fallback: create new quiz if none found
      const newQuiz = new Quiz({
        user: req.user.id,
        topic,
        questions: [],
        score,
      });
      await newQuiz.save();
      return res.json({ message: "✅ Score saved (new entry)" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "❌ Failed to save or update score" });
  }
});
export default router;