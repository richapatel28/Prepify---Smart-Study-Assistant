import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Todo from "../models/Todo.js";

const router = express.Router();

// Fetch all todos OR topic-specific todos
router.get("/", protect, async (req, res) => {
  try {
    const topic = req.query.topic;
    const filter = { user: req.user.id };
    if (topic) filter.topic = topic;

    const todos = await Todo.find(filter).sort({ created_at: -1 });

    // If topic specified, return only that topic's todos
    if (topic) return res.json(todos);

    // Else, group todos by topic
    const topics = {};
    todos.forEach((t) => {
      const tpc = t.topic || "General"; // default topic if none
      if (!topics[tpc]) topics[tpc] = [];
      topics[tpc].push(t);
    });

    res.json(topics);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch todos" });
  }
});

export default router;
