import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import AIChat from "./AIChat";
import Notes from "./Notes";
import Quiz from "./Quiz";
import Todo from "./Todo";
import Analytics from "./Analytics";
import UserSettings from "./UserSettings";
import AboutUs from "./AboutUs";
import Footer from "./Footer";
import { MessageCircle, Flame } from "lucide-react";

const Dashboard: React.FC<{ userName?: string }> = ({ userName }) => {
  const [activeSection, setActiveSection] = useState<string>("analytics");
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [userData, setUserData] = useState<any>(null);
  const [greeting, setGreeting] = useState<string>("");

  // ✅ Generate greeting message based on time
  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting("Good morning");
    else if (hours < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  // ✅ Fetch user streak & info from backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch("http://localhost:5000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (data.user) {
          setUserData(data.user);
        } else {
          console.warn("No user data found:", data);
        }
      } catch (err) {
        console.error("Failed to fetch user info:", err);
      }
    };

    fetchUserData();
  }, []);

  const refreshData = (section?: string) => {
    setRefreshKey((prev) => prev + 1);
    if (section) setActiveSection(section);
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-black via-gray-900 to-cyan-900 text-white font-sans overflow-hidden">
      {/* Cyan Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M40 0 L0 0 0 40" fill="none" stroke="#00FFFF" strokeWidth="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-16 left-16 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-float-slow" />
        <div
          className="absolute bottom-16 right-16 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float-slow"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float-slow"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 relative z-10">
        <Sidebar onSelect={setActiveSection} />

        <main className="flex-1 p-6 overflow-y-auto">
          {/* 🔥 Greeting & Streak Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">
              {greeting}, {userData?.name ? userData.name : userName || "Learner"} 👋
            </h1>

            {userData && (
              <div className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2 rounded-full shadow-lg">
                <Flame size={20} className="text-white animate-pulse" />
                <span className="font-semibold text-white">
                  {userData.dailyStreak || 0}-Day Streak
                </span>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="glass-card rounded-3xl p-8 shadow-2xl min-h-[85vh] transition-all hover:shadow-cyan-500/20 duration-300">
            {activeSection === "analytics" && <Analytics refreshKey={refreshKey} />}
            {activeSection === "notes" && <Notes refreshKey={refreshKey} />}
            {activeSection === "quiz" && <Quiz refreshKey={refreshKey} />}
            {activeSection === "todo" && <Todo refreshKey={refreshKey} />}
            {activeSection === "settings" && <UserSettings />}
            {activeSection === "about" && <AboutUs />}
          </div>
        </main>
      </div>

      {/* Floating AI Chat Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-8 right-8 bg-gradient-to-tr from-cyan-500 via-blue-500 to-purple-500 hover:scale-110 transform transition-all duration-300 text-white p-5 rounded-2xl shadow-2xl flex items-center justify-center animate-glow z-50"
      >
        <MessageCircle size={28} className="animate-bounce" />
      </button>

      {/* AI Chat Modal */}
      {isChatOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <AIChat
            onClose={() => setIsChatOpen(false)}
            onSectionChange={(section) => setActiveSection(section)}
            refreshData={refreshData}
          />
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Dashboard;
