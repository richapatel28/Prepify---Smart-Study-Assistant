import express from "express";
import Note from "../models/Note.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 📘 Get all notes OR topic-specific notes
router.get("/", protect, async (req, res) => {
  try {
    const topic = req.query.topic;
    const filter = { user: req.user.id };
    if (topic) filter.topic = topic;

    const notes = await Note.find(filter).sort({ created_at: -1 });

    // If topic provided, return all notes for that topic
    if (topic) {
      return res.json(notes);
    }

    // Else group by topic for list view
    const topics = {};
    notes.forEach(note => {
      if (!topics[note.topic]) topics[note.topic] = [];
      topics[note.topic].push(note);
    });

    res.json(topics);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch notes" });
  }
});

export default router;
