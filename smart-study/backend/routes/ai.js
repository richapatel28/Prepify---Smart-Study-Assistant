// backend/routes/ai.js
import express from 'express';
import { generateResponse } from '../services/geminiService.js';
const router = express.Router();

router.post('/command', async (req, res) => {
  const { userId, message } = req.body;
  try {
    const aiResponse = await generateResponse(message, userId);
    res.json({ success: true, data: aiResponse });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
