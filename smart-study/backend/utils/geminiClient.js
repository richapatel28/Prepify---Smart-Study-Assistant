// backend/utils/geminiUtils.js

export const formatMessage = (message) => {
  // You can preprocess or sanitize the user message here
  return message.trim();
};

export const logGeminiError = (err) => {
  console.error("💥 Gemini Error:", err);
};
