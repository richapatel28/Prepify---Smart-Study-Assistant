// models/Todo.js
import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  task: { type: String, required: true },
  completed: { type: Boolean, default: false },
  topic: { type: String }, // ✅ important
}, { timestamps: true });

export default mongoose.model("Todo", todoSchema);
