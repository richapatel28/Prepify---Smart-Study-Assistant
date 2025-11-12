import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

import authRoute from "./routes/authRoute.js";
import chatRoute from "./routes/chatRoute.js";
import notesRoute from "./routes/notesRoute.js";
import quizRoute from "./routes/quizRoute.js";
import todoRoute from "./routes/todoRoute.js";
import analyticsRoute from "./routes/analyticsRoute.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoute from "./routes/adminRoute.js";
import flowchartRoute from "./routes/flowchart.js";
import contactRoute from "./routes/contactRoute.js";
import aitodoRoute from "./routes/aitodoRoute.js";


dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoute);
app.use("/api/chat", chatRoute);
app.use("/api/notes", notesRoute);
app.use("/api/quiz", quizRoute);
app.use("/api/todo", todoRoute);
app.use("/api/analytics", analyticsRoute);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoute);
app.use("/api/flowchart", flowchartRoute);
app.use("/api/contact", contactRoute);
app.use("/api/aitodo", aitodoRoute);



// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Backend running on http://localhost:${PORT}`));
