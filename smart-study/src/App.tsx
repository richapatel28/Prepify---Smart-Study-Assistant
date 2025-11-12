import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import LandingPage from "./LandingPage";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Notes from "./components/Notes";
import Todo from "./components/Todo";
import Quiz from "./components/Quiz";
import AdminDashboard from "./components/AdminDashboard";
import './index.css';  
import FlowchartPage from "./components/Flowchart";
import AboutUs from "./components/AboutUs";
import ContactUs from "./components/ContactUs";
import PrivacyPolicy from "./components/PrivacyPolicy";
import AiTodoResults from "./components/AiTodoResults";

function App() {
  return (
    <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />}/>
           <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/ai-todo-results" element={<AiTodoResults />} />
            <Route path="/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
            <Route path="/quiz" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
            <Route path="/todo" element={<ProtectedRoute><Todo /></ProtectedRoute>} />
             <Route path="/admin-dashboard" element={<AdminDashboard />} />
           <Route path="/flowchart/:topic" element={<ProtectedRoute><FlowchartPage /></ProtectedRoute>} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
    </AuthProvider>
  );
}

export default App;
