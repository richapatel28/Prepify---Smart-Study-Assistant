import express from "express";
import { sendToGemini } from "../services/geminiService.js";
import Note from "../models/Note.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/generate", protect, async (req, res) => {
  const { topic } = req.body;
  if (!topic)
    return res
      .status(400)
      .json({ success: false, message: "Topic is required" });

  try {
    const notes = await Note.find({ user: req.user.id, topic });
    if (!notes.length)
      return res
        .status(404)
        .json({ success: false, message: "No notes found for this topic" });

    const combinedNotes = notes.map((n) => n.content).join("\n");

    // 🧠 Improved AI prompt
    const aiPrompt = `
You are a flowchart generator.

Analyze the following notes and create a clear, logical flow of steps.
Return ONLY a valid JSON array (no markdown, no explanations).

Each item must follow this structure exactly:
[
  { "id": 1, "text": "Start", "next": [2] },
  { "id": 2, "text": "Process input", "next": [3] },
  { "id": 3, "text": "End", "next": [] }
]

Notes:
${combinedNotes}
`;

    const responseText = await sendToGemini(aiPrompt);

    // 🧹 Clean Gemini output (remove markdown/code fences)
    let cleanText = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // 🧩 Try parsing the result safely
    let flowchartData;
    try {
      flowchartData = JSON.parse(cleanText);
    } catch (err) {
      console.error("⚠️ AI Response Parsing Error:", err);
      console.error("Raw Response:", responseText);

      // Fallback: simple one-step flowchart
      flowchartData = [
        { id: 1, text: "Unable to parse AI response", next: [] },
      ];
    }

    // ✅ Return structured flowchart
    res.json({ success: true, data: flowchartData });
  } catch (err) {
    console.error("❌ Flowchart generation error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to generate flowchart" });
  }
});

export default router;
