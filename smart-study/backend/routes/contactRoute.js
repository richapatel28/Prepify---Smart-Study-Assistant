import express from "express";
import mongoose from "mongoose";

const router = express.Router();

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  createdAt: { type: Date, default: Date.now },
});

const Contact = mongoose.model("Contact", contactSchema);

router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    await Contact.create({ name, email, message });
    res.json({ success: true, message: "Message received" });
  } catch (err) {
    console.error("Error saving contact message:", err);
    res.status(500).json({ success: false, message: "Failed to send message" });
  }
});

export default router;
