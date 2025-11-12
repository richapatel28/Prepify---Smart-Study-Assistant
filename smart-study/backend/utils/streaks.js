// utils/streaks.js
import User from "../models/User.js";

export const updateUserStreak = async (userId) => {
  const user = await User.findById(userId);
  if (!user) return;

  const today = new Date();
  const lastActive = user.lastActiveAt ? new Date(user.lastActiveAt) : null;

  if (!lastActive) {
    user.dailyStreak = 1;
  } else {
    const diffDays = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) user.dailyStreak += 1;
    else if (diffDays > 1) user.dailyStreak = 1;
  }

  user.lastActiveAt = today;
  await user.save();
  return user.dailyStreak;
};
