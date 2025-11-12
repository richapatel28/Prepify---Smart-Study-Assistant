import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  topic: { type: String, required: true },
  content: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model("Note", noteSchema);
