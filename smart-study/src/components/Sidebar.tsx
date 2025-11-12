import React from "react";
import {
  BarChart2,
  BookOpen,
  ListChecks,
  FileText,
  Settings,
  Info,
  LogOut,
  GraduationCap,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  onSelect: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelect }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { name: "analytics", label: "Analytics", icon: <BarChart2 /> },
    { name: "notes", label: "Notes", icon: <BookOpen /> },
    { name: "quiz", label: "Quiz", icon: <FileText /> },
    { name: "todo", label: "To-Do", icon: <ListChecks /> },
    { name: "settings", label: "Settings", icon: <Settings /> },
    { name: "about", label: "About Us", icon: <Info /> },
    { name: "logout", label: "Logout", icon: <LogOut /> },
  ];

  const handleClick = (name: string) => {
    if (name === "logout") {
      logout();
      navigate("/");
    } else {
      onSelect(name);
    }
  };

  return (
    <aside className="w-72 flex-shrink-0 p-6 glass-card border-r border-white/10 flex flex-col space-y-3">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 flex items-center justify-center shadow-lg animate-glow">
          <GraduationCap className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-2xl font-black gradient-text">Prepify</h2>
      </div>
      
      {menuItems.map((item) => (
        <button
          key={item.name}
          onClick={() => handleClick(item.name)}
          className="flex items-center space-x-3 p-4 rounded-2xl glass-button transition-all duration-300 text-white hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-purple-500/20 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20"
        >
          <span className="text-cyan-400">{item.icon}</span>
          <span className="font-medium">{item.label}</span>
        </button>
      ))}
    </aside>
  );
};

export default Sidebar;
