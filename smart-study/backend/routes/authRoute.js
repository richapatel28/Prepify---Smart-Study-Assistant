import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendEmail } from "../utils/email.js";

const router = express.Router();

// ✅ REGISTER
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    await sendEmail({
      to: email,
     subject: "🎓 Welcome to Prepify — Your Smart Study Companion!",

html: `
  <div style="font-family: 'Segoe UI', Roboto, Arial, sans-serif; background: #f8fafc; padding: 30px;">
    <div style="max-width: 600px; margin: auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
      <div style="background: linear-gradient(135deg, #06b6d4, #3b82f6, #8b5cf6); color: white; padding: 24px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">Welcome to <span style="color: #fff176;">Prepify</span> 🎉</h1>
      </div>

      <div style="padding: 24px; color: #333;">
        <p style="font-size: 16px;">Hey <strong>${name}</strong>,</p>
        <p style="font-size: 15px; line-height: 1.6;">
          We're thrilled to have you on board! 🚀<br/>
          Prepify is designed to make your study journey smarter, more organized, and way more effective.
        </p>

        <p style="font-size: 15px; line-height: 1.6;">
          Explore interactive notes, AI-powered assistance, smart quizzes, and personalized insights — all crafted to help you reach your academic goals faster.
        </p>
        <p style="font-size: 14px; color: #555;">
          Welcome aboard, and get ready to study smarter with Prepify! 💡<br/>
          <br/>
          Cheers,<br/>
          <strong>The Prepify Team</strong>
        </p>
      </div>

      <div style="background: #f1f5f9; padding: 12px; text-align: center; font-size: 12px; color: #6b7280;">
        © ${new Date().getFullYear()} Prepify. All rights reserved.
      </div>
    </div>
  </div>
`
,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ LOGIN + ADMIN CHECK + STREAK LOGIC
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // 🔐 Admin credentials from .env
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign({ email, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "7d" });
      return res.json({
        token,
        user: { name: "Admin", email, role: "admin" },
      });
    }

    // 🔹 Normal user login
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    // 🌟 Daily streak
    const today = new Date();
    const lastActive = user.lastActiveAt ? new Date(user.lastActiveAt) : null;

    if (!lastActive) {
      user.dailyStreak = 1;
    } else {
      const diffDays = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) user.dailyStreak += 1;
    }

    user.lastActiveAt = today;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        dailyStreak: user.dailyStreak,
        role: "user",
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
