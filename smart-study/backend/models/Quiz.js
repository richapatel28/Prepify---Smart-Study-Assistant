import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  topic: { type: String, required: true },
  questions: [
    {
      question: String,
      options: [String],
      answer: String,
      userAnswer: String,
    },
  ],
  score: Number,
  maxScore: { type: Number, default: 0 },    // optional: total available for quiz
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model("Quiz", quizSchema);
