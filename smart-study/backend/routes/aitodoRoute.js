import express from "express";
import { sendToGemini } from "../services/geminiService.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/generateAnswers", protect, async (req, res) => {
  try {
    const { questions } = req.body;

    if (!questions || !questions.length) {
      return res.status(400).json({ success: false, message: "No tasks provided" });
    }

    // Build structured AI prompt
    const aiPrompt = `
You are an expert academic assistant.

Analyze the following tasks carefully and write clear, detailed, multi-paragraph explanations for each task.
Each answer must be descriptive (at least 5-8 lines), academic, and to the point.

Return only valid JSON, exactly in this format:
{
  "answers": {
    "Task 1": "Your detailed answer here...",
    "Task 2": "Your detailed answer here..."
  }
}

Tasks:
${questions.map((q, i) => `Task ${i + 1}: ${q}`).join("\n")}
`;

    // Send to Gemini
    const responseText = await sendToGemini(aiPrompt);

    // Clean and parse response
    const cleanText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleanText);
    } catch (e) {
      console.error("❌ JSON Parse Error:", e);
      console.error("Raw Response:", responseText);
      return res.json({
        success: true,
        answers: {
          "Error": "AI response could not be parsed properly. Try again.",
        },
      });
    }

    res.json({ success: true, answers: parsed.answers || parsed });
  } catch (err) {
    console.error("🔥 AI Todo generation error:", err);
    res.status(500).json({ success: false, message: "Failed to generate answers" });
  }
});

export default router;
