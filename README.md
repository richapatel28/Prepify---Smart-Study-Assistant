🎓 Prepify – Smart Study Assistant
An AI-powered study platform that helps students organize, learn, and prepare efficiently through smart notes, quizzes, to-do tasks, and analytics — all powered by AI.

🧠 Overview
Prepify is an intelligent and modern web application that combines productivity with AI-driven learning.
It allows students to take notes, manage their study schedule, attempt quizzes, generate flowcharts and 5-mark answers using AI (Gemini), and track progress through an analytics dashboard.

Prepify acts as your personal study companion, helping you learn smarter, stay consistent, and achieve your goals efficiently.

✨ Features
🎯 Core Modules
📝 Notes Management – Create, view, and organize notes topic-wise.
🧩 AI Flowchart Generator – Auto-generate process flowcharts from notes using Google Gemini AI.
📋 To-Do Tasks with AI Answers – Create study questions, select multiple, and generate 5-mark answers instantly.
📊 Analytics Dashboard – Track study progress, daily streak, activity, and productivity.
🎮 Quiz Section – Attempt quizzes by topic and view performance results.
⚙️ User Settings – Update name, email, and view streak & account details.
🤖 AI Chatbot – Interactive chat assistant for quick learning help.
📱 Responsive UI – Works smoothly on all devices (desktop, tablet, and mobile).
🧩 Tech Stack
🖥️ Frontend
React.js (TypeScript) – Component-based UI framework
Tailwind CSS – Modern styling and responsiveness
Lucide Icons – Minimal vector icons
Axios / Fetch – API communication
⚙️ Backend
Node.js + Express.js – RESTful API and routing
MongoDB + Mongoose – Database for users, notes, quizzes, todos
JWT Authentication – Secure login and user sessions
Google Gemini API – AI answer and flowchart generation
Nodemailer – Email welcome and contact form integration
🚀 Installation & Setup
Follow these steps to run Prepify – Smart Study Assistant on your local machine.

⚙️ Setup Backend (Server)
Navigate to the backend folder

cd backend
Install dependencies

npm install
This installs packages like Express, Mongoose, JWT, Nodemailer, and others.

Create a .env file inside backend/ folder and add:

MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/prepify
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_google_gemini_api_key
PORT=5000
Explanation:

MONGO_URI → MongoDB connection string (use Atlas or local MongoDB)
JWT_SECRET → any random secret string for authentication
GEMINI_API_KEY → your API key from Google AI Studio 🔗 Get it from: https://aistudio.google.com/app/apikey
PORT → default backend port (5000)
Start the backend server

npm start
Or, if you have Nodemon installed:

npx nodemon index.js
✅ You should see:

Server running on port 5000
MongoDB connected successfully
💻 Setup Frontend (Client)
Open a new terminal (keep backend running) Navigate to the frontend directory:

cd ../smart-study
Install dependencies

npm install
Start the React development server

npm run dev
Open your browser and go to:

http://localhost:5173
✅ You should now see the Prepify Dashboard login screen.

🔑 Create Default User (Optional)
You can register a new user directly from the app’s Register page. Alternatively, manually insert a user in MongoDB for testing:

{
  "name": "Aarmee Patel",
  "email": "aarmee@example.com",
  "password": "123456"
}
Then log in using that email and password.

🧠 Connecting Backend and Frontend
Your frontend automatically connects to:

http://localhost:5000/api
If your backend runs on another port, update the base URL in: smart-study/src/config.js Example:

export const BASE_URL = "http://localhost:5000/api";
⚙️ Testing AI Features
To verify that Google Gemini AI integration is working:

Go to Notes Section → Add some content → Click Generate Flowchart
Go to To-Do Section → Add questions → Select multiple → Click Generate Answers
If setup is correct, you’ll see AI-generated content on screen.

🧾 Folder Structure Summary
Prepify-Smart-Study-Assistant/
│
├── backend/                 # Express + MongoDB API
│   ├── controllers/         # API logic (notes, user, ai, etc.)
│   ├── routes/              # API endpoints
│   ├── models/              # MongoDB schemas
│   ├── middleware/          # JWT authentication
│   ├── services/            # Google Gemini AI integration
│   ├── index.js             # Server entry point
│   ├── .env                 # Environment variables
│
├── smart-study/             # React frontend
│   ├── src/
│   │   ├── components/      # UI pages (Notes, Todo, Quiz, etc.)
│   │   ├── App.tsx          # Main app entry
│   │   ├── router.tsx       # Route navigation
│   │   ├── index.css        # Styling
│   └── package.json         # Frontend dependencies
│
└── package.json             # Root config
🪄 Future Scope

AI-based exam preparation suggestions

Study time tracking and focus timer

Collaboration between students

Voice command-based assistant

Integration with Google Calendar for reminders

🏁 Conclusion

Prepify is designed to revolutionize how students learn by combining technology, AI, and simplicity. It provides a single digital platform to manage study routines efficiently — anytime, anywhere. 🌟
