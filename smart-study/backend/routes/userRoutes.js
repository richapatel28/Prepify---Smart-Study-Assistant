import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Fetch logged-in user profile
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Update user profile
router.put("/update", protect, async (req, res) => {
  try {
    const { name, email } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true }
    ).select("-password");

    res.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ success: false, message: "Failed to update profile" });
  }
});

export default router;
