// backend/services/geminiService.js
import axios from "axios";

export const sendToGemini = async (message) => {
  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY) throw new Error("Missing GEMINI_API_KEY");

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        contents: [{ role: "user", parts: [{ text: message }] }],
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return text || "No response from AI.";
  } catch (err) {
    console.error("Gemini API Error:", err.response?.data || err.message);
    throw new Error("AI connection failed");
  }
};
