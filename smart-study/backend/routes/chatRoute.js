import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Note from "../models/Note.js";
import Quiz from "../models/Quiz.js";
import Todo from "../models/Todo.js";
import { sendToGemini } from "../services/geminiService.js";

const router = express.Router();

router.post("/", protect, async (req, res) => {
  const { message, action, topic } = req.body;

  try {
    let reply = "";
    let dbAction = "";

    // Step 1: Detect intent if no action chosen yet
    if (!action) {
      const intent = await sendToGemini(
        `User said: "${message}". Decide intent: explain, quiz, todo. Reply exactly one word.`
      );

      if (intent.toLowerCase().includes("explain")) dbAction = "notes";
      else if (intent.toLowerCase().includes("quiz")) dbAction = "quiz";
      else if (intent.toLowerCase().includes("todo")) dbAction = "todo";
      else dbAction = "chat";

      reply =
        dbAction === "chat"
          ? await sendToGemini(message)
          : `Would you like me to ${dbAction}?`;

      if (dbAction !== "chat") {
        return res.json({ reply, action: "pending", topic: message });
      }

      return res.json({ reply, action: dbAction });
    }

    // Step 2: Handle user-selected action
    if (action === "notes") {
      const content = await sendToGemini(`Explain topic "${topic}" in detail.`);
      await Note.create({ user: req.user.id, topic, content });
      reply = "📝 Notes generated successfully!";
    } 
    else if (action === "quiz") {
      // AI generates 5 MCQs with correct answers
      let questionsRaw = await sendToGemini(
        `Create 5 MCQs on "${topic}" in JSON format. 
         Each question should have 4 options and specify the correct answer. 
         Format like this:
         [
           {
             "question": "Your question here",
             "options": ["Option A","Option B","Option C","Option D"],
             "answer": "Option B"
           }
         ]`
      );

      questionsRaw = questionsRaw.replace(/```json|```/g, "").trim();

      let questions;
      try {
        questions = JSON.parse(questionsRaw);
      } catch (err) {
        console.error("Failed to parse quiz JSON:", questionsRaw);
        return res.status(500).json({ reply: "Failed to generate quiz" });
      }

      await Quiz.create({ user: req.user.id, topic, questions, score: 0 });
      reply = "🧠 Quiz created successfully!";
    } 
    else if (action === "todo") {
      let tasksRaw = await sendToGemini(
        `Create study tasks for topic "${topic}" in JSON array: ["task1","task2","task3"]`
      );
      tasksRaw = tasksRaw.replace(/```json|```/g, "").trim();
      const tasks = JSON.parse(tasksRaw);

      for (const t of tasks) {
        await Todo.create({
          user: req.user.id,
          task: t,
          completed: false,
          topic
        });
      }
      reply = "📋 To-Do list created successfully!";
    }

    res.json({ reply, action, topic });
  } catch (err) {
    console.error("Chat processing error:", err);
    res.status(500).json({ reply: "AI processing failed" });
  }
});

export default router;
